var request = require("superagent");
var logger = require("node-logger").createLogger("./app/logs/server.log");

module.exports = {
  getTestServiceResponse: (data, url, authToken, callback) => {
    logger.info(
      "Test-Service : Entered test service call"
    );
    logger.info("Test-Service : Data = ", data, " url = ", url);
    var data;
    console.log('Data: ',data);
    request
      .get(url)
      .set("Content-type", "application/json")
      .set("Authorization", "Bearer " + authToken)
      .end(callback);
  }
};
