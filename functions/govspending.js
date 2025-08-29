// functions/govspending.js
import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    // อ่านค่า query
    const params = new URLSearchParams(event.rawQuery || '');
    const path = params.get('path') || 'cgdcontract'; // ค่าเริ่มต้นที่ต้องการ
    params.delete('path');

    const API_KEY = process.env.OPEND_API_KEY; // ตั้งใน Netlify dashboard
    if (!API_KEY) {
      return resp(500, { error: 'Missing env OPEND_API_KEY' });
    }

    // ประกอบ URL ปลายทาง (service base)
    const upstream = new URL(`https://govspending.data.go.th/api/service/${path}`);
    // เติม api-key
    upstream.searchParams.set('api-key', API_KEY);
    // คัดลอกพารามิเตอร์อื่น ๆ
    for (const [k, v] of params.entries()) {
      if (v !== undefined && v !== '') upstream.searchParams.set(k, v);
    }

    const r = await fetch(upstream.toString(), { headers: { Accept: 'application/json' } });
    const text = await r.text();

    return {
      statusCode: r.status,
      headers: corsHeaders(),
      body: text,
    };
  } catch (e) {
    return resp(500, { error: String(e) });
  }
};

function resp(status, json) {
  return { statusCode: status, headers: corsHeaders(), body: JSON.stringify(json) };
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
  };
}
