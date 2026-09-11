/* ==============================
   VARIABLES
============================== */

let cart = JSON.parse(
  sessionStorage.getItem("cart") || "[]"
);

let currentOrder = null;

document.addEventListener("DOMContentLoaded", () => {

    restoreFormData();

    const formFields = [
        "name",
        "phone",
        "email",
        "address",
        "notes",
        "allergies",
    ];

    formFields.forEach((id) => {
        const field = document.getElementById(id);

        if (field) {
            field.addEventListener("input", saveFormData);
        }
    });

    document
        .querySelectorAll('input[name="payment"]')
        .forEach((radio) => {
            radio.addEventListener("change", saveFormData);
        });

});

/* ==============================
   CONFIGURACIÓN EMAILJS
============================== */

const EMAILJS_PUBLIC_KEY = "hLHAMKR9VSHDNQbVY";

const EMAILJS_CLIENT_TEMPLATE_ID = "template_slpnl7k";

const EMAILJS_SHOP_TEMPLATE_ID = "template_7iu3j4a";

const EMAILJS_SERVICE_ID = "service_9553bkw";

const SHOP_EMAIL = "rredbowbakery@gmail.com";

const LOGO_URL =
  "https://17e0-31-4-238-178.ngrok-free.app/redbow.png";

let emailjsReady = false;


/* ==============================
   INICIALIZAR EMAILJS
============================== */

if (window.emailjs) {
  try {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });

    emailjsReady = true;
  } catch (e) {
    console.error(
      "EmailJS no se pudo inicializar:",
      e
    );
  }
}



/* ==============================
   AÑADIR PRODUCTO
============================== */

function add(name, price, qty = 1, details = {}) {

  qty = Number(qty);

  if (
    !qty ||
    qty < 1 ||
    !Number.isInteger(qty)
  ) {
    alert(
      "La cantidad debe ser un número entero mayor que 0."
    );

    return;
  }

  const detailsKey =
    JSON.stringify(details || {});

  const item = cart.find(
    (x) =>
      x.name === name &&
      JSON.stringify(x.details || {}) === detailsKey
  );

  if (item) {

    item.qty += qty;

  } else {

    cart.push({
      name: name,
      price: Number(price),
      qty: qty,
      details: details || {},
    });
  }

  /*
    MUY IMPORTANTE:
    Guardamos el carrito después
    de modificarlo.
  */

  saveCart();

  render();
}

/* ==============================
   AÑADIR PRODUCTO NORMAL
============================== */

function addProduct(
  name,
  price,
  quantityId
) {

  const quantityInput =
    document.getElementById(quantityId);


  if (!quantityInput) {

    console.error(
      "No existe el input de cantidad:",
      quantityId
    );

    return;
  }


  const quantity =
    Number(quantityInput.value);


  if (
    !quantityInput.value ||
    quantity < 1 ||
    !Number.isInteger(quantity)
  ) {

    quantityInput.focus();

    if (quantityInput.reportValidity) {
      quantityInput.reportValidity();
    }

    return;
  }


  /*
    Ahora sí enviamos la cantidad
    que ha introducido el usuario.
  */

  add(
    name,
    Number(price),
    quantity
  );
}


/* ==============================
   CUPCAKE
============================== */

function addCupcake() {

    const flavor =
        document.getElementById("flavor-cupcake");

    const sponge =
        document.getElementById("sponge-cupcake");

    const quantity =
        document.getElementById("quantity-cupcake");


    /*
      Precio del cupcake
    */

    const price = 25;


    /*
      Comprobar sabor
    */

    if (!flavor.value.trim()) {

        flavor.focus();
        flavor.reportValidity();

        return;
    }


    /*
      Comprobar bizcocho
    */

    if (!sponge.value) {

        sponge.focus();
        sponge.reportValidity();

        return;
    }


    /*
      Comprobar cantidad
    */

    const qty =
        Number(quantity.value);

    if (
        !quantity.value ||
        qty < 1 ||
        !Number.isInteger(qty)
    ) {

        quantity.focus();
        quantity.reportValidity();

        return;
    }


    /*
      Nombre del producto
    */

    const productName =
        "Cupcake Tradicional";


    /*
      Añadir al carrito
    */

    add(
        productName,
        price,
        qty,
        {
            sabor: flavor.value.trim(),

            bizcocho:
                sponge.options[
                    sponge.selectedIndex
                ].text
        }
    );
}

