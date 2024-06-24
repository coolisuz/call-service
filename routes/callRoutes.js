const express = require("express");
const router = express.Router();
const { callService } = require("../services/calls");

router.post("/transfer/claim", async (req, res) => {
  const { CallUUID, phoneNum } = req.body;

  const response = await callService.transfer(CallUUID, {
    legs: "aleg",
    aleg_url: `${WEBHOOK_URI}/voip-hooks/incoming-transferred?phone_num=${phoneNum}`,
  });

  return res.send(response);
});

router.post("/answer/:name", async (req, res) => {
  const name = req.params.name;
  const params = req.body.params || {};
  const answer = callService.answers[name]
    ? callService.answers[name](params)
    : null;

  res.send(answer);
});

module.exports = router;
