const sendResponse = require('./response');

const mongoose = require('mongoose');
const Sensor = require('../models/sensor');

module.exports = (app) => {
    /* query sensors list (admin only) */
    app.get('/local/sensors', (req, res) => {
        if(req.query.key !== process.env.ADMIN_PW) {
            /* authentication failed */
            sendResponse(res, 401, {
                message: 'Unauthorised operation'
            });
            return;
        }

        Sensor.find({}, ['sensor_id', 'address', 'allowed']).then((data) => {
            const resp = {};
            for(const sensor of data) {
                resp[sensor.sensor_id] = {
                    address: sensor.address,
                    allowed: sensor.allowed
                };
            }
            sendResponse(res, 200, resp);
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot query database'
            });
            return;
        });
    });

    /* query information about a single sensor (admin only) */
    app.get('/local/sensors/:id', (req, res) => {
        if(req.query.key !== process.env.ADMIN_PW) {
            /* authentication failed */
            sendResponse(res, 401, {
                message: 'Unauthorised operation'
            });
            return;
        }

        let id = req.params.id;
        Sensor.findOne({
            sensor_id: id
        }, ['sensor_id', 'address', 'allowed']).then((doc) => {
            if(doc == null) sendResponse(res, 404, {
                message: `Cannot find sensor with ID ${id}`
            });
            else {
                const resp = {}; resp[id] = {
                    address: doc.address,
                    allowed: doc.allowed
                };
                sendResponse(res, 200, resp);
            }
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot query database'
            });
            return;
        });
    });

    /* enroll sensor (admin only) */
    app.post('/local/sensors/:id', (req, res) => {
        if(req.query.key !== process.env.ADMIN_PW) {
            /* authentication failed */
            sendResponse(res, 401, {
                message: 'Unauthorised operation'
            });
            return;
        }

        let id = req.params.id;
        Sensor.find({
            sensor_id: id,
        }).then((result) => {
            if(result.length > 0) {
                sendResponse(res, 400, {
                    message: `Sensor ${id} already exists`
                });
                return;
            }

            const props = {
                sensor_id: id,
                address: '',
                allowed: true
            };
            if(typeof req.body.address === 'string') props.address = req.body.address;
            if(typeof req.body.allowed === 'boolean') props.allowed = req.body.allowed;

            Sensor.create(props).then((doc) => {
                const resp = {}; resp[id] = {
                    address: doc.address,
                    allowed: doc.allowed
                };
                sendResponse(res, 200, resp);
            }).catch((err) => {
                console.log(err);
                sendResponse(res, 500, {
                    message: 'Cannot access database'
                });
            });
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot access database'
            });
        });
    });

    /* edit sensor info (admin only) */
    app.put('/local/sensors/:id', (req, res) => {
        if(req.query.key !== process.env.ADMIN_PW) {
            /* authentication failed */
            sendResponse(res, 401, {
                message: 'Unauthorised operation'
            });
            return;
        }

        const props = {};
        if(typeof req.body.address === 'string') props.address = req.body.address;
        if(typeof req.body.allowed === 'boolean') props.allowed = req.body.allowed;

        let id = req.params.id;
        Sensor.findOneAndUpdate({
            sensor_id: id,
        }, props, { new: true }).then((doc) => {
            if(doc == null) sendResponse(res, 404, {
                message: `Sensor ${indexedDBd} not found`
            });
            else {
                const resp = {}; resp[id] = {
                    address: doc.address,
                    allowed: doc.allowed
                };
                sendResponse(res, 200, resp);
            }
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot access database'
            });
        });
    });

    /* delete sensor (admin only) */
    app.delete('/local/sensors/:id', (req, res) => {
        if(req.query.key !== process.env.ADMIN_PW) {
            /* authentication failed */
            sendResponse(res, 401, {
                message: 'Unauthorised operation'
            });
            return;
        }

        let id = req.params.id;
        Sensor.findOneAndDelete({
            sensor_id: id
        }).then((doc) => {
            if(doc == null) sendResponse(res, 404, {
                message: `Cannot find sensor with ID ${id}`
            });
            else {
                const resp = {}; resp[id] = {
                    address: doc.address,
                    allowed: doc.allowed
                };
                sendResponse(res, 200, resp);
            }
        }).catch((err) => {
            console.log(err);
            sendResponse(res, 500, {
                message: 'Cannot query database'
            });
            return;
        });
    });
}