const captchaEvent = new CustomEvent('captcha', { detail: {validity: false}, bubbles: true });
const captchaKeyDownEvent = new CustomEvent('captchaKeyDown', {bubbles: true });

class bitsCaptcha extends HTMLElement {

  constructor() {
    super();
    this.path = "/components/captcha/";
  }

  static get observedAttributes() {
    return ['data-form-reset'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'data-form-reset' && this.shadowRoot != null) {
      this.shadowRoot.querySelector('#bits_captcha').classList.remove("error");
    }
  }

  async connectedCallback() {
    const formId = this.getAttribute('data-form-id');

    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = '<div>Cargando...</div>';

    this.loadImage(shadowRoot, formId);

    let res = await fetch(this.path + 'captcha.html');
    shadowRoot.innerHTML = await res.text();

    this.shadowRoot.querySelector('.update').addEventListener('click', (function () {
      this.loadImage(shadowRoot,formId);
    }).bind(this));

    document.getElementById(formId).addEventListener("submit", (function (e) {
      e.preventDefault();
      var code = shadowRoot.querySelector('.code').value;
      this.validate(code, formId);
      return false;
    }).bind(this));

    this.shadowRoot.querySelector('.code').addEventListener('keydown', (function () {
      this.shadowRoot.querySelector('#bits_captcha').classList.remove("error");
      this.dispatchEvent(captchaKeyDownEvent);
    }).bind(this));

  }

  loadImage(shadowRoot, formId) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var imageCaptcha = JSON.parse(this.responseText).captcha_image;
        shadowRoot.querySelector('.image-captcha').setAttribute('src', imageCaptcha);
      }
    };
    xmlhttp.open("POST", this.path + "captcha.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("op=get&formId="+formId);
  }

  validate(code, formId) {
    var xmlhttp = new XMLHttpRequest();
    var element = this;
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var captchaValidity = JSON.parse(this.responseText).captcha_validity;
        captchaEvent.detail.validity = captchaValidity;
        element.dispatchEvent(captchaEvent);
        if (captchaValidity === false) {
          element.shadowRoot.querySelector('#bits_captcha').classList.add("error");
        }
      }
    };
    xmlhttp.open("POST", this.path + "captcha.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("op=validate&formId="+formId+"&code="+code);
  }

}

window.customElements.define('bits-captcha', bitsCaptcha);
