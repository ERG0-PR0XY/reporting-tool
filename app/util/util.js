const fs = require("fs");
const logger = require("node-logger").createLogger("./app/logs/server.log");

module.exports = {
  getDateTime: () => {
    var date, dateText, timeText, dateTimeText;

    date = new Date();
    timeText =
      date.getHours() + "." + date.getMinutes() + "." + date.getSeconds();
    dateText =
      date.getDate() +
      "-" +
      (date.getUTCMonth() + 1) +
      "-" +
      date.getUTCFullYear();

    dateTimeText = dateText + " " + timeText;

    return dateTimeText;
  },

  writeDataToJSONFile: (data, filename) => {
    var jsonData = JSON.stringify(data);
    fs.writeFile(filename, jsonData, function(err) {
      if (err) {
        logger.error(
          "JSONFile-Writer : Unable to write data = ",
          jsonData,
          " to file = ",
          filename,
          " error = ",
          err
        );
      }
      logger.info(
        "JSONFile-Writer : Successfully wrote data = ",
        jsonData,
        " to file = ",
        filename
      );
    });
  }
};
