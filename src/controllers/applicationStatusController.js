import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('ApplicationStatuses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    status_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('ApplicationStatuses');
}



export const createStatus = async (req, res) => {
    try {

        const status = await ApplicationStatus.create(req.body);

        res.status(201).json(status);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const updateStatus = async (req, res) => {
    try {

        const status = await ApplicationStatus.findByPk(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found",
            });
        }

        await status.update(req.body);

        res.status(200).json(status);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};



export const deleteStatus = async (req, res) => {
    try {

        const status = await ApplicationStatus.findByPk(req.params.id);

        if (!status) {
            return res.status(404).json({
                message: "Status not found",
            });
        }

        await status.destroy();

        res.status(200).json({
            message: "Status deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};