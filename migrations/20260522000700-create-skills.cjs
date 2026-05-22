"use strict";

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => (typeof table === "string" ? table : table.tableName) === tableName);
}

async function addColumnIfMissing(queryInterface, tableName, columnName, definition) {
  const columns = await queryInterface.describeTable(tableName);

  if (!columns[columnName]) {
    await queryInterface.addColumn(tableName, columnName, definition);
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await tableExists(queryInterface, "Skills"))) {
      await queryInterface.createTable("Skills", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        category: {
          type: Sequelize.ENUM("TECHNICAL", "SOFT", "LANGUAGE", "TOOL"),
          defaultValue: "TECHNICAL",
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
      });
    } else {
      await addColumnIfMissing(queryInterface, "Skills", "category", {
        type: Sequelize.ENUM("TECHNICAL", "SOFT", "LANGUAGE", "TOOL"),
        defaultValue: "TECHNICAL",
      });
      await addColumnIfMissing(queryInterface, "Skills", "description", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Skills");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Skills_category";');
  },
};
