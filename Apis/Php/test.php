
<?php

require_once 'Makani.php';

$lat = 25.2646373;
$lng = 55.312168;
$data = Makani::fromCoords($lat,$lng)->toString();

echo $data;
