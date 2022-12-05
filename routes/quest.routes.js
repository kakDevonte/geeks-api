const { Router } = require("express");
const Quest = require("../models/Quest");
const axios = require("axios");
const FormData = require("form-data");

const router = Router();

router.get("/time", async (req, res) => {
  try {
    const date = new Date();
    res.status(201).json(date);
    return;
  } catch (e) {
    res.status(200).json(e.message);
  }
});

//quest?liveDate=2022-11-01T04:40:43.621Z&number=2
router.get("/", async (req, res) => {
  try {
    const params = req.query;
    const quest = await Quest.findOne({
      liveNumber: params.liveNumber,
      number: params.number,
      timezone: params.timezone,
    });
    res.status(201).json(quest);
    return;
  } catch (e) {
    res.status(200).json(e.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    const quests = await Quest.find();
    res.status(201).json(quests);
    return;
  } catch (e) {
    res.status(200).json(e.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { liveNumber, number, answers, timezone, isSentWinners } = req.body;

    const quest = await Quest.findOne({
      liveNumber: liveNumber,
      number: number,
      timezone: timezone,
    });

    if (quest) {
      return res.status(201).json(quest);
    }
    const newQuest = new Quest({
      liveNumber,
      number,
      answers,
      timezone,
      isSentWinners,
    });
    await newQuest.save();

    return res.status(201).json(newQuest);
  } catch (e) {
    res.status(200).json(e.message);
  }
});

router.put("/", async (req, res) => {
  try {
    const { liveNumber, number, answer, timezone } = req.body;
    console.log();
    const quest = await Quest.findOne({
      liveNumber: liveNumber,
      number: number,
      timezone: timezone,
    });

    if (
      !quest.answers.includes(quest.answers.find((el) => el.id === answer.id))
    ) {
      quest.answers.push(answer);
      if (
        quest.winners.length < 3 &&
        answer.correct === true &&
        answer.isLate === false
      )
        quest.winners.push(answer);
    }
    if (!quest.isSentWinners && quest.winners.length === 3) {
      // const winners = [];
      // quest.answers
      //     .sort((a, b) => a.timeAnswer.localeCompare(b.timeAnswer))
      //     .filter(obj => obj.correct === true && obj.isLate === false)
      //     .slice(0, 3)
      //     .map(user => winners.push(user));

      const response1 = await axios.get(quest.winners[0].avatar, {
        responseType: "stream",
      });
      const response2 = await axios.get(quest.winners[1].avatar, {
        responseType: "stream",
      });
      const response3 = await axios.get(quest.winners[2].avatar, {
        responseType: "stream",
      });
      let formData = new FormData();
      formData.append(
        "fio[]",
        quest.winners[0].firstName + " " + quest.winners[0].lastName
      );
      formData.append(
        "fio[]",
        quest.winners[1].firstName + " " + quest.winners[1].lastName
      );
      formData.append(
        "fio[]",
        quest.winners[2].firstName + " " + quest.winners[2].lastName
      );

      formData.append("avatar[]", response1.data, "1.jpg");
      formData.append("avatar[]", response2.data, "2.jpg");
      formData.append("avatar[]", response3.data, "3.jpg");

      axios
        .post("https://sp-api.friday.ru/wunderkind/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          quest.isSentWinners = true;
          //Quest.findOne({ liveDate: liveDate, number: number, timezone: timezone }, {"isSentWinners": true});
          // quest.update();
        })
        .catch((error) => console.log(error));
    }
    res.status(201).json(true);
    await quest.save();
    return;
  } catch (e) {
    res.status(200).json(e.message);
  }
});

router.post("/is-answer", async (req, res) => {
  try {
    const { liveNumber, number, id, timezone } = req.body;
    const quest = await Quest.findOne({
      liveNumber: liveNumber,
      number: number,
      timezone: timezone,
    });
    const isAnswer = quest.answers.some((user) => user.id === id);
    const user = quest.answers.find((user) => user.id === id);
    if (isAnswer) {
      res.status(201).json({ isAnswer, index: user.numberAns });
      return;
    } else {
      res.status(201).json(false);
      return;
    }
  } catch (e) {
    res.status(200).json(e.message);
  }
});

router.post("/is-win", async (req, res) => {
  try {
    const { liveNumber, number, id, timezone } = req.body;
    const quest = await Quest.findOne({
      liveNumber: liveNumber,
      number: number,
      timezone: timezone,
    });

    const user = quest.winners.find((user) => user.id === id);

    if (user) {
      res.status(201).json("win");
      return;
    } else {
      const user = quest.answers.find((user) => user.id === id);
      if (user) {
        if (user.correct && user.isLate) {
          res.status(201).json("so-close");
          return;
        } else {
          res.status(201).json("lose");
          return;
        }
      }
    }
  } catch (e) {
    res.status(200).json("lose");
  }
});

module.exports = router;