/* ==============================
  CHEESECAKE
============================== */

function addMiniCheesecake() {
    const flavor = document.getElementById("flavor-mini-cheesecake");
    const quantity = document.getElementById("quantity-cheesecake");

    const price = 5;

    if (!flavor.value.trim()) {
        flavor.focus();
        flavor.reportValidity();
        return;
    }

    const qty = Number(quantity.value);

    if (
        !quantity.value ||
        qty < 1 ||
        !Number.isInteger(qty)
    ) {
        quantity.focus();
        quantity.reportValidity();
        return;
    }

    add(
        "Mini Cheesecake",
        price,
        qty,
        {
            sabor: flavor.value.trim()
        }
    );
}


function addCheesecakeCompartir() {
    const flavor =
        document.getElementById("flavor-cheesecake-compartir");

    const quantity =
        document.getElementById(
            "quantity_cheesecake-para-compartir"
        );

    const price = 15;

    if (!flavor.value.trim()) {
        flavor.focus();
        flavor.reportValidity();
        return;
    }

    const qty = Number(quantity.value);

    if (
        !quantity.value ||
        qty < 1 ||
        !Number.isInteger(qty)
    ) {
        quantity.focus();
        quantity.reportValidity();
        return;
    }

    add(
        "Cheesecake Tradicional",
        price,
        qty,
        {
            sabor: flavor.value.trim()
        }
    );
}

/* ==============================
   ELIMINAR PRODUCTO
============================== */
function removeItem(i) {

  cart.splice(i, 1);

  saveCart();
  render();
}


/* ==============================
   MOSTRAR DETALLES
============================== */

function buildDetailsHtml(details) {

  if (
    !details ||
    !Object.keys(details).length
  ) {
    return "";
  }


  let html = `
    <ul
      class="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600"
    >
  `;


  /*
    SABOR
  */

  if (details.sabor) {

    html += `
      <li>
        <strong>Sabor:</strong>
        ${escapeHtml(details.sabor)}
      </li>
    `;
  }


  /*
    BIZCOCHO
  */

  if (details.bizcocho) {

    html += `
      <li>
        <strong>Bizcocho:</strong>
        ${escapeHtml(details.bizcocho)}
      </li>
    `;
  }


  /*
    Por si en el futuro añades
    otros campos.
  */

  Object.keys(details).forEach(
    (key) => {

      if (
        key !== "sabor" &&
        key !== "bizcocho" &&
        details[key]
      ) {

        html += `
          <li>
            <strong>
              ${escapeHtml(key)}:
            </strong>
            ${escapeHtml(details[key])}
          </li>
        `;
      }
    }
  );


  html += "</ul>";

  return html;
}

