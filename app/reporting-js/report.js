var Report = require("fluentReports").Report;

module.exports.generateReport = (data, filename, title) => {
    var TITLE = title || 'Report Title';
    var FILENAME = filename || 'Report.pdf';
    var DATA = data || [];

    console.log(TITLE + " - " + FILENAME + " - ",DATA);

    var columnCounter = 0;

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

    var detailFunction = function(Report, Data) {
        var x = 0,
            y = 0;
        
        console.log('Data: ',Data);

        if (columnCounter % 4 === 1) {
            x += 100;
            y = Report.heightOfString() + 1;
        } else if (columnCounter % 4 === 2) {
            x += 300;
            y = Report.heightOfString() + 1;
        }
        Report.box(Report.currentX() + x, Report.currentY() - y, 10, 10, {});
        Report.print(
            Data.id + " " + Data.first_name + " " + Data.last_name + " " + Data.email,
            { addX: x + 12, addY: -(y - 1) }
        );
        columnCounter++;
    };

    var rpt = new Report(FILENAME)
        .margins(20) // Change the Margins to 20 pixels
        .data(DATA) // Add our Data
        //.pageHeader(headerFunction) // Add a header
       // .pageFooter(footerFunction) // Add a footer
        .detail("{{id}} || {{first_name}} || {{last_name}} || {{email}}"); // Put how we want to print out the data line.

    // rpt.render(displayReport);
    rpt.printStructure(true);
};
