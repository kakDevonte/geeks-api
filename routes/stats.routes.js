const { Router } = require('express');
const Stats = require('../models/Stats');

const router = Router();

router.get('/:time', async (req, res) => {
    try {
        const time = req.params.time;
        const stats = await Stats.findOne({ timezone: time });
        if(stats) {
            await Stats.updateOne({ timezone: time }, {
                    openApp: stats.openApp + 1,
                }
            );
            res.status(201);
        } else {
            const stats =  new Stats({ timezone: time, openApp: 1 });
            res.status(201);
            await stats.save();
        }
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const stats = await Stats.find();
        res.status(201).json(stats);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

module.exports = router;