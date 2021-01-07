<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

use webcomponents\captcha\Captcha;

require 'src/Service/Captcha.php';

session_start();

$flagError = FALSE;

$captcha = new Captcha();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['op']) && isset($_POST['formId'])) {

  $formId = $_POST['formId'];

  if ($_POST['op'] == 'get') {
    http_response_code(200);
    echo json_encode([
      'captcha_image' => $captcha->render($formId),
      'formId' => $formId,
    ]);
  }
  elseif (isset($_POST['code']) && $_POST['op'] == 'validate') {
    $code = $_POST['code'];
    http_response_code(200);
    echo json_encode([
      'captcha_validity' => $captcha->validate($code, $formId),
      'debug' => $_SESSION,
    ]);
  }
  else {
    $flagError = TRUE;
  }

}
else {
  $flagError = TRUE;
}

if ($flagError) {
  echo json_encode($_POST);
  http_response_code(500);
}
