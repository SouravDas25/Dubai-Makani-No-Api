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


#### Get Makani No From Lat-Lng

```Javascript

var lat = 25.2646373;
var lng = 55.312168;
var makani = MakaniNumber.fromCoord( {
    lat : lat,
    lng : lng,
    success : function (data) {
        if (data !== null && data.isValid() ) {
            var makani_no = makani.makaniNo();
            //your code...
        }
    },
    fail: function(e) {
        //do something..
    }
  }
);
```
