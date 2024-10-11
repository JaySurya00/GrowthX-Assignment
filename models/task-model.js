const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    adminId: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,  // Date type for timestamp
        default: Date.now  // Default value is the current time when the document is created
    }
})

const Task= mongoose.model('Tasks', taskSchema)

module.exports = Task;
