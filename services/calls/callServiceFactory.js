const CallService = require("./call.service");
const PlivoCallProvider = require("./providers/plivoCallProvider.service");
const TwilioCallProvider = require("./providers/twilioCallProvider.service");
const plivoAnswers = require("./answers/plivo.answers");
const twilioAnswers = require("./answers/twilio.answers");

function callServiceFactory(provider) {
  let providerService;
  let answers;

  switch (provider) {
    case "plivo":
      providerService = new PlivoCallProvider();
      answers = plivoAnswers;
      break;
    case "twilio":
      providerService = new TwilioCallProvider();
      answers = twilioAnswers;
      break;
    default:
      throw new Error("Unknown provider");
  }
  return new CallService(providerService, answers);
}

module.exports = callServiceFactory;
