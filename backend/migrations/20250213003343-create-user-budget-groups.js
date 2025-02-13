module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_budget_groups", {
      budget_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      group_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      default_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_budget_groups");
  },
};
