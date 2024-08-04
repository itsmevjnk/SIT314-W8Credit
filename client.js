const http = require('http');

const HOST = 'http://localhost:3000'; // API server URL

const WEATHER_LOCATION = 'Melbourne, AU'; // weather location
http.get(`${HOST}/weather?location=${encodeURIComponent(WEATHER_LOCATION)}`, (res) => {
    res.on('data', (chunk) => {
        let resp = JSON.parse(chunk);
        if(resp.status != 200) console.log('Weather API query failed:', resp.status, resp.data.message);
        else {
            console.log(`Weather information for ${resp.data.location.name} (${resp.data.location.coords}):`);
            console.log(` - Current weather: ${resp.data.current.sky} @ ${resp.data.current.temperature}\xB0C, humidity: ${resp.data.current.humidity}%`);
            console.log(` - Forecasts:`);
            for(const [key, value] of Object.entries(resp.data.forecast)) {
                console.log(`    - ${key}: ${value.sky}, ${value.templo}-${value.temphi}\xB0C, precip. ${value.precip}%`);
            }
        }
    });
});

http.get(`${HOST}/local/temps`, (res) => {
    res.on('data', (chunk) => {
        let resp = JSON.parse(chunk);
        if(resp.status != 200) console.log('Local temperature API query failed:', resp.status, resp.data.message);
        else {
            for(const [key, value] of Object.entries(resp.data)) {
                console.log(`Latest temperature reading: ${value.temperature}\xB0C, recorded at ${value.time}`)
                console.log(` - ID: ${key}`);
            }
        }
    });
});