function escapeHtml(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ==============================
   MOSTRAR CARRITO
============================== */

function render() {

  const box =
    document.getElementById("cart");


  if (!box) {
    return;
  }


  /*
    Carrito vacío
  */

  if (!cart.length) {

    box.innerHTML = `
      <div class="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
        Todavía no has añadido ningún producto.
      </div>
    `;


    const totalElement =
      document.getElementById("total");


    if (totalElement) {
      totalElement.textContent =
        "0,00 €";
    }


    return;
  }


  let total = 0;


  /*
    Generar productos
  */

  box.innerHTML = cart
    .map((x, i) => {

      /*
        Subtotal:

        cantidad × precio

        Ejemplo:

        5 × 25 = 125
      */

      const subtotal =
        x.price * x.qty;


      total += subtotal;


      /*
        Detalles adicionales
      */

      const detailsHtml =
        buildDetailsHtml(
          x.details
        );


      return `
        <div
          class="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >

          <div
            class="flex items-start justify-between gap-4"
          >

            <div class="min-w-0">

              <b
                class="block text-base text-gray-900"
              >
                ${escapeHtml(x.name)}
              </b>


              <small
                class="mt-1 block text-gray-500"
              >
                ${x.qty} ×
                ${x.price
                  .toFixed(2)
                  .replace(".", ",")
                } €
              </small>


              ${detailsHtml}

            </div>


            <div
              class="shrink-0 text-right"
            >

              <b
                class="block text-base text-gray-900"
              >
                ${subtotal
                  .toFixed(2)
                  .replace(".", ",")
                } €
              </b>


              <button
                type="button"
                class="mt-2 text-sm text-red-600 transition hover:text-red-800"
                onclick="removeItem(${i})"
                aria-label="Eliminar producto"
              >
                🗑️ Eliminar
              </button>

            </div>

          </div>

        </div>
      `;
    })
    .join("");


  /*
    Mostrar total
  */

  const totalElement =
    document.getElementById("total");


  if (totalElement) {

    totalElement.textContent =
      total
        .toFixed(2)
        .replace(".", ",") +
      " €";
  }
}


/* ==============================
   OBTENER DATOS DEL PEDIDO
============================== */


function getOrderData() {

  /*
    Comprobar carrito
  */

  if (!cart.length) {

    alert(
      "Añade al menos un producto al pedido."
    );

    return null;
  }


  /*
    Datos del cliente
  */

  const name =
    document
      .getElementById("name")
      .value
      .trim();


  const phone =
    document
      .getElementById("phone")
      .value
      .trim();


  const email =
    document
      .getElementById("email")
      .value
      .trim();


  const address =
    document
      .getElementById("address")
      .value
      .trim();


  /*
    Nombre y teléfono
  */

  if (!name || !phone) {

    alert(
      "Por favor, indica tu nombre y teléfono."
    );

    return null;
  }


  /*
    Email
  */

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (
    !email ||
    !emailRegex.test(email)
  ) {

    alert(
      "Indica un email válido para poder enviarte la copia del pedido."
    );

    return null;
  }


  /*
    Dirección
  */

  if (!address) {

    alert(
      "Por favor, indica la dirección del pedido."
    );

    return null;
  }


  /*
    Método de pago
  */

  const paymentInput =
    document.querySelector(
      'input[name="payment"]:checked'
    );


  const payment =
    paymentInput
      ? paymentInput.value
      : "No especificado";


  /*
    Notas
  */

  const notes =
    document
      .getElementById("notes")
      .value
      .trim();


  /*
    Alergias e intolerancias
  */

  const allergies =
    document
      .getElementById("allergies")
      .value
      .trim();


  /*
    Calcular total

    IMPORTANTE:

    precio × cantidad
  */

  const total =
    cart.reduce(
      (s, x) =>
        s +
        Number(x.price) *
        Number(x.qty),
      0
    );


  /* ==========================
     GOOGLE MAPS
  ========================== */

  const addressLink =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address);


  /*
    Devolver datos
  */

  return {

    name,

    phone,

    email,

    address,

    addressLink,

    payment,

    notes,

    allergies,

    total,
  };
}



/* ==============================
   IR A REVISIÓN
============================== */

function goToReview() {

    saveFormData();

    const data = getOrderData();

    if (!data) {
        return;
    }

    const now = new Date();

    const orderNumber =
        "PED-" +
        now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        String(Date.now()).slice(-5);

    currentOrder = {
        ...data,

        items: cart.map((x) => ({
            ...x,
            details: {
                ...(x.details || {}),
            },
        })),

        orderNumber,
    };

    sessionStorage.setItem(
        "currentOrder",
        JSON.stringify(currentOrder)
    );

    window.location.href = "revision.html";
}


/* ==============================
   VOLVER A LA TIENDA
============================== */

function backToShop() {

  document
    .getElementById("reviewPage")
    .classList
    .remove("active");


  document
    .getElementById("shopPage")
    .classList
    .add("active");


  window.scrollTo({

    top: 0,

    behavior: "smooth",

  });
}


