const mongoose = require('mongoose');

module.exports = mongoose.model('Sensor', new mongoose.Schema({
    sensor_id: String,
    address: String,
    allowed: Boolean
}, {
    collection: process.env.COLL_SENSORS
}));
