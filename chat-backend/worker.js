// KOTOMORY live chat relay for Cloudflare Workers (free plan is enough).
// Покупатель пишет в чат на сайте → сообщение приходит тебе в Telegram.
// Ты отвечаешь в Telegram командой «Ответить» (Reply) → ответ появляется у покупателя на сайте.
//
// Нужно: переменные BOT_TOKEN, CHAT_ID, WEBHOOK_SECRET, ALLOW_ORIGIN и KV-хранилище CHAT_KV.

// ---- hardening helpers ----
const MAX_BODY = 4096;                       // bytes accepted from the site
const SID_RE = /^[a-z0-9]{6,12}$/;            // visitor id format used by the site
async function readJson(req) {
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) return null;
  const txt = await req.text();
  if (txt.length > MAX_BODY) return null;
  try { return JSON.parse(txt); } catch (_) { return null; }
}
// fixed-window rate limit per visitor id and per IP, stored in KV
async function limited(env, key, max, windowSec) {
  const k = 'rl:' + key;
  const n = Number((await env.CHAT_KV.get(k)) || 0);
  if (n >= max) return true;
  await env.CHAT_KV.put(k, String(n + 1), { expirationTtl: windowSec });
  return false;
}
const clientIp = (req) => req.headers.get('CF-Connecting-IP') || 'unknown';
const tooMany = (env) => json(env, { ok: false, error: 'rate_limited' }, 429);
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, n);

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

    // 1) Покупатель отправил сообщение (чат)
    if (url.pathname === '/send' && req.method === 'POST') {
      const body = await readJson(req);
      if (!body) return json(env, { ok: false, error: 'bad_request' }, 400);
      const sid = String(body.sid || ''), text = clean(body.text, 800);
      if (!SID_RE.test(sid) || !text.trim()) return json(env, { ok: false, error: 'bad_request' }, 400);
      if (await limited(env, 'send:' + sid, 8, 60) || await limited(env, 'ip:' + clientIp(req), 30, 60)) return tooMany(env);
      const page = clean(body.page, 120), cart = clean(body.cart, 300);
      const msg = `💬 Чат KOTOMORY · ${String(sid).slice(0, 6)}\n\n${text}\n\n${cart ? 'Корзина: ' + cart + '\n' : ''}${page || ''}\n\n↩️ Ответь на это сообщение (Reply), и ответ уйдёт покупателю на сайт.`;
      const r = await tg(env, 'sendMessage', { chat_id: env.CHAT_ID, text: msg });
      if (r.ok) await env.CHAT_KV.put(`m:${r.result.message_id}`, sid, { expirationTtl: 60 * 60 * 24 * 14 });
      return json(env, { ok: !!r.ok });
    }

    // 1b) Уведомление «на сайт кто-то зашёл» (без личных данных: только страна, устройство, страница)
    if (url.pathname === '/visit' && req.method === 'POST') {
      let v = (await readJson(req)) || {};
      if (await limited(env, 'visit:' + clientIp(req), 20, 300)) return tooMany(env);
      v = { w: Number(v.w) | 0, h: Number(v.h) | 0, touch: !!v.touch, page: clean(v.page, 80), ref: clean(v.ref, 120) };
      const now = Date.now();
      const last = Number((await env.CHAT_KV.get('v:last')) || 0);
      const pending = Number((await env.CHAT_KV.get('v:pending')) || 0);
      const every = Number(env.VISIT_EVERY_SEC || 120) * 1000; // не чаще одного уведомления в 2 минуты
      if (now - last < every) {
        await env.CHAT_KV.put('v:pending', String(pending + 1), { expirationTtl: 3600 });
        return json(env, { ok: true, queued: true });
      }
      const ua = v.touch ? '📱 телефон' : '💻 компьютер';
      const country = (req.cf && req.cf.country) || '—';
      const when = new Date(now).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
      const more = pending ? `\n➕ Ещё ${pending} визит(ов) за это время` : '';
      await tg(env, 'sendMessage', {
        chat_id: env.CHAT_ID,
        text: `👀 На сайт KOTOMORY кто-то зашёл\n${ua} · ${v.w || '?'}×${v.h || '?'}\n🌍 Страна: ${country}\n🔗 Откуда: ${String(v.ref || 'напрямую').slice(0, 120)}\n📄 Страница: ${String(v.page || '/').slice(0, 80)}\n🕒 ${when} (МСК)${more}`,
      });
      await env.CHAT_KV.put('v:last', String(now), { expirationTtl: 3600 });
      await env.CHAT_KV.put('v:pending', '0', { expirationTtl: 3600 });
      return json(env, { ok: true });
    }

    // 2) Сайт спрашивает, есть ли новые ответы
    if (url.pathname === '/poll' && req.method === 'GET') {
      const sid = url.searchParams.get('sid') || '';
      if (!SID_RE.test(sid)) return json(env, { replies: [] }, 400);
      if (await limited(env, 'poll:' + sid, 60, 60)) return tooMany(env);
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
