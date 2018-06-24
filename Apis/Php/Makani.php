
<?php
/**
 * User: SD
 * Date: 6/24/2018
 * Time: 9:51 PM
 */
class Coordinates 
{
    public $lng,$lat;
    public function __construct($lng=null,$lat=null)
    {
        $this->lat = $lat;
        $this->lng = $lng;
    }
}

class Makani
{
    protected static $baseUrl = "https://www.makani.ae/MakaniPublicDataService/MakaniPublic.svc/";
    protected static $detailsLink = "GetMakaniDetails";
    protected static $isValidLink = "IsValidMakani";
    protected static $fromCoordLink = "GetMakaniInfoFromCoord";

    public $makano_no;
    protected $fetched;
    protected $data;
    protected $validityData;
    protected $valid;

    public function __construct($no)
    {
        $this->makano_no = $no;
        $this->fetched = false;
        $this->valid = false;
        $this->fetch();
    }

    protected static function fetchUrl($url,$params)
    {
        $url = $url . '?' .http_build_query($params);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_URL, $url );
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = json_decode(curl_exec($ch));
        curl_close($ch);
        return $output;
    }

    protected function fetch()
    {
        if($this->fetched) return true;
        $url = Makani::$baseUrl . Makani::$isValidLink  ;
        $this->validityData = Makani::fetchUrl($url,array( 'makanino' => $this->makano_no) );
        $this->validityData = json_decode($this->validityData);
        $url = Makani::$baseUrl . Makani::$detailsLink  ;
        $this->data = Makani::fetchUrl($url,array( 'makanino' => $this->makano_no) );
        $this->data = json_decode($this->data);
        $this->fetched = true;
        if($this->validityData && $this->data)
        {
            $this->valid =  array_key_exists('IS_VALID',$this->validityData) 
            && array_key_exists('MAKANI_INFO',$this->data) ? true : false ;
        }
        return true;
    }

    public function isValid()
    {
        return $this->valid;
    }

    public function getAddress()
    {
        if(!$this->isValid()) return null;
        $t = $this->data->MAKANI_INFO[0];
        $address =  $t->BLDG_NAME_E . " " . $t->COMMUNITY_E . " " . $t->EMIRATE_E;
        return $address;
    }

    public function getLatlng()
    {
        $obj = new Coordinates();
        if($this->isValid())
        {
            $ll = '['.$this->data->MAKANI_INFO[0]->LATLNG.']';
            $ll = json_decode($ll);
            $obj->lat = $ll[0];
            $obj->lng = $ll[1];
        }
        return $obj;
    }


    public function toJson()
    {
        return [
            'valid' => $this->isValid(),
            'makani_no' => $this->makano_no,
            'address' => $this->getAddress(),
            'lat' => $this->getLatlng()->lat,
            'lng' => $this->getLatlng()->lng
        ];
    }

    public function toString()
    {
        return json_encode($this->toJson(),JSON_PRETTY_PRINT);
    }

    public static function Query($makani_no)
    {
        return new Makani($makani_no);
    }

    protected static function fromCoords($lat,$lng)
    {
        $url = Makani::$baseUrl . Makani::$fromCoordLink;
        $res = Makani::fetchUrl($url,['latitude' => $lat , 'longitude' => $lng ] );
        $res = json_decode($res);
        if(array_key_exists('MAKANI_INFO',$res) )
        {
            $makani_no = $res->MAKANI_INFO[0]->MAKANI;
            return Makani::Query($makani_no);
        }
        return null;
    }


}


echo Makani::Query("30245 95127")->toString();