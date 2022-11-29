const { Router } = require('express');
const Quest = require('../models/Quest');
const Winner = require('../models/Winners');
const url = require('url');
const querystring = require('querystring');
const axios = require("axios");
const FormData = require("form-data");

const router = Router();

router.get('/time', async (req, res) => {
    try {
        const date = new Date;
        res.status(201).json(date);
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

//quest?liveDate=2022-11-01T04:40:43.621Z&number=2
router.get('/', async (req, res) => {
    try {
        const params = req.query;
        const quest = await Quest.findOne({ liveDate: params.liveDate, number: params.number, timezone: params.timezone });
        res.status(201).json(quest);
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.get('/all', async (req, res) => {
    try {
        const quests = await Quest.find();
        res.status(201).json(quests);
        return;
    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { liveDate, number, answers, timezone, isSentWinners } = req.body;

        const quest = await Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone });

        if (quest) {
            return res.status(201).json(quest);
        }
        const newQuest = new Quest({ liveDate, number, answers, timezone, isSentWinners });
        await newQuest.save();

        return res.status(201).json(newQuest);

    } catch (e) {
        res.status(200).json(e.message);
    }
});

router.put('/', async (req, res) => {
    try {
        const { liveDate, number, answer, timezone } = req.body;
        const quest = await Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone });

        console.log(quest.answers.includes(quest.answers.find(el => el.id === answer.id)))
        if (!quest.answers.includes(quest.answers.find(el => el.id === answer.id))) {
            quest.answers.push(answer);
            await quest.save();
        }

        if(!quest.isSentWinners)
         {
             const winners = [];
             quest.answers
                 .sort((a, b) => a.timeAnswer.localeCompare(b.timeAnswer))
                 .filter(obj => obj.correct === true && obj.isLate === false)
                 .slice(0, 3)
                 .map(user => winners.push(user));

             if(winners.length === 3) {
                 console.log(winners);
                 const winner1 = new Winner({
                     id: winners[0].id,
                     firstName: winners[0].firstName,
                     lastName: winners[0].lastName,
                     numberAns: winners[0].numberAns,
                     timezone: winners[0].timezone,
                     timeAnswer: winners[0].timeAnswer,
                     numberLive: winners[0].numberLive });
                 await winner1.save();
                 const winner2 = new Winner({
                     id: winners[1].id,
                     firstName: winners[1].firstName,
                     lastName: winners[1].lastName,
                     numberAns: winners[1].numberAns,
                     timezone: winners[1].timezone,
                     timeAnswer: winners[1].timeAnswer,
                     numberLive: winners[1].numberLive });
                 await winner2.save();
                 const winner3 = new Winner({
                     id: winners[0].id,
                     firstName: winners[2].firstName,
                     lastName: winners[2].lastName,
                     numberAns: winners[2].numberAns,
                     timezone: winners[2].timezone,
                     timeAnswer: winners[2].timeAnswer,
                     numberLive: winners[2].numberLive });
                 await winner3.save();

                 await newQuest.save();
                 const response1 = await axios.get(winners[0].avatar, {responseType: 'stream'})
                 const response2 = await axios.get(winners[1].avatar, {responseType: 'stream'})
                 const response3 = await axios.get(winners[2].avatar, {responseType: 'stream'})
                 let formData = new FormData();
                 formData.append('fio[]', winners[0].firstName + ' ' + winners[0].lastName);
                 formData.append('fio[]', winners[1].firstName + ' ' + winners[1].lastName);
                 formData.append('fio[]', winners[2].firstName + ' ' + winners[2].lastName);

                 formData.append('avatar[]', response1.data, '1.jpg');
                 formData.append('avatar[]', response2.data, '2.jpg');
                 formData.append('avatar[]', response3.data, '3.jpg');

                 axios.post('https://sp-api.friday.ru/wunderkind/add', formData, {
                     headers: {
                         'Content-Type': 'multipart/form-data'
                     }
                 }).then((response) => {
                     console.log(response.data);
                     quest.isSentWinners = true;
                     //Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone }, {"isSentWinners": true});
                     quest.update();
                 }).catch(error => console.log(error));
             }
        }
        res.status(201).json(true);
        return;
    } catch (e) {
        res.status(200).json(e.message);
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
            return;
        } else {
            res.status(201).json(false);
            return;
        }

    } catch (e) {
        res.status(200).json(e.message);
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

        if (user.correct && user.isLate) {
            res.status(201).json('so-close');
            return;
        }

        if(winner) {
            res.status(201).json('win');
            return;
        } else if (isWin) {
            res.status(201).json('so-close');
            return;
        } else {
            res.status(201).json('lose');
            return;
        }

    } catch (e) {
        res.status(200).json('lose');
    }
});

module.exports = router;