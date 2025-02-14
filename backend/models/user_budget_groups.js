const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User_budget_groups = sequelize.define(
    "user_budget_groups",
    {
        budget_group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        group_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        default_category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "user_budget_groups",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

User_budget_groups.associate = function (models) {
    User_budget_groups.hasMany(models.User_categories, {
        foreignKey: "budget_group_id",
        as: "categories",
    });
};

module.exports = User_budget_groups;
