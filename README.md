# Dubai-Makani-No-Api
Dubai Makani No Api - Convert Makani No to and from Map Coordinates and many more.

## installation
include this script tag in your html file, and you are ready to use makani API.
```html

<script src="./src/MakaniNo.js"> </script>

```


## usage

#### Verify Makani No

```Javascript

var No = "30245 95127";
var makani = new MakaniNumber(No).fetch();

if( makani.isValid() ) {
  //do something..
}

```

#### Get Lat-Lng From Makani No

```Javascript

var No = "30245 95127";
var makani = new MakaniNumber(No).fetch();

if( makani.isValid() ) {
  var lat = makani.latlng().lat;
  var lng = makani.latlng().lng;
}


```


#### Get Makani No From Lat-Lng

```Javascript

var lat = 25.2646373;
var lng = 55.312168;
var makani = MakaniNumber.fromCoord(lat,lng);

if( makani.isValid() ) {
  console.log(makani.makaniNo());
}


```

#### Dependency
all api link are provided by the Dubai Government.
this release works as long as their api work.
here is the link from where the api is taken.
https://www.dm.gov.ae/wps/wcm/connect/b1c96c7e-98d3-447a-b4b4-6c84f15e027a/Makani+Public+Web+Service+Access.pdf?MOD=AJPERES