/* ==============================
   ESPERAR
============================== */

function wait(ms) {

  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        ms
      )
  );
}


/* ==============================
   CREAR HTML DE PRODUCTOS
   PARA EMAILJS
============================== */

function buildOrderItemsHtml() {

  const o =
    currentOrder;


  return o.items

    .map((x, index) => {

      /*
        Subtotal
      */

      const subtotal =
        x.price * x.qty;


      /*
        Detalles
      */

      let detailsHtml =
        "";


      if (
        x.details &&
        Object.keys(x.details).length
      ) {

        detailsHtml = `
          <ul
            style="
              margin:8px 0 0 18px;
              padding:0;
              color:#666;
              font-size:13px;
            "
          >

            ${
              x.details.sabor
                ? `
                  <li
                    style="margin-bottom:4px;"
                  >
                    <strong>Sabor:</strong>
                    ${escapeHtml(
                      x.details.sabor
                    )}
                  </li>
                `
                : ""
            }


            ${
              x.details.bizcocho
                ? `
                  <li>
                    <strong>Bizcocho:</strong>
                    ${escapeHtml(
                      x.details.bizcocho
                    )}
                  </li>
                `
                : ""
            }

          </ul>
        `;
      }


      return `

        <tr>

          <!-- NÚMERO -->

          <td
            style="
              padding:13px 8px 13px 12px;
              border-bottom:1px solid #eee6e8;
              font-size:14px;
              font-weight:700;
              color:#b4234d;
              vertical-align:top;
              width:35px;
            "
          >
            ${index + 1}.
          </td>


          <!-- PRODUCTO -->

          <td
            style="
              padding:13px 8px;
              border-bottom:1px solid #eee6e8;
              font-size:14px;
              color:#3d3336;
              vertical-align:top;
            "
          >

            <strong>
              ${x.qty} ×
              ${escapeHtml(x.name)}
            </strong>


            <div
              style="
                margin-top:4px;
                color:#777;
                font-size:12px;
              "
            >

              Precio unidad:

              ${x.price
                .toFixed(2)
                .replace(".", ",")
              } €

            </div>


            ${detailsHtml}

          </td>


          <!-- SUBTOTAL -->

          <td
            align="right"
            style="
              padding:13px 12px 13px 8px;
              border-bottom:1px solid #eee6e8;
              font-size:14px;
              font-weight:700;
              color:#3d3336;
              vertical-align:top;
              white-space:nowrap;
            "
          >

            ${subtotal
              .toFixed(2)
              .replace(".", ",")
            } €

          </td>

        </tr>

      `;

    })

    .join("");
}

/* ==============================
  GUARDAR DATOS
============================== */

function saveFormData() {

    const data = {
        name: document.getElementById("name")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        email: document.getElementById("email")?.value || "",
        address: document.getElementById("address")?.value || "",
        notes: document.getElementById("notes")?.value || "",
        allergies: document.getElementById("allergies")?.value || "",
        payment:
            document.querySelector('input[name="payment"]:checked')?.value ||
            "Efectivo",
    };

    sessionStorage.setItem(
        "formData",
        JSON.stringify(data)
    );
}

function restoreFormData() {
    const savedData =
        sessionStorage.getItem("formData");

    if (!savedData) {
        return;
    }

    const data =
        JSON.parse(savedData);

    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const notes = document.getElementById("notes");
    const allergies = document.getElementById("allergies");

    if (name) {
        name.value = data.name || "";
    }

    if (phone) {
        phone.value = data.phone || "";
    }

    if (email) {
        email.value = data.email || "";
    }

    if (address) {
        address.value = data.address || "";
    }

    if (notes) {
        notes.value = data.notes || "";
    }

    if (allergies) {
        allergies.value = data.allergies || "";
    }

    if (data.payment) {
        const payment =
            document.querySelector(
                `input[name="payment"][value="${data.payment}"]`
            );

        if (payment) {
            payment.checked = true;
        }
    }
}



/* ==============================
   CONFIRMAR Y ENVIAR
============================== */

