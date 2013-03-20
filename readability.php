<?php

header("Content-type: text/javascript");

//optionally load jQuery from a local source

$jq = file_get_contents('jquery-1.9.1.min.js');
echo $jq;


$code = file_get_contents('code.js');
echo $code;

?>