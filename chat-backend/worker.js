// KOTOMORY live chat relay for Cloudflare Workers (free plan is enough).
// Покупатель пишет в чат на сайте → сообщение приходит тебе в Telegram.
// Ты отвечаешь в Telegram командой «Ответить» (Reply) → ответ появляется у покупателя на сайте.
//
// Нужно: переменные BOT_TOKEN, CHAT_ID, WEBHOOK_SECRET, ALLOW_ORIGIN и KV-хранилище CHAT_KV.
const cors = (env) => ({
  'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
});
const json = (env, data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors(env) } });
const tg = (env, method, body) =>
  fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }).then((r) => r.json());

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(env) });

    // 1) Покупатель отправил сообщение
    if (url.pathname === '/send' && req.method === 'POST') {
      const { sid, text, page, cart } = await req.json();
      if (!sid || !text || String(text).length > 800) return json(env, { ok: false }, 400);
      const msg = `💬 Чат KOTOMORY · ${String(sid).slice(0, 6)}\n\n${text}\n\n${cart ? 'Корзина: ' + cart + '\n' : ''}${page || ''}\n\n↩️ Ответь на это сообщение (Reply), и ответ уйдёт покупателю на сайт.`;
      const r = await tg(env, 'sendMessage', { chat_id: env.CHAT_ID, text: msg });
      if (r.ok) await env.CHAT_KV.put(`m:${r.result.message_id}`, sid, { expirationTtl: 60 * 60 * 24 * 14 });
      return json(env, { ok: !!r.ok });
    }

    // 2) Сайт спрашивает, есть ли новые ответы
    if (url.pathname === '/poll' && req.method === 'GET') {
      const sid = url.searchParams.get('sid');
      const after = Number(url.searchParams.get('after') || 0);
      const all = JSON.parse((await env.CHAT_KV.get(`r:${sid}`)) || '[]');
      return json(env, { replies: all.filter((m) => m.ts > after) });
    }

    // 3) Telegram присылает твой ответ (webhook)
    if (url.pathname === '/tg' && req.method === 'POST') {
      if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.WEBHOOK_SECRET) return new Response('no', { status: 403 });
      const up = await req.json();
      const m = up.message;
      if (!m || String(m.chat.id) !== String(env.CHAT_ID) || !m.text) return new Response('ok');
      if (!m.reply_to_message) {
        await tg(env, 'sendMessage', { chat_id: env.CHAT_ID, text: 'Чтобы ответить покупателю, нажми «Ответить» (Reply) на его сообщение.' });
        return new Response('ok');
      }
      const sid = await env.CHAT_KV.get(`m:${m.reply_to_message.message_id}`);
      if (sid) {
        const all = JSON.parse((await env.CHAT_KV.get(`r:${sid}`)) || '[]');
        all.push({ t: m.text, ts: Date.now() });
        await env.CHAT_KV.put(`r:${sid}`, JSON.stringify(all.slice(-50)), { expirationTtl: 60 * 60 * 24 * 14 });
      }
      return new Response('ok');
    }
    return new Response('KOTOMORY chat relay', { headers: cors(env) });
  },
};
