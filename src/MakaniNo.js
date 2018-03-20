//tsc src/*.ts --watch --target ES5
var MakaniNumber = /** @class */ (function () {
    function MakaniNumber(number) {
        this.no = number;
        this.validity = {};
        this.details = {};
        this.isValidBit = true;
    }
    MakaniNumber.urlencode = function (text) {
        return encodeURIComponent(text).replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*!/g, '%2A')
            .replace(/%20/g, '+');
    };
    MakaniNumber.requestGET = function (url, callback) {
        var returnData = {};
        $.ajax({
            url: url,
            success: function (data) {
                data = JSON.parse(data);
                //console.log(data);
                returnData = data;
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                throw errorThrown;
            }
        });
        return returnData;
    };
    MakaniNumber.prototype.fetchValidity = function (callback) {
        var This = this;
        var url = MakaniNumber.baseUrl + MakaniNumber.isValidLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        MakaniNumber.requestGET(url, function (data) {
            This.validity = data;
            callback(This);
        });
        return this;
    };
    MakaniNumber.prototype.fetchDetails = function (callback) {
        var This = this;
        var url = MakaniNumber.baseUrl + MakaniNumber.detailsLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        MakaniNumber.requestGET(url, function (data) {
            This.details = data;
            callback(This);
        });
        return this;
    };
    MakaniNumber.prototype.fetch = function (params) {
        var success = params.success, fail = params.fail;
        console.log(params);
        try {
            this.fetchValidity(function (self) {
                self.fetchDetails(function (self) {
                    success(self);
                });
            });
        }
        catch (e) {
            this.isValidBit = false;
            fail(e);
        }
        return this;
    };
    MakaniNumber.prototype.info = function () {
        if (this.details.hasOwnProperty('MAKANI_INFO') && this.details.MAKANI_INFO.length > 0) {
            return this.details.MAKANI_INFO[0];
        }
        return null;
    };
    MakaniNumber.prototype.isValid = function () {
        if (this.validity.hasOwnProperty('IS_VALID') && this.isValidBit == true) {
            return new Boolean(this.validity.IS_VALID);
        }
        return false;
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
    MakaniNumber.fetchMakaniNo = function (lat, lng, callback) {
        var url = MakaniNumber.baseUrl + MakaniNumber.fromCoordLink + "?latitude=" + MakaniNumber.urlencode(lat.toString())
            + "&longitude=" + MakaniNumber.urlencode(lng.toString());
        //console.log(url);
        return MakaniNumber.requestGET(url, callback);
        ;
    };
    MakaniNumber.fromCoord = function (params) {
        var lat = params.lat, lng = params.lng;
        var data = MakaniNumber.fetchMakaniNo(lat, lng, function (data) {
            if (data.hasOwnProperty('MAKANI_INFO') === false) {
                if (data.hasOwnProperty('DATA') === true) {
                    return params.fail(new Error(data.DATA));
                }
                return null;
            }
            var no = data.MAKANI_INFO[0].MAKANI;
            return new MakaniNumber(no).fetch(params);
        });
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
    makani.fetch(function(data){
        console.log(data.latlng());
    });
}

function m1()
{
    var makani = MakaniNumber.fromCoord(25.2646373,55.312168,function (data){
        console.log(data.isValid());
    });
    
}

m1();
m2();

*/ 
