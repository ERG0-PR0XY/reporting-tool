const express = require("express");
const bodyParser = require("body-parser");
var request = require("superagent");
var tableify = require("tableify");
const logger = require("node-logger").createLogger("./app/logs/server.log");
const app = express();

const constants = require("./app/constants/constants");
const util = require("./app/util/util");

let mockData = require("./app/data/response");
var report = require("./app/reporting-js/test-report");
const testService = require("./app/service/test-service");
const airHCCValidationService = require("./app/service/air-hcc-validation-service");

var testReportService = require("./app/reporting-service/test-user-report");
const airHCCValidationReport = require("./app/reporting-service/air-hcc-validation-report");

const BASE_PATH = "/app";
const HTTP_PORT = 3030;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + BASE_PATH + "/index.html");
});

app.post("/validate", (request, response) => {
  var authToken, data, url, result, env, filename, callback, pdfFilename, jsonFilename, htmlFilename;

  env = request.body.env;
  authToken = request.body.authToken;
  data = {
    company_ids: request.body.companyIds,
    lobs: request.body.lob
  };
  url = constants[env];

  pdfFilename =
    constants.REPORT_BASE_PATH +
    "air-hcc-validation-[" +
    util.getDateTime() +
    "].pdf";

  jsonFilename =
    constants.REPORT_BASE_PATH +
    "air-hcc-validation-[" +
    util.getDateTime() +
    "].json";

  htmlFilename =
    constants.REPORT_BASE_PATH +
    "air-hcc-validation-[" +
    util.getDateTime() +
    "].html";

  logger.info(
    "Validate-Controller : env = ",
    env,
    " data = ",
    data,
    " url = ",
    url,
    " authToken = ",
    authToken
  );

  callback = (err, res) => {
    if (!err && res && res.ok) {
      result = res.body;
      logger.info("Validate-Controller : Response body = ", result);
      airHCCValidationReport.generateReport(result, pdfFilename, "Air HCC Validation Report");
      util.writeDataToJSONFile(result, jsonFilename);
      util.writeDataToHTMLFile(result, htmlFilename);
      // response.sendFile(__dirname + '/' + htmlFilename);
      response.redirect("/");
    } else {
      logger.error(
        "Validate-Controller : Error fetching result url = ",
        url,
        " data = ",
        data,
        " env = ",
        env
      );
    }
  };

  airHCCValidationService.getAirHCCValidation(
    data,
    constants.MOCK_URL,
    authToken,
    callback
  );
});

app.get("/success", (req, res) => {
  var page = "/app/reports/air-hcc-validation-[28-12-2017 18.58.3].html";
  if(page) {
    console.log(__dirname + page);
    res.sendFile(__dirname + page);
  }
  res.redirect('/');
});

app.listen(HTTP_PORT, () => {
  console.log("Listenin on port: ", HTTP_PORT);
});
