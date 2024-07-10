const { KOHLER_RESPONSE_NUMBER, PLIVO_WEBHOOK_URL, RABBIT_DIJOCA_MEDIA_AUDIO_URL, DIJOCA_TOOLS_MEDIA_URL, PRESS_ONE_RESPONSE_NUMBER, MODE } = require("../../.env");

const RABBIT_INBOUND_NUMBER = MODE == "PROD" ? 18582168132 : 123456789;

const plivoResponses = {
  pressOne: {
    answerCallbackResponse(audio, leadUserId, leadMoveType) {
      return `
            <Response>
                <Record action="${PLIVO_WEBHOOK_URL}/press-one/callback/record?lead_user_id=${encodeURIComponent(leadUserId)}" maxLength="20000" startOnDialAnswer="true" redirect="false"/>
                <GetDigits action="${PLIVO_WEBHOOK_URL}/press-one/callback/digit-input?move_type=${leadMoveType}&#x26;lead_user_id=${encodeURIComponent(leadUserId)}" method="POST" timeout="30" numDigits="1" validDigits="19">
                    <Play loop="2">${audio}</Play>
                </GetDigits>
                <Speak>Input not received. Thank you</Speak>
            </Response>`;
    },

    digitInput1(connect_to) {
      return `
            <Response>
                <Dial>
                    <Number>${connect_to}</Number>
                </Dial>
            </Response>`;
    },

    digitInput9() {
      return `
            <Response>
                <Hangup schedule="1"/>
                <Speak loop="1">Thank You</Speak>
            </Response>`;
    },

    digitInputDefault(phone) {
      return `
            <Response>
                <Dial>
                    <Number>${phone}</Number>
                </Dial>
            </Response>`;
              
    },

    hangupWithReason(reason) {
      return `
            <Response>
                <Hangup reason="${reason}" />
            </Response>`;
    }
  },

  getPressOneResponse() {
    return `
        <Response>
          <Play>${DIJOCA_TOOLS_MEDIA_URL}/ring.mp3</Play>
          <Dial>
            <Number>+${PRESS_ONE_RESPONSE_NUMBER}</Number>
          </Dial>
        </Response>
      `;
  },

  getHangupNotImplementedResponse() {
    return `
        <Response>
          <Hangup reason="not implemented" />
        </Response>
      `;
  },

  getIncomingCallResponse(forwardNumber) {
    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getIncomingTransferredResponse(phone, socketPhoneNum) {
    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial callerId="${phone}">
            <Number>${socketPhoneNum}</Number>
          </Dial>
        </Response>
      `;
  },

  getKohlerForwardResponse(From) {
    return `
        <Response>
          <Dial callerId="${From}">
            <Number>${KOHLER_RESPONSE_NUMBER}</Number>
          </Dial>
        </Response>
      `;
  },

  getNobleRolloverResponse() {
    return `
        <Response>
          <Play>${DIJOCA_TOOLS_MEDIA_URL}/audio/ring.mp3</Play>
        </Response>
      `;
  },

  getRolloverCallResponse(forwardNumber) {
    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getLeadCallbackResponse(forwardNumber) {
    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Play>${DIJOCA_TOOLS_MEDIA_URL}/audio/ring.mp3</Play>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getPressOneDialedResponse(lead) {
    return `
        <Response>
          <GetDigits action="${PLIVO_WEBHOOK_URL}/voip-hooks/button-pressed?lead_id=${lead.id}" method="POST" numDigits="1" retries="1" timeout="10" validDigits="129">
            <Play>${DIJOCA_TOOLS_MEDIA_URL}/move_quote_ready.mp3</Play>
            <Play>${DIJOCA_TOOLS_MEDIA_URL}/move_quote_ready.mp3</Play>
          </GetDigits>
        </Response>
      `;
  },

  getDialedWebHookResponse(lead, callerId) {
    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=${callerId}" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial callerId="${callerId}" callerName='Moving'>
            <Number>${lead?.phone}</Number>
          </Dial>
        </Response>
      `;
  },

  getTransferredWebHookResponse(toCompany, lead, queryString) {
    let toNum = toCompany?.company_phone;
    if (String(toNum).length === 10) {
      toNum = "1" + toNum;
    }

    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-company${queryString}" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial callerId="${lead?.phone}">
            <Number>${toNum}</Number>
          </Dial>
        </Response>
      `;
  },

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
        <Play>${RABBIT_DIJOCA_MEDIA_AUDIO_URL}/hold-music.mp3</Play>
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
        <Record action="${PLIVO_WEBHOOK_URL}/raw-call/record?callID=${rawCallID}" redirect="false" recordSession="true" maxLength="20000"/>
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
        <Record action="${PLIVO_WEBHOOK_URL}/raw-call/record?callID=${rawCallID}" recordSession="true" redirect="false" maxLength="20000"/>
        <Play>${RABBIT_DIJOCA_MEDIA_AUDIO_URL}/hold-music.mp3</Play>
        <Dial callerId="${from_phone}">
          <Number>${RABBIT_INBOUND_NUMBER}</Number>
        </Dial>
      </Response>
    `;
  },

  getInboundIVRXml({ rawCallID, ivrURL }) {
    return `
      <Response>
        <GetDigits action="${PLIVO_WEBHOOK_URL}/raw-call/inbound-ivr-button?rawCallID=${rawCallID}" method="POST" numDigits="1" retries="5" timeout="10" validDigits="12">
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
        <Play>${RABBIT_DIJOCA_MEDIA_AUDIO_URL}/opt-out.mp3</Play>
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
        <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
        <Dial>
          <Number>${NOBLE_INBOUND_NUMBER}</Number>
        </Dial>
      </Response>
    `;
  },

  getNoBuyersAvailableXml() {
    return `
      <Response>
        <Play>${RABBIT_DIJOCA_MEDIA_AUDIO_URL}/no_movers_recording.mp3</Play>
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
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getPlayRingXml({ forwardNumber }) {
    return `
        <Response>
          <Record action="${PLIVO_WEBHOOK_URL}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Play>${RABBIT_DIJOCA_MEDIA_AUDIO_URL}/ring.mp3</Play>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getPressDigitResponse(rawCallID, lead = null) {
    let message;
    let leadIDParam = "";
    let isLocal = "";

    if (lead) {
      leadIDParam = `&#x26;leadID=${lead.id}`;
      isLocal = `&#x26;isLocal=${lead.isLocal}`;
      const fromState = getStateNameByAbbr(lead.from_state);
      const toState = getStateNameByAbbr(lead.to_state);

      message = lead.isLocal
        ? `<Speak voice="Polly.Matthew"><prosody rate="medium">Hello, ${
            lead.name
          }. Thank you for returning our call regarding your move to ${
            lead.to_city || ""
          }. To receive your price quote now, please press 1 and we will connect you to a moving consultant. If you’d like to opt out of further communication, please press 9. Again to receive your moving quote please press 1 to connect with a live agent. For any other questions you may press 2.</prosody></Speak>`
        : `<Speak voice="Polly.Matthew"><prosody rate="medium">Hello, ${
            lead.name
          }. Thank you for returning our call regarding your move from ${
            lead.from_city || ""
          }, ${fromState} moving to ${
            lead.to_city || ""
          }, ${toState}. To receive your price quote for your move please press 1 and we’ll connect you with a move consultant. If you’d like to opt out of further communication, please press 9. Again to receive your moving quote please press 1 to connect with a live agent. For any other questions you may press 2.</prosody></Speak>`;
    } else {
      message = `<Play>${RABBIT_DIJOCA_MEDIA_AUDIO_URL}/did-ivr.mp3</Play>`;
    }

    return `
            <Response>
                <GetDigits action="${PLIVO_WEBHOOK_URL}/raw-call/inbound-did-ivr?rawCallID=${rawCallID}${leadIDParam}${isLocal}" method="POST" numDigits="1" retries="3" timeout="5" validDigits="129">
                ${message}
                </GetDigits>
            </Response>
        `;
  },
};

module.exports = plivoResponses;
