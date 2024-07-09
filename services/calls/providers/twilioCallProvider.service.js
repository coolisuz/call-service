const TwilioAnswers = require("../answers/twilio.answers");
const { twilio } = require("../../../.env");

const TwilioCallProvider = function (id, token) {
  const client = require("twilio")(twilio.accountSid, twilio.authToken);

  return {
    answers: TwilioAnswers,

    async call(from, to, answerUrl, params = {}) {
      return await client.calls
        .create({ from, to, url: answerUrl, ...params })
        .then((call) => console.log(call.sid));
    },

    async transfer(CallUUID, { url }) {
      return await client
        .calls(CallUUID)
        .update({ url })
        .then((call) => console.log(call.to));
    },
  };
};

module.exports = TwilioCallProvider;
