var request = require('superagent');
var logger = require("node-logger").createLogger("./app/logs/server.log");

module.exports = {
    getRWGValidation : (data, url, authToken, callback) => {
        logger.info(
          "RWG-Service : Entered rules service call to fetch rules"
        );
        logger.info(
          "RWG-Service : url = ", url, "data = ", data, "authtoken = ", authToken 
        );
        request
          .post(url)
          .set("Content-type", "application/json")
          .set("Authorization", "Bearer " + authToken)
          .query(data)
          .end(callback);
      }
};