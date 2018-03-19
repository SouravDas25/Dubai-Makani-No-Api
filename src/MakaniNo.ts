
//tsc src/*.ts --watch --target ES5



class MakaniNumber {

    private static baseUrl = "https://www.makani.ae/MakaniPublicDataService/MakaniPublic.svc/";
    private static detailsLink = "GetMakaniDetails";
    private static isValidLink = "IsValidMakani";
    private static fromCoordLink = "GetMakaniInfoFromCoord";

    private no:string;
    private validity:Object;
    private details:Object;

    public constructor(number:string)
    {
        this.no = number;
        this.validity = {};
        this.details = {};
    }

    static urlencode(text:string) {
        return encodeURIComponent(text).replace(/!/g,  '%21')
            .replace(/'/g,  '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*!/g, '%2A')
            .replace(/%20/g, '+');
    }

    static requestGET(url:string)
    {
        var returnData = {} ;
        $.ajax({
            url: url,
            async: false,
            cache: false,
            success: function(data:string) {
                data = JSON.parse(data);
                //console.log(data);
                returnData = data;
            },
            error : function(jqXHR : any, textStatus: any, errorThrown: any) {
                throw errorThrown;
            }
        });
        return returnData
    }

    private fetchValidity()
    {
        var url = MakaniNumber.baseUrl + MakaniNumber.isValidLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        this.validity = MakaniNumber.requestGET(url);
        return this;
    }

    private fetchDetails()
    {
        var url = MakaniNumber.baseUrl + MakaniNumber.detailsLink + "?makanino=" + MakaniNumber.urlencode(this.no);
        this.details = MakaniNumber.requestGET(url);
        return this;
    }

    public fetch()
    {
        this.fetchValidity();
        this.fetchDetails()
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
        if(this.validity.hasOwnProperty('IS_VALID') )
        {
            return this.validity.IS_VALID;
        }
        return null;
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

    private static fetchMakaniNo(lat:number,lng:number)
    {
        var url = MakaniNumber.baseUrl + MakaniNumber.fromCoordLink + "?latitude=" + MakaniNumber.urlencode(lat.toString()) 
        + "&longitude=" + MakaniNumber.urlencode(lng.toString()); 
        //console.log(url);
        var data =  MakaniNumber.requestGET(url);
        return data;
    }

    static fromCoord(lat:number,lng:number)
    {
        var data = MakaniNumber.fetchMakaniNo(lat,lng);
        var no = data.MAKANI_INFO[0].MAKANI;
        return new MakaniNumber(no).fetch();
    }

}

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