const { DataTypes } = require("sequelize");
const { sequelize } = require("../config.db");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = User;
