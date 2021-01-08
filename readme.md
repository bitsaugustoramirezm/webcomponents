Web Component Captcha
===

Uso
==
1. Agregue el script del componente en el header de su aplicación. De acuerdo a la ubicación de los componentes en su instalación.

    `<script src="/components/captcha_m/captcha.js"></script>`


2. Use el componente en su HTML. Este componente debe ir ubicado dentro de un elemento `<form>`.

  `<bits-captcha data-form-id="login" data-form-reset=false class="field">
  </bits-captcha>`


El componente tiene los siguientes atributos obligatorios.
- *data-form-id* para indicar el id del formulario padre.
- *data-form-reset* se puede ajustar dinámicamente en true, para resetear el estilo de error del componente.

Demo root files
- /demo1/index.html   Archivos js, html y css separados
- /demo2/index.html   Archivos js, html y css juntos
- /demo3/index.html   Versión full javascript

Nota 1: El formulario de prueba es sólo un dummy.
Nota 2: Las dos primeras versiones consumen una clase php en el backedn para generar y validar el captcha, la tercera versión funciona completamente en javascriot sin usar php.

Características:

-	Padre puede enviar mensaje dinámicamente al captcha, para solicitar que resetee el estilo de error.
-  (el captcha se ajusta a si mismo un estilo cuando se ingresa codigo erroneo)
-	Padre ajusta el id del captcha, que debe ser igual al id del formulario al que se asigna.
-	Captcha envía evento captcha cuando hace validación, en detail.validity se consulta estado de la validación. El padre usa esto para setear mensaje de error.
-	Captcha envía evento captchaKeyDown cuando usuario va ingresando código. El padre puede usar esto para resetear mensajes de error.
