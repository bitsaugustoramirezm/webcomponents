Web Components
===
Demo root file:  /demo1/index.html

Características:

-	Padre puede enviar mensaje dinámicamente al captcha, para solicitar que resetee el estilo de error. 
-  (el captcha se ajusta a si mismo un estilo cuando se ingresa codigo erroneo)
-	Padre ajusta el id del captcha, que debe ser igual al id del formulario al que se asigna.
-	Captcha envía evento captcha cuando hace validación, en detail.validity se consulta estado de la validación. El padre usa esto para setear mensaje de error.
-	Captcha envía evento captchaKeyDown cuando usuario va ingresando código. El padre puede usar esto para resetear mensajes de error.

El formulario de prueba es sólo un dummy.
