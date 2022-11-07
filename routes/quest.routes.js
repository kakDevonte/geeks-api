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

router.get('/all', async (req, res) => {
    try {
        const quests = await Quest.find();
        res.status(201).json(quests);
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
        const { liveDate, number, id, timezone } = req.body;
        const quest = await Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone });
        const isAnswer = quest.answers.some(user => user.id === id);
        const user = quest.answers.find(user => user.id === id);
        if(isAnswer) {
            res.status(201).json({isAnswer, index: user.numberAns});

        } else {
            res.status(201).json(false);
        }

    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.post('/is-win', async (req, res) => {
    try {
        const { liveDate, number, id, timezone } = req.body;
        const quest = await Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone });

        const user = quest.answers.find(user => user.id === id);
        const isWin = user.correct;

        quest.answers.sort((a, b) => a.timeAnswer.localeCompare(b.timeAnswer));

        let result = quest.answers.filter(obj => {
            return obj.correct === true
        })

        const winners = result.slice(0, 3);

        const winner = winners.find(user => user.id === id);

        if(winner) {
            res.status(201).json('win');
        } else if (isWin) {
            res.status(201).json('so-close');
        } else {
            res.status(201).json('lose');
        }

    } catch (e) {
        res.status(500).json(e.message);
    }
});

module.exports = router;