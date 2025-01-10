const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const User_settings = sequelize.define('user_settings', {
setting_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
            
        },
currency: {
            type: DataTypes.STRING,
            allowNull: true,
            
            
        },
timezone: {
            type: DataTypes.STRING,
            allowNull: true,
            
            
        },
theme: {
            type: DataTypes.STRING,
            allowNull: true,
            
            
        },
notifications_enabled: {
            type: DataTypes.STRING,
            allowNull: true,
            
            
        },
created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            
            
        },
    },
    {
        tableName: 'user_settings',
        timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
    }
);

module.exports = User_settings;