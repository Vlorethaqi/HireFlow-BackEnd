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

async function addIndexIfMissing(queryInterface, tableName, fields, options) {
  const indexes = await queryInterface.showIndex(tableName);
  const exists = indexes.some((index) => index.name === options.name);

  if (!exists) {
    await queryInterface.addIndex(tableName, fields, options);
  }
}

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await tableExists(queryInterface, "Jobs"))) {
      await queryInterface.createTable("Jobs", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        salaryMin: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        salaryMax: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        employmentType: {
          type: Sequelize.ENUM("FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM("OPEN", "CLOSED"),
          defaultValue: "OPEN",
        },
        deadline: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        departmentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Departments",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        companyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Companies",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
      await addColumnIfMissing(queryInterface, "Jobs", "location", { type: Sequelize.STRING, allowNull: true });
      await addColumnIfMissing(queryInterface, "Jobs", "salaryMin", { type: Sequelize.FLOAT, allowNull: true });
      await addColumnIfMissing(queryInterface, "Jobs", "salaryMax", { type: Sequelize.FLOAT, allowNull: true });
      await addColumnIfMissing(queryInterface, "Jobs", "status", {
        type: Sequelize.ENUM("OPEN", "CLOSED"),
        defaultValue: "OPEN",
      });
      await addColumnIfMissing(queryInterface, "Jobs", "deadline", { type: Sequelize.DATE, allowNull: true });
    }

    await addIndexIfMissing(queryInterface, "Jobs", ["title"], { name: "jobs_title_idx" });
    await addIndexIfMissing(queryInterface, "Jobs", ["location"], { name: "jobs_location_idx" });
    await addIndexIfMissing(queryInterface, "Jobs", ["status"], { name: "jobs_status_idx" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Jobs");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Jobs_employmentType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Jobs_status";');
  },
};
