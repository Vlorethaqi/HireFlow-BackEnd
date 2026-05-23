import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const SavedJob = sequelize.define('SavedJob', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id' 
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'job_id' 
    }
}, {
    tableName: 'saved_jobs', 
    timestamps: true
});

export default SavedJob;