//* 🧪accesibility-yours-app-next-js/audit-api-fly/server.js

//* Import core dependencies
const express = require("express");
const pa11y = require("pa11y");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // * Limit abusive use

//* In-memory cache to avoid repeated audits
const cache = new Map();

//* Initialize Express server
const app = express();
const PORT = process.env.PORT || 3000;

//* Enable CORS so it can be called from any frontend (gh-pages, Vercel, etc)
app.use(cors());

//* Apply rate limiting to all routes (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // * 15 minutes window
  max: 100, // * limit each IP to 100 requests
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

//* Define the audit endpoint
app.get("/audit", async (req, res) => {
  const url = req.query.url;

  //* Validate the input URL
  if (!url) {
    return res.status(400).json({ error: "Missing ?url=" });
  }

  //* Check if URL is already cached
  if (cache.has(url)) {
    return res.json(cache.get(url)); // * Return cached results if available
  }

  try {
    //* Run the pa11y accessibility audit
    const results = await pa11y(url, {
      chromeLaunchConfig: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    //* Cap number of issues returned to protect payload size
    const limited = {
      ...results,
      issues: results.issues.slice(0, 50), // * Return only first 50 issues
    };

    cache.set(url, limited); // * Store in memory
    return res.json(limited);
  } catch (error) {
    //* Catch and return errors, especially around puppeteer/chrome issues
    return res.status(500).json({ error: error.message });
  }
});

//* Start the server
app.listen(PORT, () => {
  console.log(`Audit server running on port ${PORT}`);
});
