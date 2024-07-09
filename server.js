require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const callRoutes = require("./routes/callRoutes");
const plivoRoutes = require("./routes/plivoRoutes");
const twilioRoutes = require("./routes/twilioRoutes");

const creds = require("./.env");

const app = express();
app.use(bodyParser.json());

app.use("/api/call/plivo", plivoRoutes);
app.use("/api/call/twilio", twilioRoutes);

const PORT = creds.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
