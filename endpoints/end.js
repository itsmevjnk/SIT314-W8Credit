const sendResponse = require('./response');

module.exports = (app) => {
    app.all('*', (req, res) => {
        sendResponse(res, 403, {
            message: `Cannot ${req.method} ${req.path}`
        });
    });
}