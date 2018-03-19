//tsc src/*.ts --watch --target ES5
var MakaniNumber = /** @class */ (function () {
    function MakaniNumber(number) {
        this.no = number;
        this.validity = {};
        this.details = {};
    }
    MakaniNumber.urlencode = function (text) {
        return encodeURIComponent(text).replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*!/g, '%2A')
            .replace(/%20/g, '+');
    };
    MakaniNumber.requestGET = function (url) {
        var returnData = {};
        $.ajax({
            url: url,
            async: false,
            cache: false,
            success: function (data) {
                data = JSON.parse(data);
                //console.log(data);
                returnData = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                throw errorThrown;
            }
        });
        return returnData;
    };
    MakaniNumber.prototype.fetchValidity = function () {
        var url = MakaniNumber.baseUrl + MakaniNumber.isValidLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        this.validity = MakaniNumber.requestGET(url);
        return this;
    };
    MakaniNumber.prototype.fetchDetails = function () {
        var url = MakaniNumber.baseUrl + MakaniNumber.detailsLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        this.details = MakaniNumber.requestGET(url);
        return this;
    };
    MakaniNumber.prototype.fetch = function () {
        this.fetchValidity();
        this.fetchDetails();
        return this;
    };
    MakaniNumber.prototype.info = function () {
        if (this.details.hasOwnProperty('MAKANI_INFO') && this.details.MAKANI_INFO.length > 0) {
            return this.details.MAKANI_INFO[0];
        }
        return null;
    };
    MakaniNumber.prototype.isValid = function () {
        if (this.validity.hasOwnProperty('IS_VALID')) {
            return this.validity.IS_VALID;
        }
        return null;
    };
    MakaniNumber.prototype.makaniNo = function () {
        return this.no;
    };
    MakaniNumber.prototype.latlng = function () {
        if (this.details.hasOwnProperty('MAKANI_INFO') && this.details.MAKANI_INFO.length > 0) {
            var coords = this.details.MAKANI_INFO[0].LATLNG.match(/[+-]?\d+(?:\.\d+)?/g);
            return { lat: coords[0], lng: coords[1] };
        }
        return null;
    };
    MakaniNumber.fetchMakaniNo = function (lat, lng) {
        var url = MakaniNumber.baseUrl + MakaniNumber.fromCoordLink + "?latitude=" + MakaniNumber.urlencode(lat.toString())
            + "&longitude=" + MakaniNumber.urlencode(lng.toString());
        //console.log(url);
        var data = MakaniNumber.requestGET(url);
        return data;
    };
    MakaniNumber.fromCoord = function (lat, lng) {
        var data = MakaniNumber.fetchMakaniNo(lat, lng);
        var no = data.MAKANI_INFO[0].MAKANI;
        return new MakaniNumber(no).fetch();
    };
    MakaniNumber.baseUrl = "https://www.makani.ae/MakaniPublicDataService/MakaniPublic.svc/";
    MakaniNumber.detailsLink = "GetMakaniDetails";
    MakaniNumber.isValidLink = "IsValidMakani";
    MakaniNumber.fromCoordLink = "GetMakaniInfoFromCoord";
    return MakaniNumber;
}());
/*
function m2()
{
    var makani = new MakaniNumber("30245 95127");
    makani.fetch();
    console.log(makani.latlng());
}

function m1()
{
    var makani = MakaniNumber.fromCoord(25.2646373,55.312168);
    console.log(makani.isValid());
}

m1();
m2();

*/ 
