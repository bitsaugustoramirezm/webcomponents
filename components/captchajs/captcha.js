const template = document.createElement('template');
template.innerHTML = `
    <style>
      #bits_captcha {
        border: 1px solid #e1e1e1;
        margin: 10px;
        padding: 10px;
        width: fit-content;
      }
      #bits_captcha.error {
        border: 1px solid tomato;
      }
      #captcha {
        display: inline-block;
      }
      input[type=text] {
          padding: 12px 20px;
          display: block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
      }
      .update {
        display: inline;
        font-size: 10px;
        color: #444;
        vertical-align: top;
        cursor: pointer;
      }
      canvas{
        pointer-events:none;
      }
    </style>

    <section id="bits_captcha">
      <div id="captcha">
      </div>
      <div class="update">Recargar</div>
      <input type="text" placeholder="Ingresa el código" id="cpatchaTextBox" class="code"/>
    </section>
`;

class bitsCaptcha extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.formId;
    this.code;
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
    this.createCaptcha();
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
      // Valída código introducido por usuario.
      if (this.shadowRoot.querySelector('.code').value == this.code) {
        captchaEvent.detail.validity = true;
      }
      else {
        captchaEvent.detail.validity = false;
        this.shadowRoot.querySelector('#bits_captcha').classList.add("error");
      }
      // Lanza evento captcha.
      this.dispatchEvent(captchaEvent);
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
      this.createCaptcha();
    }
  }

  // Crear captcha.
  // Tomado de: https://codepen.io/manishjanky/pen/eRNKLL
  createCaptcha() {
    this.shadowRoot.getElementById('captcha').innerHTML = "";
    var charsArray =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 100;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "25px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    this.code = captcha.join("");
    this.shadowRoot.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
  }

}

// Definición de elemento custom.
window.customElements.define('bits-captcha', bitsCaptcha);
