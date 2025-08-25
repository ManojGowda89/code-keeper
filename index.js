const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // serve frontend

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);


// Define Snippet model
const Snippet = sequelize.define("Snippet", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.TEXT, allowNull: false },
});

// Sync database
sequelize.sync().then(() => console.log("Database & tables ready!"));

// Routes

// Get all snippets
app.get("/api/snippets", async (req, res) => {
  const snippets = await Snippet.findAll({ order: [["createdAt", "DESC"]] });
  res.json(snippets);
});

// Add new snippet
app.post("/api/snippets", async (req, res) => {
  const { title, description, code } = req.body;
  try {
    const snippet = await Snippet.create({ title, description, code });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update snippet
app.put("/api/snippets/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, code } = req.body;
  try {
    const snippet = await Snippet.findByPk(id);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });
    await snippet.update({ title, description, code });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete snippet
app.delete("/api/snippets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const snippet = await Snippet.findByPk(id);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });
    await snippet.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
