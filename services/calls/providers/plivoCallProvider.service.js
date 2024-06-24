const plivo = require('plivo');
const PlivoAnswers = require("../answers/plivo.answers");

const PlivoCallProvider = function(id, token) {
    const client = new plivo.Client(id, token);

    return {
        answers: PlivoAnswers,

        async call(from, to, answerUrl, params = {}) {
            return await client.calls.create(from, to, answerUrl, params);
        },

        async transfer(CallUUID, params = {}) {
            return await client.calls.transfer(CallUUID, params);
        }
    }
}

module.exports = PlivoCallProvider;
