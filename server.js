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
const validationService = require("./app/service/validation-service");
const airHCCValidationService = require("./app/service/air-hcc-validation-service");

var testReportService = require("./app/reporting-service/test-user-report");
const airHCCValidationReport = require("./app/reporting-service/air-hcc-validation-report");

const rulesService = require("./app/service/rules-service");

const rwgService = require("./app/service/rwg-service");

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
    lobs: request.body.lob,
    rwg: request.body.rwg
  };
  url = constants[env];

  // pdfFilename =
  //   constants.REPORT_BASE_PATH +
  //   "air-hcc-validation-[" +
  //   util.getDateTime() +
  //   "].pdf";

  jsonFilename =
    constants.REPORT_BASE_PATH + request.body.lob +
    "-validation-[" +
    util.getDateTime() +
    "].json";

  htmlFilename =
    constants.REPORT_BASE_PATH + request.body.lob +
    "-validation-[" +
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
      // airHCCValidationReport.generateReport(result, pdfFilename, "Air HCC Validation Report");
      util.writeDataToJSONFile(result, jsonFilename);
      util.writeDataToHTMLFile(result, htmlFilename);
      response.redirect("/success");
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

  validationService.validateForLOB(data.lobs, data, url, authToken, callback);

  // airHCCValidationService.getAirHCCValidation(
  //   data,
  //   url,
  //   authToken,
  //   callback
  // );
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + BASE_PATH + "/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + BASE_PATH + "/error.html");
});


app.get("/rules", (req, res) => {
  res.sendFile(__dirname + BASE_PATH + "/rules_backup.html");
});

app.post("/backup_rules", (request, response) => {
  var authToken, 
      data, 
      url, 
      result, 
      env, 
      filename, 
      callback, 
      jsonFilename, 
      htmlFilename;
  
    env = request.body.env;
    authToken = request.body.authToken;
    data = {
      companyIds: request.body.companyIds,
    };

    url = constants[env];
  
    jsonFilename =
      constants.REPORT_BASE_PATH +
      "rules-backup-[" +
      util.getDateTime() +
      "].json";
  
    htmlFilename =
      constants.REPORT_BASE_PATH +
      "rules-backup-[" +
      util.getDateTime() +
      "].html";


  callback = (err, res) => {
    if (!err && res && res.ok) {
      result = res.body;
      logger.info("Rules-Controller : Response body = ", result);
      util.writeDataToJSONFile(result, jsonFilename);
      util.writeDataToHTMLFile(result, htmlFilename);
      response.redirect("/success");
    } else {
      logger.error(
        "Rules-Controller : Error fetching result url = ",
        url,
        " data = ",
        data,
        " env = ",
        env
      );
      response.redirect("/error");
    }
  };

  rulesService.getRulesForCompanyIds(
    data,
    url,
    authToken,
    callback
  );
});

app.get("/rwg", (req, res) => {
  res.sendFile(__dirname + BASE_PATH + "/rwg.html");
});

app.post("/rwg_validate", (request, response) => {
  var authToken, 
      data, 
      url, 
      result, 
      env, 
      filename, 
      callback, 
      pdfFilename, 
      jsonFilename, 
      htmlFilename,
      companyIds,
      fromToCompanyIds;

  env = request.body.env;
  authToken = request.body.authToken;
  data = {
    companyId: request.body.companyIds
  };
  url = constants[env];

  if(data.companyId) {
    companyIds = (data.companyId).split(',');
    fromToCompanyIds = companyIds[0] + "-" + companyIds[companyIds.length - 1];
  }

  pdfFilename =
    constants.REPORT_BASE_PATH +
    "rwg-validation-"+fromToCompanyIds+"-[" +
    util.getDateTime() +
    "].pdf";

  jsonFilename =
    constants.REPORT_BASE_PATH +
    "rwg-validation-"+fromToCompanyIds+"-[" +
    util.getDateTime() +
    "].json";

  htmlFilename =
    constants.REPORT_BASE_PATH +
    "rwg-validation-"+fromToCompanyIds+"-[" +
    util.getDateTime() +
    "].html";

  logger.info(
    "rwg-Controller : env = ",
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
      util.writeDataToJSONFile(result, jsonFilename);
      util.writeDataToHTMLFile(result, htmlFilename);
      response.redirect("/success");
    } else {
      logger.error(
        "RWG-Validate-Controller : Error fetching result url = ",
        url,
        " data = ",
        data,
        " env = ",
        env,
		" error = ",
		err
      );
	  response.redirect("/error");
    }
  };

  rwgService.getRWGValidation(
    data,
    url,
    authToken,
    callback
  );
});

app.listen(HTTP_PORT, () => {
  console.log("Listenin on port: ", HTTP_PORT);
});
