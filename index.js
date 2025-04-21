import express from "express";
import cors from "cors";
import pa11y from "pa11y";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/audit", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing ?url=" });

  try {
    const results = await pa11y(url);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Audit API listening on port ${PORT}`);
});
