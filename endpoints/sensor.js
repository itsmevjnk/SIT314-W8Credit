const sendResponse = require('./response');

const mongoose = require('mongoose');
const Reading = require('../models/reading');
const Sensor = require('../models/sensor');

module.exports = (app) => {
    /* upload reading */
    app.post('/local/temps', (req, res) => {
        /* type checks */
        if(typeof req.body.sensor_id !== 'string' || typeof req.body.temperature !== 'number') {
            sendResponse(res, 400, {
                message: 'Invalid field(s)'
            });
            return;
        }

        Sensor.find({
            sensor_id: req.body.sensor_id,
            allowed: true
        }).then((result) => {
            if(result.length == 0) {
                sendResponse(res, 401, {
                    message: 'Sensor authentication failed'
                });
                return;
            }

            Reading.create({
                sensor_id: req.body.sensor_id,
                ip: req.ip,
                time: Date.now(),
                temperature: req.body.temperature
            }).then((doc) => {
                const resp = {}; resp[doc._id] = {
                    sensor_id: doc.sensor_id,
                    ip: req.ip,
                    time: doc.time,
                    temperature: doc.temperature
                };
                sendResponse(res, 200, resp);
            }).catch((err) => {
                console.log(err);
                sendResponse(res, 500, {
                    message: 'Cannot add reading'
                });
            });
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot authenticate'
            });
        });
    });

    /* modify reading */
    app.put('/local/temps/:id', (req, res) => {
        if(typeof req.body.sensor_id === 'undefined') {
            sendResponse(res, 400, {
                message: 'Missing sensor_id'
            });
            return;
        }

        const props = {};
        if(typeof req.body.time === 'number') props.time = req.body.time;
        if(typeof req.body.temperature === 'number') props.temperature = req.body.temperature;

        Reading.findOneAndUpdate({
            _id: req.params.id,
            sensor_id: req.body.sensor_id
        }, props, {
            upsert: false,
            new: true
        }).then((doc) => {
            const resp = {}; resp[doc._id] = {
                sensor_id: doc.sensor_id,
                time: doc.time,
                temperature: doc.temperature
            };
            sendResponse(res, 200, resp);
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: `Cannot update reading ${req.params.id}`
            });
        })
    });

    /* delete reading */
    app.delete('/local/temps/:id', (req, res) => {
        if(typeof req.body.sensor_id === 'undefined') {
            sendResponse(res, 400, {
                message: 'Missing sensor_id'
            });
            return;
        }

        const props = {};
        if(typeof req.body.time === 'number') props.time = req.body.time;
        if(typeof req.body.temperature === 'number') props.temperature = req.body.temperature;

        Reading.findOneAndDelete({
            _id: req.params.id,
            sensor_id: req.body.sensor_id // also validates sensor ID
        }).then((doc) => {
            if(doc == null) sendResponse(res, 404, {
                message: `Cannot find reading ${req.params.id}`
            });
            else {
                const resp = {}; resp[doc._id] = {
                    sensor_id: doc.sensor_id,
                    time: doc.time,
                    temperature: doc.temperature
                };
                sendResponse(res, 200, resp); // old contents
            }
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: `Cannot delete reading ${req.params.id}`
            });
        });
    });

    /* query readings by sensor ID */
    app.get('/local/sensors/:id/temps', (req, res) => {
        /* get number of readings */
        let count = 1;
        if(typeof req.query.count !== 'undefined') {
            count = req.query.count * 1;
            if(isNaN(count)) {
                sendResponse(res, 400, {
                    message: 'Invalid value for count'
                });
                return;
            }
        }

        Reading.find({
            sensor_id: req.params.id
        }, ['time', 'temperature']).sort({time: -1}).limit(count).exec().then((data) => {
            sendResponse(res, 200, data);
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot query database'
            });
        });
    });
}