const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); // serve frontend

function generateUniqueId(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log("Generated unique ID:", result);
  return result;
}

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
sequelize.authenticate().then(() => console.log("Database connected!")).catch(err => console.error("Database connection error:", err));
sequelize.sync();

// Define Snippet model
const Snippet = sequelize.define("Snippet", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => generateUniqueId(Math.floor(Math.random() * (20 - 8 + 1)) + 8), // random length between 8-20
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.TEXT, allowNull: false },
});

// Sync database
sequelize.sync({ force: true }).then(() => console.log("Database reset with string ID!"));


// Routes

// Get snippets with pagination
app.get("/api/snippets", async (req, res) => {
  // Get pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  
  try {
    // Create where clause for search if provided
    let whereClause = {};
    if (search) {
      whereClause = {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.iLike]: `%${search}%` } },
          { description: { [Sequelize.Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    // Get total count for pagination info
    const count = await Snippet.count({ where: whereClause });
    
    // Get snippets with pagination
    const snippets = await Snippet.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });
    
    // Return pagination metadata along with snippets
    res.json({
      snippets,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
        hasMore: page < Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error("Error fetching snippets:", err);
    res.status(500).json({ error: err.message });
  }
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


app.get("/api/snippets/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const snippet = await Snippet.findByPk(id);
    if (!snippet) return res.status(404).json({ error: "Snippet not found" });
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));