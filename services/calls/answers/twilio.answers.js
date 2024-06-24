const { WEBHOOK_URI } = require("../../../.env");

const TwilioAnswers = {
    oneDialed({ leadId }) {
        return `
            <Response>
                <Gather
                    action="${ WEBHOOK_URI }/voip-hooks/button-pressed?lead_id=${ leadId }"
                    method="POST"
                    numDigits="1"
                    timeout="10"
                >
                    <Play>https://dijoca-tools.com/media/move_quote_ready.mp3</Play>
                    <Play>https://dijoca-tools.com/media/move_quote_ready.mp3</Play>
                </Gather>
            </Response>
        `;
    },

    oneButtonPressed() {
        return `
            <Response>
                <Play>https://dijoca-tools.com/media/ring.mp3</Play>
                <Dial>
                    <Number>+18883751806</Number>
                </Dial>
            </Response>
        `;
    },

    hangup({ reason }) {
        return `
            <Response>
                <Hangup reason="${ reason }" />
            </Response>
        `;
    },

    missingTSR() {
        return `
            <Response>
                <Speak voice="Polly.Amy">
                    <prosody rate="medium">
                        Missing <say-as interpret-as="spell-out">TSR</say-as>
                    </prosody>
                </Speak>
                <Hangup reason="MISSING TSR" />
            </Response>
        `;
    },

    transferWithRecordingToPhone({ phone, callerId, callerName = null, callerAdditionalName = null }) {
        return `
            <Response>
                <Record
                    action="${ WEBHOOK_URI }/voip-hooks/record-rep?callerId=${ callerId }"
                    maxLength="20000"
                />
                <Dial callerId="${ callerName || callerId }" callerName="${ callerAdditionalName }">
                    <Number>${ phone }</Number>
                </Dial>
            </Response>
        `;
    },

    transferWithRecordingToSip({ phone, callerId, callerName = null, callerAdditionalName = null }) {
        return `
            <Response>
                <Record
                    action="${ WEBHOOK_URI }/voip-hooks/record-rep?callerId=${ callerId }"
                    maxLength="20000"
                />
                <Dial callerId="${ callerName || callerId }" callerName="${ callerAdditionalName }">
                    <Sip>sip:${ phone }@8.41.59.138:5060</Sip>
                </Dial>
            </Response>
        `;
    },

    transferWithRecordingToPhoneAndPlayRing({ phone, callerId }) {
        return `
            <Response>
                <Record
                    action="${ WEBHOOK_URI }/voip-hooks/record-rep?callerId=${ callerId }"
                    maxLength="20000"
                />
                <Play>https://dijoca-tools.com/media/audio/ring.mp3</Play>
                <Dial>
                    <Number>${ phone }</Number>
                </Dial>
            </Response>        
        `;
    },

    transferCompanyWithRecordingToPhone({ phone, callerId, queryString }) {
        return `
            <Response>
                <Record
                    action="${ WEBHOOK_URI }/voip-hooks/record-company${queryString}"
                    maxLength="20000"
                />
                <Dial callerId="${ callerId }">
                    <Number>${ phone }</Number>
                </Dial>
            </Response>
        `;
    },

    transfer({ phone, callerId }) {
        return `
            <Response>
                <Dial callerId="${ callerId }">
                    <Number>${ phone }</Number>
                </Dial>
            </Response>
        `;
    },

    playRing() {
        return `
            <Response>
                <Play>https://dijoca-tools.com/media/audio/ring.mp3</Play>
            </Response>
        `;
    }
}

module.exports = TwilioAnswers;
