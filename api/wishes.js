export default async function handler(req, res) {
  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableName}?view=Grid%20view&fields[]=Wish&fields[]=Latitude&fields[]=Longitude`,
      {
        headers: {
          Authorization: `Bearer ${airtableToken}`
        }
      }
    );

    const data = await response.json();

    // Debug 日志（可选）
    console.log('[📥 Airtable 返回]', JSON.stringify(data, null, 2));

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Airtable request failed', detail: err.message });
  }
}
