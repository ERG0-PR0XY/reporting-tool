var Report = require("fluentReports").Report;

module.exports.generateReport = (data, filename, title) => {
    var FILENAME = filename || 'Test-Report.pdf',
        DATA = data || [],
        TITLE = title || 'Report Title',
        columnCounter = 0;

    var headerFunction = function(Report) {
            Report.print(TITLE, {fontSize: 22, bold: true, underline:true, align: "center"});
            Report.newLine(2);
        };

    var footerFunction = function(Report) {
            Report.line(Report.currentX(), Report.maxY()-18, Report.maxX(), Report.maxY()-18);
            Report.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
            Report.print("Printed: "+(new Date().toLocaleDateString()), {y: Report.maxY()-14, align: "left"});
            columnCounter = 0;
        };

    var detailFunction = function(Report, Data) {
            Report.box(Report.currentX()-1, Report.currentY()-1, 10, 10, {});
            Report.print(Data.id + ' ' + Data.first_name + ' ' + Data.last_name + ' ' + Data.email, {addX: 12, addY: 12});
            // Report.print([[Data.id, 50], [Data.first_name, 80], [Data.last_name, 80], [Data.email, 250]], {addX: 12});
        };

    var dataHeader = function(Report, Data) {
            Report.fontBold();
            Report.band([
                    {data: 'ID', width: 50},
                    {data: 'FIRST NAME', width: 100},
                    {data: 'LAST NAME', width: 100},
                    {data: 'E-MAIL', width: 250}
                ]);
            Report.fontNormal();
            Report.bandLine();
        };

    var testReport = new Report(FILENAME)
        .margins(50)
        .font('Courier')
        .pageHeader(headerFunction) 
        .data(DATA)
        .pageFooter(footerFunction)
        // .detail(detailFunction)
        .groupBy('id')
        .detail("{{id}} || {{first_name}} || {{last_name}} || {{email}}");

    console.time("Rendered");
    testReport.render(function(err, name) {
        console.timeEnd("Rendered");
    });

    testReport.printStructure(true);
}