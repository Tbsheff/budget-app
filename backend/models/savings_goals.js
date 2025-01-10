const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path as needed

const Savings_goals = sequelize.define('savings_goals', {
goal_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
            
        },
name: {
            type: DataTypes.STRING,
            allowNull: false,
            
            
        },
target_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            
            
        },
current_amount: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            
            
        },
deadline: {
            type: DataTypes.DATE,
            allowNull: true,
            
            
        },
created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            
            
        },
    },
    {
        tableName: 'savings_goals',
        timestamps: false, // Set to true if `createdAt` and `updatedAt` exist
    }
);

module.exports = Savings_goals;