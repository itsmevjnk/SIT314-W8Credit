const sendResponse = require('./response');

const os = require('os');

module.exports = (app) => {
    /* health check (ping) */
    app.get('/healthcheck', (req, res) => {
        sendResponse(res, 200, {
            ip: req.ip,
            server: os.hostname() // for load balancing testing
        });
    });
}