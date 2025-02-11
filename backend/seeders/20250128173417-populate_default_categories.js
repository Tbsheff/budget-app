module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("default_categories", [
      {
        name: "Auto & Transport",
        icon_name: "Car",
        icon_color: "text-blue-500",
      },
      {
        name: "Bills & Utilities",
        icon_name: "FileText",
        icon_color: "text-blue-500",
      },
      {
        name: "Charitable Donations",
        icon_name: "Heart",
        icon_color: "text-red-500",
      },
      {
        name: "Dining",
        icon_name: "Coffee",
        icon_color: "text-yellow-500",
      },
      {
        name: "Entertainment",
        icon_name: "Film",
        icon_color: "text-purple-500",
      },
      {
        name: "Groceries",
        icon_name: "ShoppingCart",
        icon_color: "text-green-500",
      },
      {
        name: "Health & Wellness",
        icon_name: "Activity",
        icon_color: "text-pink-500",
      },
      {
        name: "Home",
        icon_name: "Home",
        icon_color: "text-blue-600",
      },
      {
        name: "Shopping",
        icon_name: "ShoppingBag",
        icon_color: "text-green-600",
      },
      {
        name: "Uncategorized",
        icon_name: "MoreHorizontal",
        icon_color: "text-gray-500",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("default_categories", null, {});
  },
};
