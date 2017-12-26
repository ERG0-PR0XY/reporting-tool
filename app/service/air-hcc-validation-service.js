var request = require("superagent");
var logger = require("node-logger").createLogger("./app/logs/server.log");

module.exports = {
  getAirHCCValidation: (data, url, authToken, callback) => {
    logger.info(
      "Air-HCC-Validation : Entered validation service call to validate air hcc"
    );
    logger.info(
      "Air-HCC-Validation : url = ", url, "data = ", data, "authtoken = ", authToken 
    );
    request
      .post(url)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + authToken)
      .send(data)
      .end(callback);
  }
};
