
//tsc src/*.ts --watch --target ES5



class MakaniNumber {

    private static baseUrl = "https://www.makani.ae/MakaniPublicDataService/MakaniPublic.svc/";
    private static detailsLink = "GetMakaniDetails";
    private static isValidLink = "IsValidMakani";
    private static fromCoordLink = "GetMakaniInfoFromCoord";

    private no:string;
    private validity:Object;
    private details:Object;
    private isValidBit:Boolean;

    public constructor(number:string)
    {
        this.no = number;
        this.validity = {};
        this.details = {};
        this.isValidBit = true;
    }

    static urlencode(text:string) {
        return encodeURIComponent(text).replace(/!/g,  '%21')
            .replace(/'/g,  '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*!/g, '%2A')
            .replace(/%20/g, '+');
    }

    static requestGET(url:string,callback:Function)
    {
        var returnData = {} ;
        $.ajax({
            url: url,
            success: function(data:string) {
                data = JSON.parse(data);
                //console.log(data);
                returnData = data;
                callback(data);
            },
            error : function(jqXHR : any, textStatus: any, errorThrown: any) {
                throw errorThrown;
            }
        });
        return returnData
    }

    private fetchValidity(callback:Function)
    {
        var This = this;
        var url = MakaniNumber.baseUrl + MakaniNumber.isValidLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        MakaniNumber.requestGET(url,function(data:JSON){
            This.validity = data;
            callback(This);
        });
        return this;
    }

    private fetchDetails(callback:Function)
    {
        var This = this;
        var url = MakaniNumber.baseUrl + MakaniNumber.detailsLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        MakaniNumber.requestGET(url,function(data:JSON){
            This.details = data;
            callback(This);
        });
        return this;
    }

    public fetch(params : Object)
    {
        var { success , fail } = params;
        console.log(params);
        try{
            this.fetchValidity(function(self:MakaniNumber){
                self.fetchDetails(function(self:MakaniNumber){
                    success(self);
                });
            });
        }
        catch(e)
        {
            this.isValidBit = false;
            fail(e);
        }
        return this;
    }

    public info()
    {
        if(this.details.hasOwnProperty('MAKANI_INFO') && this.details.MAKANI_INFO.length > 0)
        {
            return this.details.MAKANI_INFO[0];
        }
        return null;
    }

    public isValid()
    {
        if(this.validity.hasOwnProperty('IS_VALID') && this.isValidBit == true)
        {
            return new Boolean(this.validity.IS_VALID);
        }
        return false;
    }

    public makaniNo()
    {
        return this.no;
    }

    public latlng()
    {
        if(this.details.hasOwnProperty('MAKANI_INFO') && this.details.MAKANI_INFO.length > 0)
        {
            var coords:Array<string> = this.details.MAKANI_INFO[0].LATLNG.match(/[+-]?\d+(?:\.\d+)?/g);
            return { lat : coords[0] , lng : coords[1] };
        }
        return null;
    }

    private static fetchMakaniNo(lat:number,lng:number,callback:Function)
    {
        var url = MakaniNumber.baseUrl + MakaniNumber.fromCoordLink + "?latitude=" + MakaniNumber.urlencode(lat.toString()) 
        + "&longitude=" + MakaniNumber.urlencode(lng.toString()); 
        //console.log(url);
        return MakaniNumber.requestGET(url,callback);;
    }

    static fromCoord(params : Object)
    {
        var { lat , lng } = params;
        var data = MakaniNumber.fetchMakaniNo(lat,lng,function(data:JSON){
            if(data.hasOwnProperty('MAKANI_INFO') === false) {
                if(data.hasOwnProperty('DATA') === true){
                    return params.fail(new Error(data.DATA));
                }
                return null;
            }
            var no = data.MAKANI_INFO[0].MAKANI;
            return new MakaniNumber(no).fetch(params);
        });
    }

}

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