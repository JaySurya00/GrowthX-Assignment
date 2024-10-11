const mongoose = require('mongoose');

const rejectedTask = new mongoose.Schema({
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
        default: 'rejected'
    }
});

const RejectedTask = mongoose.model('RejectedTask', rejectedTask);

module.exports = RejectedTask;
