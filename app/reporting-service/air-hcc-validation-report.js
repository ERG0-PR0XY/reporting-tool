var Report = require("fluentReports").Report;

module.exports.generateReport = (data, filename, title) => {
  var FILENAME = filename || "Test-Report-02.pdf",
    DATA = data || [],
    TITLE = title || "Report Title",
    columnCounter = 0;

  var headerFunction = function(Report) {
    Report.print(TITLE, {
      fontSize: 22,
      bold: true,
      underline: true,
      align: "center"
    });
    Report.newLine(2);
  };

  var footerFunction = function(Report) {
    Report.line(
      Report.currentX(),
      Report.maxY() - 18,
      Report.maxX(),
      Report.maxY() - 18
    );
    Report.pageNumber({
      text: "Page {0} of {1}",
      footer: true,
      align: "right"
    });
    Report.print("Printed: " + new Date().toLocaleDateString(), {
      y: Report.maxY() - 14,
      align: "left"
    });
    columnCounter = 0;
  };

  var detail = function(Report, Data) {
    if (Data.success) {
      var successData = Data.success;
      Report.print("Successfully Migrated", {
        addX: 12,
        underline: true,
        fontBold: true
      });
      for (var i = 0; i < successData; i++) {
        Report.print(successData[i], { addX: 24 });
      }
    }
    if (Data.failed_air_hcc_classes) {
      var failedData = Data.failed_air_hcc_classes;
      Report.print("Failed to Migrate", {
        addX: 12,
        underline: true,
        fontBold: true
      });
      Object.keys(failedData).forEach(function(prop) {
        Report.print("Company Id: " + prop, { addX: 24 });
        var companyData = failedData[prop];
        for (var j = 0; j < companyData.length; j++) {
          Report.print("Traveler Group - " + (j + 1), {
            addX: 36,
            underline: true
          });
          Report.print(
            "Traveler Group Id: " + companyData[j].traveler_group_id,
            { addX: 36, fill: "#fffaa0" }
          );
          Report.print(
            "Traveler Group Name: " + companyData[j].traveler_group_name,
            { addX: 36, fill: "#fffaa0" }
          );
          Report.print(
            "No. Of Legacy Location Exceptions: " +
              companyData[j].no_of_legacy_origin_destinations,
            { addX: 36 }
          );
          Report.print(
            "No. Of Global Location Exemptions: " +
              companyData[j].no_of_global_origin_destinations,
            { addX: 36 }
          );
          Report.print(
            "No. Of Legacy Duration Exceptions: " +
              companyData[j].no_of_legacy_duration_exceptions,
            { addX: 36 }
          );
          Report.print(
            "No. Of Global Duration Exemptions: " +
              companyData[j].no_of_global_duration_exemptions,
            { addX: 36 }
          );
          Report.print("Reason: " + companyData[j].reason, { addX: 36 });
          var locations = companyData[j].missing_locations;
          Report.print("Missing Location Exceptions", { addX: 36 });
          for (var x = 0; x < locations.length; x++) {
            Report.print("Location - " + (x + 1), {
              addX: 48,
              underline: true
            });
            Report.print(
              "Restriction Class Code: " + locations[x].restriction_class_code,
              { addX: 48 }
            );
            Report.print("Priority: " + locations[x].priority, { addX: 48 });
            Report.print(
              "Policy Exception Type: " +
                locations[x].policy_exception_type_key,
              { addX: 48 }
            );
            Report.print("From Area Loc: " + locations[x].from_area_loc, {
              addX: 48
            });
            Report.print("From Scale Code: " + locations[x].from_scale_code, {
              addX: 48
            });
            Report.print("To Area Loc: " + locations[x].to_area_loc, {
              addX: 48
            });
            Report.print("To Scale Loc: " + locations[x].to_scale_code, {
              addX: 48
            });
          }
        }
      });
    }
  };

  var testReport = new Report(FILENAME)
    .margins(50)
    .font("Courier")
    .pageHeader(headerFunction)
    .data(DATA)
    .pageFooter(footerFunction)
    .detail(detail)
    .groupBy("id");

  console.time("Rendered");
  testReport.render(function(err, name) {
    console.timeEnd("Rendered");
  });

  testReport.printStructure(true);
};
