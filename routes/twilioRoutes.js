const express = require("express");
const router = express.Router();
const callServiceFactory = require("../services/calls/callServiceFactory");
const callService = callServiceFactory("twilio");

router.post("/transfer/claim", async (req, res) => {
  const { CallUUID, phoneNum } = req.body;
  const response = await callService.transfer(CallUUID, {
    legs: "aleg",
    aleg_url: `${process.env.WEBHOOK_URI}/voip-hooks/incoming-transferred?phone_num=${phoneNum}`,
  });
  return res.send(response);
});

router.post("/answer/:name", async (req, res) => {
  const name = req.params.name;
  const params = req.body.params || {};
  const answer = callService.getAnswer(name, params);
  res.send(answer);
});

module.exports = router;
