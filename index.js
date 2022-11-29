const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Set-Cookie, X-XSRF-TOKEN, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Origin', "*"); //req.get('origin')
    res.setHeader('Access-Control-Max-Age', 300);
    next();
});



app.use(express.json({ extended: true }));
app.use('/api/quest', require('./routes/quest.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

async function start() {
    try {
        await mongoose.connect(
            process.env.MONGO,
            {}
        );
        app.listen(process.env.PORT, () =>
            console.log(`App has benn started on port ${process.env.PORT}...`)
        );
    } catch (e) {
        console.log('Server Error', e.message);
        process.exit(1);
    }
}

start();