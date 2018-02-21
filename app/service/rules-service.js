var request = require('superagent');
var logger = require("node-logger").createLogger("./app/logs/server.log");

module.exports = {
    getRulesForCompanyIds : (data, url, authToken, callback) => {
        logger.info(
          "Rules-Service : Entered rules service call to fetch rules"
        );
        logger.info(
          "Rules-Service : url = ", url, "data = ", data, "authtoken = ", authToken 
        );
        request
          .get(url + data.companyIds)
          .set("Content-type", "application/json")
          .set("Authorization", "Bearer " + authToken)
          .end(callback);
      }
};