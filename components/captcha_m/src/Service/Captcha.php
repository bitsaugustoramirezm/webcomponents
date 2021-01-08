<?php

namespace webcomponents\captcha;

/**
 * Class Captcha.
 */
class Captcha {

  /**
   * Render.
   *
   * @param string $id_form
   *   Id del formulario que contiene el captcha.
   * @param string $options
   *   Opciones y configuraciones.
   *
   * @return array
   *   Rendered captcha.
   */
  public function render($id_form, $options = []) {
    return $this->generateCaptchaImage($id_form);
  }

  /**
   * Validate.
   *
   * @param string $captcha_value
   *   User input.
   * @param string $id_form
   *   Id del formulario que contiene el captcha.
   *
   * @return bool
   *   TRUE for valid captcha.
   */
  public function validate($captcha_value, $id_form) {
    if (isset($_SESSION['selfcare_captcha'][$id_form]) && $captcha_value == $_SESSION['selfcare_captcha'][$id_form]) {
      unset($_SESSION['selfcare_captcha'][$id_form]);
      return TRUE;
    }
    return FALSE;
  }

  /**
   * Generate Captcha Image.
   *
   * @param string $id_form
   *   Id del formulario que contiene el captcha.
   *
   * @return array
   *   Image.
   */
  public function generateCaptchaImage($id_form) {
    // Adapted for The Art of Web: www.the-art-of-web.com
    // Please acknowledge use of this code by including this header.
    // Initialise image with dimensions of 120 x 30 pixels.
    $image = @imagecreatetruecolor(120, 30) or die("Cannot Initialize new GD image stream");

    // Set background to white and allocate drawing colours.
    $background = imagecolorallocate($image, 0xFF, 0xFF, 0xFF);
    imagefill($image, 0, 0, $background);
    $linecolor = imagecolorallocate($image, 0xCC, 0xCC, 0xCC);
    $textcolor = imagecolorallocate($image, 0x33, 0x33, 0x33);

    // Draw random lines on canvas.
    for ($i = 0; $i < 6; $i++) {
      imagesetthickness($image, rand(1, 3));
      imageline($image, 0, rand(0, 30), 120, rand(0, 30), $linecolor);
    }

    // Add random digits to canvas.
    $digit = '';
    for ($x = 15; $x <= 95; $x += 20) {
      $digit .= ($num = rand(0, 9));
      imagechar($image, rand(3, 5), $x, rand(2, 14), $num, $textcolor);
    }

    // Record digits in session variable.
    $_SESSION['selfcare_captcha'] = [
      $id_form => $digit,
    ];

    // Display image and clean up.
    //header('Content-type: image/png');
    ob_start();
    imagepng($image);
    imagedestroy($image);
    return 'data:image/png;base64,' . base64_encode(ob_get_clean());
  }

}
