const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const Default_categories = sequelize.define('default_categories', {
default_category_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
name: {
            type: DataTypes.STRING,
            allowNull: false,
            
            
        },
    },
    {
        tableName: 'default_categories',
        timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
    }
);

module.exports = Default_categories;