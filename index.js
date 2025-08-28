require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { connectionToDb } = require("./src/db/config.db");
const Router = require("./src/main");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// Routes
app.use("/api", Router);

// Serve frontend index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server with DB connection
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await connectionToDb(); // Ensure DB is connected before starting server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit if DB connection fails
  }
})();
