// functions/cgdcontract.js
// ✅ ใช้ fetch ที่มีใน Node 18 (Netlify ใช้อยู่แล้ว) ไม่ต้องติดตั้ง node-fetch
// ✅ ใช้ CommonJS export ชัวร์สุด

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS'
        },
        body: ''
      };
    }

    const API_KEY = process.env.OPEND_API_KEY;
    if (!API_KEY) return json(500, { error: 'Missing env OPEND_API_KEY' });

    const q = new URLSearchParams(event.rawQuery || '');
    const year    = q.get('year');
    const keyword = q.get('keyword') || '';
    const limit   = q.get('limit') || '20';
    const offset  = q.get('offset') || '0';

    if (!year) return json(400, { error: 'year (พ.ศ.) is required' });

    // สร้าง URL upstream (service base)
    const u = new URL('https://govspending.data.go.th/api/service/cgdcontract');
    u.searchParams.set('api-key', API_KEY);
    u.searchParams.set('year', year);
    if (keyword) u.searchParams.set('keyword', keyword);
    u.searchParams.set('limit', limit);
    u.searchParams.set('offset', offset);

    const r = await fetch(u.toString(), { headers: { 'Accept': 'application/json' }});
    const text = await r.text();

    // ไม่พยายาม parse ซ้ำ ให้ส่งต่อดิบ ๆ (แต่ตั้ง content-type ให้แล้ว)
    return {
      statusCode: r.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: text
    };
  } catch (e) {
    return json(500, { error: String(e) });
  }
};