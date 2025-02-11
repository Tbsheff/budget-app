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

Budget_groups.associate = function (models) {
    Budget_groups.hasMany(models.User_categories, {
        foreignKey: "budget_group_id",
        as: "categories",
    });
};

module.exports = Budget_groups;