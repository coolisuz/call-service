const { plivo_web_hook_url } = require("../../../.env");

const xmlResponses = {
  getPressOneResponse() {
    return `
        <Response>
          <Play>https://dijoca-tools.com/media/ring.mp3</Play>
          <Dial>
            <Number>+18883751806</Number>
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
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getIncomingTransferredResponse(phone, socketPhoneNum) {
    return `
        <Response>
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
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
            <Number>18009871871</Number>
          </Dial>
        </Response>
      `;
  },

  getNobleRolloverResponse() {
    return `
        <Response>
          <Play>https://dijoca-tools.com/media/audio/ring.mp3</Play>
        </Response>
      `;
  },

  getRolloverCallResponse(forwardNumber) {
    return `
        <Response>
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getLeadCallbackResponse(forwardNumber) {
    return `
        <Response>
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=inbound" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Play>https://dijoca-tools.com/media/audio/ring.mp3</Play>
          <Dial>
            <Number>${forwardNumber}</Number>
          </Dial>
        </Response>
      `;
  },

  getPressOneDialedResponse(lead) {
    return `
        <Response>
          <GetDigits action="${plivo_web_hook_url}/voip-hooks/button-pressed?lead_id=${lead.id}" method="POST" numDigits="1" retries="1" timeout="10" validDigits="129">
            <Play>https://dijoca-tools.com/media/move_quote_ready.mp3</Play>
            <Play>https://dijoca-tools.com/media/move_quote_ready.mp3</Play>
          </GetDigits>
        </Response>
      `;
  },

  getDialedWebHookResponse(lead, callerId) {
    return `
        <Response>
          <Record action="${plivo_web_hook_url}/voip-hooks/record-rep?callerId=${callerId}" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
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
          <Record action="${plivo_web_hook_url}/voip-hooks/record-company${queryString}" redirect="false" startOnDialAnswer="true" maxLength="20000"/>
          <Dial callerId="${lead?.phone}">
            <Number>${toNum}</Number>
          </Dial>
        </Response>
      `;
  },
};

module.exports = xmlResponses;
