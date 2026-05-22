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

export async function up(queryInterface, Sequelize) {
  if (!(await tableExists(queryInterface, "JobSkills"))) {
    await queryInterface.createTable("JobSkills", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
      skillId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Skills",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      importanceLevel: {
        type: Sequelize.ENUM("REQUIRED", "PREFERRED"),
        defaultValue: "REQUIRED"
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
    await addColumnIfMissing(queryInterface, "JobSkills", "importanceLevel", {
      type: Sequelize.ENUM("REQUIRED", "PREFERRED"),
      defaultValue: "REQUIRED"
    });
  }

  await addIndexIfMissing(queryInterface, "JobSkills", ["jobId", "skillId"], {
    unique: true,
    name: "job_skills_job_id_skill_id_unique"
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("JobSkills");
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_JobSkills_importanceLevel";');
}
