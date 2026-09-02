export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RUNWAYML_API_SECRET) {
    return res.status(500).json({
      error: "RUNWAYML_API_SECRET is not configured."
    });
  }

  const id = req.query?.id;

  if (!id) {
    return res.status(400).json({
      error: "Missing task id."
    });
  }

  try {
    const response = await fetch(
      `https://api.dev.runwayml.com/v1/tasks/${encodeURIComponent(id)}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.RUNWAYML_API_SECRET}`,
          "X-Runway-Version": "2024-11-06"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || "Could not retrieve task."
      });
    }

    return res.status(200).json({
      id: data.id,
      status: data.status,
      output: data.output || null
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error while checking generation."
    });
  }
}
