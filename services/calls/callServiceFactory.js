const config = require("../../config");
let provider;

if (config.provider === "plivo") {
  provider = {
    service: require("./providers/plivoCallProvider.service"),
    answers: require("./answers/plivo.answers"),
  };
} else if (config.provider === "twilio") {
  provider = {
    service: require("./providers/twilioCallProvider.service"),
    answers: require("./answers/twilio.answers"),
  };
} else {
  logs.log("callService", `Unsupported call provider`);
}

module.exports = provider;
