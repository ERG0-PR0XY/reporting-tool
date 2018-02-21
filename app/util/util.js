const fs = require("fs");
const tableify = require("tableify");
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
  },

  writeDataToHTMLFile : (data, filename) => {
    var html, head, body, table;
    head = '<style>table,td,th { border: 1px solid black;}'
          + 'th { background-color: #609cea;}</style></head>';
    table = tableify(data);
    body = '<body>' + table + '</body>';
    html = '<html>' + head + body + '</html>';
    fs.writeFile(filename, html, function(err) {
      if (err) {
        logger.error(
          "HTMLFile-Writer : Unable to write data = ",
          html,
          " to file = ",
          filename,
          " error = ",
          err
        );
      }
      logger.info(
        "HTMLFile-Writer : Successfully wrote data = ",
        html,
        " to file = ",
        filename
      );
    });
  }

};