async function confirmAndSend() {

  if (!currentOrder) {

    alert(
      "No hay pedido para confirmar."
    );

    return;
  }


  const button =
    document.querySelector(
      ".final"
    );


  const finalMessage =
    document.getElementById(
      "finalMessage"
    );


  /*
    Desactivar botón
  */

  if (button) {

    button.disabled = true;

    button.textContent =
      "⏳ Enviando pedido...";
  }


  if (finalMessage) {

    finalMessage.style.display =
      "block";

    finalMessage.innerHTML =
      "📧 Enviando confirmación del pedido...";
  }


  try {

    /* ==========================
       COMPROBAR CONFIGURACIÓN
    ========================== */

    const missing = [];


    if (
      EMAILJS_PUBLIC_KEY ===
      "TU_PUBLIC_KEY"
    ) {

      missing.push(
        "Public Key"
      );
    }


    if (
      EMAILJS_SERVICE_ID ===
      "TU_SERVICE_ID"
    ) {

      missing.push(
        "Service ID"
      );
    }


    if (
      !EMAILJS_CLIENT_TEMPLATE_ID
    ) {

      missing.push(
        "Template ID del cliente"
      );
    }


    if (
      !EMAILJS_SHOP_TEMPLATE_ID
    ) {

      missing.push(
        "Template ID de la pastelería"
      );
    }


    if (!SHOP_EMAIL) {

      missing.push(
        "correo de la pastelería"
      );
    }


    if (missing.length) {

      throw new Error(
        "Falta configurar: " +
        missing.join(", ")
      );
    }


    if (!emailjsReady) {

      throw new Error(
        "EmailJS no está disponible. Comprueba tu conexión a Internet y que la librería de EmailJS haya cargado."
      );
    }


    /* ==========================
       EMAIL AL CLIENTE
    ========================== */

    if (finalMessage) {

      finalMessage.innerHTML =
        "📧 Enviando confirmación al cliente...";
    }


    await sendOrderEmail(

      currentOrder.email,

      currentOrder.name,

      EMAILJS_CLIENT_TEMPLATE_ID

    );


    /* ==========================
       ESPERAR ENTRE EMAILS
    ========================== */

    await wait(1200);


    /* ==========================
       EMAIL A LA PASTELERÍA
    ========================== */

    if (finalMessage) {

      finalMessage.innerHTML =
        "📧 Enviando copia a la pastelería...";
    }


    await sendOrderEmail(

      SHOP_EMAIL,

      "Dulce Encanto",

      EMAILJS_SHOP_TEMPLATE_ID

    );


    /* ==========================
       TODO CORRECTO
    ========================== */

    if (finalMessage) {

      finalMessage.innerHTML =
        "✅ Pedido enviado correctamente. " +
        "El cliente ha recibido su confirmación " +
        "y la pastelería ha recibido una copia.";
    }


    await wait(800);


    /*
      Ir a página de confirmación
    */

    window.location.href =
      "confirmado.html?pedido=" +
      encodeURIComponent(
        currentOrder.orderNumber
      );


  } catch (error) {

    console.error(
      "Error completo al enviar el pedido:",
      error
    );


    const detail =
      error?.text ||
      error?.message ||
      "Error desconocido";


    if (finalMessage) {

      finalMessage.innerHTML =

        "<b>⚠️ No se ha podido enviar el pedido.</b>" +

        "<br><br>" +

        "Motivo: <b>" +

        escapeHtml(detail) +

        "</b>" +

        "<br><br>" +

        "Revisa la configuración de EmailJS, " +

        "los Template ID y las variables de la plantilla.";
    }


    /*
      Reactivar botón
    */

    if (button) {

      button.disabled = false;

      button.textContent =
        "✅ Confirmar pedido";
    }
  }
}


/* ==============================
   SEGURIDAD HTML
============================== */

function escapeHtml(text) {

  return String(text)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}

/* ==============================
   GUARDAR CARRITO
============================== */

function saveCart() {

  sessionStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
}


/* ==============================
   INICIAR CARRITO
============================== */

saveCart();
render();