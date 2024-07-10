const { plivo_web_hook_url } = require("../../../.env");

const stateMapping = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const getStateNameByAbbr = (abbr) => {
  if (!abbr) return "";
  return stateMapping[abbr] || abbr;
};

const xmlResponses = {
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
      message = `<Play>https://rabbit.dijoca.com/media/audio/did-ivr.mp3</Play>`;
    }

    return `
            <Response>
                <GetDigits action="${config.voip.plivo_web_hook_url}/raw-call/inbound-did-ivr?rawCallID=${rawCallID}${leadIDParam}${isLocal}" method="POST" numDigits="1" retries="3" timeout="5" validDigits="129">
                ${message}
                </GetDigits>
            </Response>
        `;
  },
};

module.exports = xmlResponses;
