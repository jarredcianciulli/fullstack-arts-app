const express = require("express");

const router = express.Router();

router.get("/api/data", async (req, res) => {
  try {
    const response = await fetch(
      "https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJS?OrgID=506823"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
