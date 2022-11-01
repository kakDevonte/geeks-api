const { Router } = require('express');
const Quest = require('../models/Quest');
const url = require('url');
const querystring = require('querystring');

const router = Router();

//quest?liveDate=2022-11-01T04:40:43.621Z&number=2
router.get('/', async (req, res) => {
    try {
        const params = req.query;
        const quest = await Quest.findOne({ liveDate: params.liveDate, number: params.number, timezone: params.timezone });
        res.status(201).json(quest);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { liveDate, number, answers, timezone } = req.body;
        const quest = new Quest({ liveDate, number, answers, timezone });
        await quest.save();
        res.status(201).json(quest);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.put('/', async (req, res) => {
    try {
        console.log(req.body);
        const { liveDate, number, answer, timezone } = req.body;
        const quest = await Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone });
        quest.answers.push(answer);
        await quest.save();
        res.status(201).json(true);
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.post('/is-answer', async (req, res) => {
    try {
        const { liveDate, number, answer, timezone } = req.body;
        const quest = await Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone });
        const isAnswer = quest.answers.some(user => user.id === answer.id);

        if(isAnswer) {
            res.status(201).json(true);

        } else {
            res.status(201).json(false);
        }

    } catch (e) {
        res.status(500).json(e.message);
    }
});

module.exports = router;