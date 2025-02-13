const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Budget_groups = sequelize.define(
    "budget_groups",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        group_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "budget_groups",
        timestamps: false,
    }
);

module.exports = Budget_groups;
