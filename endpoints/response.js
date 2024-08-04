/* common method for sending standardised response */
module.exports = (res, code, payload) => {
    res.status(code).json({
        status: code,
        data: payload,
        timestamp: Date.now()
    });
}