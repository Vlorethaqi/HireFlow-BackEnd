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

export async function up(queryInterface, Sequelize) {
  if (!(await tableExists(queryInterface, "JobRequirements"))) {
    await queryInterface.createTable("JobRequirements", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      requirementText: {
        type: Sequelize.STRING,
        allowNull: false
      },
      requirementType: {
        type: Sequelize.ENUM("EDUCATION", "EXPERIENCE", "SKILL", "CERTIFICATION", "OTHER"),
        defaultValue: "OTHER"
      },
      isRequired: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      jobId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Jobs",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
  } else {
    await addColumnIfMissing(queryInterface, "JobRequirements", "requirementType", {
      type: Sequelize.ENUM("EDUCATION", "EXPERIENCE", "SKILL", "CERTIFICATION", "OTHER"),
      defaultValue: "OTHER"
    });
    await addColumnIfMissing(queryInterface, "JobRequirements", "isRequired", {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  }
}

export async function down(queryInterface) {
  await queryInterface.dropTable("JobRequirements");
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_JobRequirements_requirementType";');
}
