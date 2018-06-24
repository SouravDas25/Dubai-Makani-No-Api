# Dubai-Makani-No-Api
Dubai Makani No Api - Convert Makani No to and from Map Coordinates and many more.

## Update 
as some new changes has been made to the makani server the javascript Api Won't work due to CORS errors or
'Access-Control-Allow-Origin' header error.
Thus a PHP implementation of the API is provided to bypass the CORs.

## installation

#### Javascript
include this script tag in your html file, and you are ready to use makani API.
```html
<!-- Place MakaniNo.js in approriate folder first  -->
<script src="./src/MakaniNo.js"> </script>

```

#### PHP 
import the makani.php in any of your php file to use it.
```php

// procedural
require Makani.php

// OOP
use Makani;

```

## usage

#### Verify Makani No

##### Javascript
```Javascript

var No = "30245 95127";
var makani = new MakaniNumber(No);
makani.fetch({
  success : function (data) {
      if( data.isValid() ) {
        //do something..
      }
  },
  fail: function(e) {
      //do something..
  }
});


```

##### PHP
```php

$makani_no = $_GET['makani_no'];
$data = Makani::Query($makani_no)->toJson();
if(data.valid){
    echo "MAKANI IS VALID";
}


```

#### Get Lat-Lng From Makani No

```Javascript

var No = "30245 95127";
var makani = new MakaniNumber(No);
makani.fetch({
  success : function (data) {
      if( data.isValid() ) {
        var lat = data.latlng().lat;
        var lng = data.latlng().lng;
        // your code...
      }
  },
  fail: function(e) {
      //do something..
  }
});

```


#### Get Address From Makani No

```Javascript

var No = "30245 95127";
var makani = new MakaniNumber(No);
makani.fetch({
  success : function (data) {
      if( data.isValid() ) {
        var address = data.address();
        // your code...
      }
  },
  fail: function(e) {
      //do something..
  }
});

```

#### Get Makani No From Lat-Lng

```Javascript

var lat = 25.2646373;
var lng = 55.312168;
var makani = MakaniNumber.fromCoord( {
    lat : lat,
    lng : lng,
    success : function (data) {
        if (data !== null && data.isValid() )  
        {
            var makani_no = data.makaniNo();
            //your code...
        }
    },
    fail: function(e) {
        //do something..
    }
  }
);
```

## Test Site
a test site is provided out of the box to test your system.
it is located <a href="https://github.com/SouravDas25/Dubai-Makani-No-Api/tree/master/src/Test-your-built-Here"> here</a>.

![site-image](https://github.com/SouravDas25/Dubai-Makani-No-Api/blob/master/src/Test-your-built-Here/screens.png)

#### Dependency
all api link are provided by the Dubai Government.
this release works as long as their api work.
here is the link from where the api is taken.

https://www.dm.gov.ae/wps/wcm/connect/b1c96c7e-98d3-447a-b4b4-6c84f15e027a/Makani+Public+Web+Service+Access.pdf?MOD=AJPERES

https://www.makani.ae/MakaniPublicDataService/MakaniPublic.svc
