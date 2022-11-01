const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(
    cors({
        credentials: true,
        origin: true,
    })
);

app.use(express.json({ extended: true }));
app.use('/api/quest', require('./routes/quest.routes'));
app.use('/api/users', require('./routes/user.routes'));

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