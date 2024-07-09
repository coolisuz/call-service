const { plivo_web_hook_url } = require("../../../routes/.env");

const pressOneXmlResponses = {
  answerCallbackResponse(audio, leadUserId, leadMoveType) {
    return `
            <Response>
                <Record action="${plivo_web_hook_url}/press-one/callback/record?lead_user_id=${encodeURIComponent(
      leadUserId
    )}" maxLength="20000" startOnDialAnswer="true" redirect="false"/>
                <GetDigits action="${plivo_web_hook_url}/press-one/callback/digit-input?move_type=${leadMoveType}&#x26;lead_user_id=${encodeURIComponent(
      leadUserId
    )}" method="POST" timeout="30" numDigits="1" validDigits="19">
                    <Play loop="2">${audio}</Play>
                </GetDigits>
                <Speak>Input not received. Thank you</Speak>
            </Response>
        `;
  },
  digitInput1(connect_to) {
    return `
            <Response>
                 <Dial>
                    <Number>${connect_to}</Number>
                 </Dial>
            </Response>
        `;
  },
  digitInput9() {
    return `
            <Response>
                <Hangup schedule="1"/>
                <Speak loop="1">Thank You</Speak>
            </Response>
        `;
  },
  digitInputDefault(phone) {
    return `
            <Response>
                <Dial>
                    <Number>${phone}</Number>
                </Dial>
            </Response>
        `;
  },
  hangup(reason) {
    return `
            <Response>
                <Hangup reason="${reason}" />
            </Response>
        `;
  },
  noBuyersAvailable() {
    return `
            <Response>
                <Play>https://rabbit.dijoca.com/media/audio/no_movers_recording.mp3</Play>
                <Hangup reason="No buyers available" />
            </Response>
        `;
  },
};

module.exports = pressOneXmlResponses;
