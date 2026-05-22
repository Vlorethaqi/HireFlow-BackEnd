async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  return tables.some((table) => (typeof table === "string" ? table : table.tableName) === tableName);
}

async function addIndexIfMissing(queryInterface, tableName, fields, options) {
  const indexes = await queryInterface.showIndex(tableName);
  const exists = indexes.some((index) => index.name === options.name);

  if (!exists) {
    await queryInterface.addIndex(tableName, fields, options);
  }
}

export async function up(queryInterface, Sequelize) {
  if (!(await tableExists(queryInterface, "Departments"))) {
    await queryInterface.createTable("Departments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  }

  await addIndexIfMissing(queryInterface, "Departments", ["name", "companyId"], {
    unique: true,
    name: "departments_name_company_id_unique"
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Departments");
}
