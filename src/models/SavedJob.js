module.exports = (sequelize, DataTypes) => {
  const SavedJob = sequelize.define('SavedJob', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id'
      }
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jobs', 
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false 
    }
  }, {
    tableName: 'SavedJobs',
    timestamps: true 
  });

  
  SavedJob.associate = (models) => {
    SavedJob.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    SavedJob.belongsTo(models.Job, { foreignKey: 'jobId', as: 'job' });
    SavedJob.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
  };

  return SavedJob;
};