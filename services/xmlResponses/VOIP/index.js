const { plivo_web_hook_url } = require("../../../.env");

const xmlResponses = {
  getDialNumberXml({ From, Number }) {
    return `
        <Response>
          <Dial callerId="${From}">
            <Number>${Number}</Number>
          </Dial>
        </Response>
      `;
  },

  getSpeakXml({ CallerName, From }) {
    return `
        <Response>
          <Speak voice="Polly.Amy">
            <prosody rate="medium">
              Successfully connected from <say-as interpret-as="spell-out">${From}</say-as>. Caller ID: <say-as interpret-as="spell-out">${CallerName}</say-as>
            </prosody>
          </Speak>
        </Response>
      `;
  },

  getRecordDialXml({ From, forwardNumber }) {
    return `
        <Response>
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getPlayRingXml({ forwardNumber }) {
    return `
        <Response>
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Play>https://rabbit.dijoca.com/media/audio/ring.mp3</Play>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },
};

module.exports = xmlResponses;
