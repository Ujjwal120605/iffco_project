const mongoose = require('mongoose');

const ShiftLogSchema = new mongoose.Schema({
    officer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    ammoniaOutput: {
        type: Number,
        required: true
    },
    ureaOutput: {
        type: Number,
        required: true
    },
    dapOutput: {
        type: Number,
        required: true
    },
    steamPressure: {
        type: Number,
        required: true
    },
    powerDraw: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ShiftLog', ShiftLogSchema);
