import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Sigurohu që rruga për te db.js është e saktë

const SavedJob = sequelize.define('SavedJob', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id' // Përshtate nëse në databazë e keni me snake_case
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'job_id' // Përshtate nëse në databazë e keni me snake_case
    }
}, {
    tableName: 'saved_jobs', // Emri i tabelës në databazën tuaj
    timestamps: true
});

// 🔥 KJO ËSHTË LINJA KRITIKE QË PO MUNGON:
export default SavedJob;