const express = require('express');
const bodyParser = require('body-parser');
// var Report = require('fluentReports').Report;
var request = require('superagent');
const app = express();

let mockData = require('./app/data/mock-data.json');
var report = require('./app/reporting-js/test-report');

const BASE_PATH = '/app';
const HTTP_PORT = 3030;
const MOCK_URL = 'http://localhost:3000/users';

app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + BASE_PATH + '/index.html');
});

app.post('/validate', (req, res) => {
    // console.log(req.body);
    console.log('----------------------------------------');
    var data;

    request.get(MOCK_URL)
        .set('Content-type', 'application/json')
        .set('Authorization', 'Bearer '+req.body.authToken)
        .then((res) => {
            if(res.ok) {
                console.info(res.body);
                data = res.body;
                report.generateReport(res.body, 'Test-Report-['+ new Date() +'].pdf', 'Validation Report');
            }
        }).catch((err) => {
            console.error(err);
        });
    
    // , (err,res) => {
    //     if(err) {
    //         console.error(err);
    //     } else {
    //         // console.info(res.body);
    //         data = res.body;
    //     }
    // });

    console.log("Data : ",data);

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