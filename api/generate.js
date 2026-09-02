export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

if (!process.env.RUNWAYML_API_SECRET) {
return res.status(500).json({
error: "RUNWAYML_API_SECRET is not configured."
});
}

try {
const { prompt, ratio = "1280:720", duration = 5 } = req.body || {};

if (!prompt || typeof prompt !== "string") {
  return res.status(400).json({
    error: "A video prompt is required."
  });
}

const allowedRatios = ["1280:720", "720:1280"];
const safeRatio = allowedRatios.includes(ratio)
  ? ratio
  : "1280:720";

const safeDuration = Math.min(
  10,
  Math.max(2, Number(duration) || 5)
);

const response = await fetch(
  "https://api.dev.runwayml.com/v1/image_to_video",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RUNWAYML_API_SECRET}`,
      "X-Runway-Version": "2024-11-06"
    },
    body: JSON.stringify({
      model: "gen4.5",
      promptText: prompt,
      ratio: safeRatio,
      duration: safeDuration
    })
  }
);

const data = await response.json();

if (!response.ok) {
  return res.status(response.status).json({
    error:
      data?.error ||
      data?.message ||
      "Runway rejected the request."
  });
}

return res.status(200).json({
  id: data.id
});

} catch (error) {
return res.status(500).json({
error: error.message || "Server error while starting video generation."
});
}
}
