const sendResponse = require('./response');

const mongoose = require('mongoose');
const Reading = require('../models/reading');

module.exports = (app) => {
    /* get readings */
    app.get('/local/temps', (req, res) => {
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

        Reading.find({}, ['_id', 'time', 'temperature']).sort({time: -1}).limit(count).exec().then((data) => {
            // console.log(data);
            const resp = {};
            for(const reading of data) {
                resp[reading._id] = {
                    time: reading.time,
                    temperature: reading.temperature
                };
            }
            sendResponse(res, 200, resp);
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot query database'
            });
        });
    });

    /* query reading by its ID */
    app.get('/local/temps/:id', (req, res) => {
        Reading.findById(req.params.id, ['_id', 'time', 'temperature']).exec().then((data) => {
            if(data == null) {
                sendResponse(res, 404, {
                    message: `Cannot find reading with ID '${req.params.id}'`
                });
            } else {
                const resp = {}; resp[data._id] = {
                    time: data.time,
                    temperature: data.temperature
                };
                sendResponse(res, 200, resp);
            }
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot query from database'
            });
        });
    });
};