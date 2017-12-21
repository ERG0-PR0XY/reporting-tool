const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// var Report = require('fluentReports').Report;
var request = require('superagent');
const app = express();

let mockData = require('./app/data/mock-data.json');
var report = require('./app/reporting-js/test-report');

const BASE_PATH = '/app';
const HTTP_PORT = 3030;
// const MOCK_URL = 'http://localhost:3000/users';
const MOCK_URL = 'http://192.168.72.250:8085/policy-service/v3/validate-bulk-migration';

app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + BASE_PATH + '/index.html');
});

app.post('/validate', (req, res) => {
    console.log(req.body);
    console.log('----------------------------------------');
    var data;

    request.post(MOCK_URL)
    .set('Content-type', 'application/json')
    .set('Authorization', 'Bearer '+req.body.authToken)
    .send({"company_ids" : req.body.companyIds, "lobs" : req.body.lob})
    .then((res) => {
        if(res.ok) {
            var data = res.body;
            fs.writeFile('response.json', JSON.stringify(data), function (err) {
                if (err) return console.log(err);
                console.log('Data: ',JSON.stringify(data),' > response.txt');
              });
            console.log('---------------FAILED-DATA----------------');
            if(data.failed) {
                var failed = data.failed;
                Object.keys(failed).forEach(function(prop) {
                    var failedData = failed[prop];
                    console.log(prop,": ",failedData);
                    console.log('---------------START-LOC----------------');
                    for(var i=0 ; i < failedData.length ; i++) {
                        console.log('Missing Locations: ',failedData[i].missing_locations);
                    }
                    console.log('---------------END-LOC----------------');
                });
            } else {
                console.log('Failed Data: ',data.failed);
            }
            console.log('----------------------------------------');
            var date = new Date();
            var dateTime = date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear + ' '
                            + date.getHours() + '.' + date.getMinutes() + '.' + date.getSeconds();
            report.generateReport(data, 'Validation-Report-[' + dateTime + '].pdf', 'Validation Report');
        }
    }).catch((err) => {
        console.error(err);
    });

    // request.get(MOCK_URL)
    //     .set('Content-type', 'application/json')
    //     .set('Authorization', 'Bearer '+req.body.authToken)
    //     .then((res) => {
    //         if(res.ok) {
    //             console.info(res.body);
    //             data = res.body;
    //             // report.generateReport(res.body, 'Test-Report-01.pdf', 'Validation Report');
    //         }
    //     }).catch((err) => {
    //         console.error(err);
    //     });
    
    // , (err,res) => {
    //     if(err) {
    //         console.error(err);
    //     } else {
    //         // console.info(res.body);
    //         data = res.body;
    //     }
    // });

    res.redirect('/');

    // var testReport = new Report("Test-Report-01.pdf")
    //     .pageHeader( ["Test Validation Report"] ) 
    //     .data(mockData)
    //     .detail("{{id}} || {{first_name}} || {{last_name}} || {{email}}");

    // console.time("Rendered");
    // testReport.render(function(err, name) {
    //     console.timeEnd("Rendered");
    //     res.redirect('/');
    // });

    // testReport.printStructure(true);
    
});

app.listen(HTTP_PORT, () => {
    console.log('Listenin on port: ',HTTP_PORT);
});