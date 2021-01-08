const template = document.createElement('template');
template.innerHTML = `
    <style>

      #bits_captcha {
        border: 1px solid #e1e1e1;
        margin: 10px;
        padding: 10px;
        width: fit-content;
      }

      .update_image {
        width: 20px;
      }

      input {
        width: 120px;
        height: 30px;
        font-size: 20px;
      }

      #bits_captcha.error {
        border: 1px solid tomato;
      }

    </style>

    <section id="bits_captcha">
      <figure>
        <img class="image-captcha" src="">
        <a class="update">
          <img class="update_image" src="http://test.loc/components/captcha/assets/images/update.png" alt="update">
          <span>CAMBIAR</span>
        </a>
      </figure>
      <label>
        Introduzca el código.
        <i class="ic-alerta-bg-fill"></i>
        <input type="text" class="code" name="code" id="code" required="required" placeholder="00000" maxlength="5">
        <small class="errorCaptcha"></small>
      </label>
    </section>
`;

class bitsCaptcha extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.formId;
    // Path para consumir el servicio PHP.
    this.path = "/components/captcha/";
  }

  // Atributos para recibir mensajes dinamicamente del padre.
  static get observedAttributes() {
    return ['data-form-reset'];
  }

  // Responder a mensajes del padre.
  attributeChangedCallback(name, oldValue, newValue) {
    var captcha = this.shadowRoot.querySelector('#bits_captcha');
    if (name == 'data-form-reset' && captcha != null) {
      captcha.classList.remove("error");
    }
  }

  async connectedCallback() {
    this.formId = this.getAttribute('data-form-id');
    // Obtención de la imágen para el captcha en el backend.
    this.loadImage();
    // Listeners.
    document.getElementById(this.formId).addEventListener("submit", this);
    this.shadowRoot.querySelector('.update').addEventListener('click', this);
    this.shadowRoot.querySelector('.code').addEventListener('keydown', this);
  }

  // Handler para eventos escuchados.
  handleEvent(event) {
    if (event.type === "submit") {
      event.preventDefault();
      // Evento custom captcha.
      const captchaEvent = new CustomEvent('captcha', {
        detail: { validity: false },
        bubbles: true,
        composed: true,
      });
      var code = this.shadowRoot.querySelector('.code').value;
      this.validate(code, captchaEvent);
      return false;
    }
    if (event.type === "keydown") {
      // Evento custom captchaKeyDown.
      const captchaKeyDownEvent = new CustomEvent('captchaKeyDown', {
        bubbles: true,
        composed: true,
      });
      this.shadowRoot.querySelector('#bits_captcha').classList.remove("error");
      this.dispatchEvent(captchaKeyDownEvent);
    }
    if (event.type === "click") {
      this.loadImage();
    }
  }

  // Valída código introducido por usuario en backend.
  // Lanza evento captcha.
  validate(code, captchaEvent) {
    var url = this.path + "captcha.php";
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "op=validate&formId=" + this.formId + "&code=" + code
    })
      .then(res => res.json())
      .then(res => {
        var captchaValidity = res.captcha_validity;
        captchaEvent.detail.validity = captchaValidity;
        this.dispatchEvent(captchaEvent);
        if (captchaValidity === false) {
          this.shadowRoot.querySelector('#bits_captcha').classList.add("error");
        }
      })
      .catch(function (e) {
        console.log("Fetch captcha.php error.");
      });
  }

  // Obtiene el valor para el atributo src de la imagen captcha.
  // Generado en backend.
  loadImage() {
    var url = this.path + "captcha.php";
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "op=get&formId=" + this.formId
    })
      .then(res => res.json())
      .then(res => {
        var imageCaptcha = res.captcha_image;
        this.shadowRoot.querySelector('.image-captcha').setAttribute('src', imageCaptcha);
      })
      .catch(function (e) {
        console.log("Fetch captcha.php error.");
      });
  }

}

// Definición de elemento custom.
window.customElements.define('bits-captcha', bitsCaptcha);
