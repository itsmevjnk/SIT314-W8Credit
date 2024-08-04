const mongoose = require('mongoose');

module.exports = mongoose.model('Reading', new mongoose.Schema({
    sensor_id: String, // for tracing
    ip: String, // for tracing
    time: Date,
    temperature: Number
}, {
    collection: process.env.COLL_READINGS
}));
