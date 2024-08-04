/* load .env file */
require('dotenv').config();

/* connect to MongoDB server */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

/* set up Express */
const express = require('express');
const app = express();
app.use(express.json()); // JSON parser middleware

/* initialise API endpoints */
require('./endpoints/weather')(app);
require('./endpoints/local')(app);
require('./endpoints/sensor')(app);
require('./endpoints/admin')(app);
require('./endpoints/end')(app); // must be last

app.listen(process.env.PORT, () => {
    console.log('API server listening on port', process.env.PORT);
});
