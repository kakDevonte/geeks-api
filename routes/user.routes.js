const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ id: id });
        res.status(201).json(user);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, firstName, lastName, timezone, link } = req.body;
        const user = new User({ id, firstName, lastName, timezone, link });
        await user.save();
        res.status(201);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.put('/', async (req, res) => {
    try {
        const { id, firstName, lastName, timezone, responseTime } = req.body;
        const oldUser = { id, firstName, lastName, timezone, responseTime };
        await User.updateOne({ id: id }, oldUser);
        const user = await User.findOne({ id: id });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

module.exports = router;