const provider = require("./callServiceFactory");

const CallService = function () {
  return {
    answers: provider.answers,

    async call(from, to, answerUrl, params = {}) {
      return await provider.service.call(from, to, answerUrl, params);
    },

    async transfer(CallUUID, params = {}) {
      return await provider.service.transfer(CallUUID, params);
    },
  };
};

module.exports = CallService;
