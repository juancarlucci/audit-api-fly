//* 🧪 accessibility-audit-server/server.js

//* Import core dependencies
const express = require("express");
const pa11y = require("pa11y");
const cors = require("cors");

//* Initialize Express server
const app = express();
const PORT = process.env.PORT || 3000;

//* Enable CORS so it can be called from any frontend (gh-pages, Vercel, etc)
app.use(cors());

//* Define the audit endpoint
app.get("/audit", async (req, res) => {
  const url = req.query.url;

  //* Validate the input URL
  if (!url) {
    return res.status(400).json({ error: "Missing ?url=" });
  }

  try {
    //* Run the pa11y accessibility audit
    const results = await pa11y(url, {
      chromeLaunchConfig: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });
    return res.json(results);
  } catch (error) {
    //* Catch and return errors, especially around puppeteer/chrome issues
    return res.status(500).json({ error: error.message });
  }
});

//* Start the server
app.listen(PORT, () => {
  console.log(`Audit server running on port ${PORT}`);
});
