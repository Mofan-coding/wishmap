export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { wish, latitude, longitude } = req.body;

  console.log('[🔍 收到数据]', { wish, latitude, longitude });

  if (!wish || !latitude || !longitude) {
    console.log('[⚠️ 缺少字段]', { wish, latitude, longitude });
    return res.status(400).json({ error: 'Missing fields' });
  }

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  console.log('[📦 使用的环境变量]', { baseId, tableName });

  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Wish: wish,
          Latitude: latitude,
          Longitude: longitude
        }
      })
    });

    const text = await response.text();  // 先拿原始内容

    if (!response.ok) {
      console.log('[❌ Airtable 写入失败]', text);
      return res.status(500).json({ error: 'Airtable write failed', detail: text });
    }

    console.log('[✅ Airtable 写入成功]', text);
    return res.status(200).json({ message: 'Success', data: JSON.parse(text) });
  } catch (err) {
    console.error('[🔥 系统错误]', err);
    return res.status(500).json({ error: 'Airtable request failed', detail: err.message });
  }
}
