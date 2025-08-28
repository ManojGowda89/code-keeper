const {sequelize} = require("../config.db")
const {DataTypes} = require("sequelize")
function generateUniqueId(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log("Generated unique ID:", result);
  return result;
}


const Snippet = sequelize.define(
  "Snippet",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () =>
        generateUniqueId(Math.floor(Math.random() * (20 - 8 + 1)) + 8), // random length between 8-20
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.TEXT, allowNull: false },
    visibility: {
      // 👈 new field added
      type: DataTypes.ENUM("public", "private"),
      allowNull: false,
      defaultValue: "public",
    },
    userInfo: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        username: "Guest",
        uid: () =>
          generateUniqueId(Math.floor(Math.random() * (20 - 8 + 1)) + 8),
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Snippet;