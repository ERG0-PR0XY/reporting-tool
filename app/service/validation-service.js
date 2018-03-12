const airHCCValidationService = require("./air-hcc-validation-service");
const hotelValidationService = require("./hotel-validation-service");

module.exports = {
    validateForLOB : (lob, data, url, authToken, callback) => {
        switch(lob){
            case 'AIR' : airHCCValidationService.getAirHCCValidation(data, url, authToken, callback);
                        break;
            case 'HOTEL' : hotelValidationService.getHotelValidation(data, url, authToken, callback);
                        break;
            default : break;
        }
    }
};