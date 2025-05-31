
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { wish, latitude, longitude } = req.body;

  if (!wish || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

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
          Longitude: longitude,
          Timestamp: new Date().toISOString()
        }
      })
    });

    const data = await response.json();
    res.status(200).json({ message: 'Success', data });
  } catch (err) {
    res.status(500).json({ error: 'Airtable request failed', detail: err.message });
  }
}
