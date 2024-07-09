const { plivo_web_hook_url, MODE } = require("../../../.env");

const RABBIT_INBOUND_NUMBER = MODE == "PROD" ? 18582168132 : 123456789;

const xmlResponses = {
  getHangupBlockedXml() {
    return `
      <Response>
        <Hangup reason="blocked" />
      </Response>
    `;
  },

  getPlayHoldMusicXml() {
    return `
      <Response>
        <Play>https://rabbit.dijoca.com/media/audio/hold-music.mp3</Play>
      </Response>
    `;
  },

  getTransferResponseXml({ from_phone, to_phone, rawCallID, buyerIVR }) {
    let toNum = to_phone;
    if (String(toNum).length === 10) {
      toNum = "1" + toNum;
    }
    return `
      <Response>
        <Record action="${plivo_web_hook_url}/raw-call/record?callID=${rawCallID}" redirect="false" recordSession="true" maxLength="20000"/>
        ${buyerIVR && buyerIVR !== "null" ? `<Play>${buyerIVR}</Play>` : ""}
        <Dial callerId="${from_phone}">
          <Number>${toNum}</Number>
        </Dial>
      </Response>
    `;
  },

  getHoldMusicWithRecordXml({ from_phone, rawCallID }) {
    return `
      <Response>
        <Record action="${plivo_web_hook_url}/raw-call/record?callID=${rawCallID}" recordSession="true" redirect="false" maxLength="20000"/>
        <Play>https://rabbit.dijoca.com/media/audio/hold-music.mp3</Play>
        <Dial callerId="${from_phone}">
          <Number>${RABBIT_INBOUND_NUMBER}</Number>
        </Dial>
      </Response>
    `;
  },

  getInboundIVRXml({ rawCallID, ivrURL }) {
    return `
      <Response>
        <GetDigits action="${plivo_web_hook_url}/raw-call/inbound-ivr-button?rawCallID=${rawCallID}" method="POST" numDigits="1" retries="5" timeout="10" validDigits="12">
          <Play>${ivrURL}</Play>
          <Wait length="4" />
          <Play>${ivrURL}</Play>
          <Wait length="8" />
        </GetDigits>
      </Response>
    `;
  },

  getOptOutXml() {
    return `
      <Response>
        <Play>https://rabbit.dijoca.com/media/audio/opt-out.mp3</Play>
        <Hangup reason="opt out" />
      </Response>
    `;
  },

  getHangupInvalidInputXml() {
    return `
      <Response>
        <Hangup reason="invalid input" />
      </Response>
    `;
  },

  getTransferToAgentXml() {
    return `
      <Response>
        <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
        <Dial>
          <Number>${NOBLE_INBOUND_NUMBER}</Number>
        </Dial>
      </Response>
    `;
  },

  getNoBuyersAvailableXml() {
    return `
      <Response>
        <Play>https://rabbit.dijoca.com/media/audio/no_movers_recording.mp3</Play>
        <Hangup reason="no buyers available"/>
      </Response>
    `;
  },

  getSystemErrorXml() {
    return `
      <Response>
        <Hangup reason="system error" />
      </Response>
    `;
  },
};

module.exports = xmlResponses;
