const sendResponse = require('./response');
const weather = require('weather-js');

module.exports = (app) => {
    app.get('/weather', (req, res) => {
        if(req.query.location === undefined) {
            sendResponse(res, 400, {
                message: 'Missing location'
            });
            return;
        }

        weather.find({
            search: req.query.location,
            degreeType: 'C'
        }, (err, result) => {
            if(err) {
                console.log(err);
                sendResponse(res, 500, {
                    message: `Cannot query weather data for '${req.query.location}'`
                }); // error trying to query weather info
                return;
            }

            let data = result[0]; // get 1st result
            const payload = {
                location: {
                    name: data.location.name,
                    coords: [data.location.lat * 1, data.location.long * 1]
                },
                current: {
                    sky: data.current.skytext,
                    temperature: data.current.temperature * 1,
                    humidity: data.current.humidity * 1
                },
                forecast: {} // to be filled later
            };
            for(const day of data.forecast) {
                payload.forecast[day.date] = {
                    sky: day.skytextday,
                    templo: day.low * 1,
                    temphi: day.high * 1,
                    precip: day.precip * 1
                };
            }
            sendResponse(res, 200, payload); // send out payload
        });
    });
};