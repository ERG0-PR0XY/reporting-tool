var request = require("superagent");
var logger = require("node-logger").createLogger("./app/logs/server.log");

module.exports = {
  getHotelValidation: (data, url, authToken, callback) => {
    logger.info(
      "Hotel-Validation : Entered validation service call to validate hotel policy"
    );
    logger.info(
      "Hotel-Validation : url = ", url, "data = ", data, "authtoken = ", authToken 
    );
    request
      .post(url)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + authToken)
      .send(data)
      .end(callback);
  }
};
