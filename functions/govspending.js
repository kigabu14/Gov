export default {
  async fetch(req, env) {
    try {
      const url = new URL(req.url);
      const year    = url.searchParams.get('year');
      const keyword = url.searchParams.get('keyword') || '';
      const limit   = url.searchParams.get('limit') || '20';
      const offset  = url.searchParams.get('offset') || '0';

      if (!year) {
        return json(400, { error: 'year (พ.ศ.) is required' });
      }

      // ยิงไปเกตเวย์ opend (ฝั่งนี้มักผ่านกว่า)
      const upstream = new URL('https://opend.data.go.th/govspending/cgdcontract');
      upstream.searchParams.set('api-key', env.OPEND_API_KEY);   // << ตั้งเป็น Secret
      upstream.searchParams.set('year', year);
      if (keyword) upstream.searchParams.set('keyword', keyword);
      upstream.searchParams.set('limit', limit);
      upstream.searchParams.set('offset', offset);

      const r = await fetch(upstream.toString(), {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'th,en;q=0.9',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      const text = await r.text();
      const ct = r.headers.get('content-type') || '';

      // กันเคสปลายทางส่ง HTML หน้าบล็อกกลับมา
      const blocked = ct.includes('text/html') && /Access Denied|Ray ID/i.test(text);
      if (blocked) {
        return json(502, { blocked: true, note: 'Upstream WAF blocked', sample: text.slice(0, 400) });
      }

      return new Response(text, {
        status: r.status,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS'
        }
      });
    } catch (e) {
      return json(500, { error: String(e) });
    }
  }
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS'
    }
  });
}