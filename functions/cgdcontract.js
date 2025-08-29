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

export default async (req, context) => {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  const keyword = searchParams.get("keyword") || "";
  const limit = searchParams.get("limit") || 20;
  const apiKey = "AebJrhT78gJiFGwhjY3tmjnNay9qXqCZ";

  const u = new URL("https://opend.data.go.th/govspending/cgdcontract");
  u.searchParams.set("api-key", apiKey);
  u.searchParams.set("year", year);
  u.searchParams.set("keyword", keyword);
  u.searchParams.set("limit", limit);

  const r = await fetch(u.toString(), {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });

  const text = await r.text(); // debug log
  console.log("UPSTREAM", r.status, u.toString(), text.slice(0, 200));

  return new Response(text, {
    headers: { "content-type": "application/json" },
  });
};