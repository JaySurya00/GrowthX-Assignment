const mongoose = require('mongoose');

const acceptedTaskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
    },
    adminId: {
        type: String,
        required: true,
    },
    status: {
        type: String, 
        default: 'accepted'
    }
});

const AcceptedTask = mongoose.model('AcceptedTask', acceptedTaskSchema);

module.exports = AcceptedTask;
