const currentOrder =
    JSON.parse(
        sessionStorage.getItem("currentOrder")
    );

if (!currentOrder) {
    window.location.href = "index.html";
}

/* ==============================
   CONFIGURACIÓN EMAILJS
============================== */

const EMAILJS_PUBLIC_KEY =
    "hLHAMKR9VSHDNQbVY";

const EMAILJS_CLIENT_TEMPLATE_ID =
    "template_slpnl7k";

const EMAILJS_SHOP_TEMPLATE_ID =
    "template_7iu3j4a";

const EMAILJS_SERVICE_ID =
    "service_9553bkw";

const SHOP_EMAIL =
    "rredbowbakery@gmail.com";


/* ==============================
   INICIAR EMAILJS
============================== */

emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



function buildDetailsHtml(details) {

    if (
        !details ||
        !Object.keys(details).length
    ) {
        return "";
    }


    let html = `
        <ul class="mt-2 list-disc pl-5 text-sm text-gray-600">
    `;


    /*
      Sabor
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
      Bizcocho
    */

    if (details.bizcocho) {

        html += `
            <li>
                <strong>Bizcocho:</strong>
                ${escapeHtml(details.bizcocho)}
            </li>
        `;
    }


    html += `
        </ul>
    `;


    return html;
}

async function confirmAndSend() {

    const requiredAcceptances = [
        "acceptDelivery",
        "acceptCancellation",
        "acceptPayment",
        "acceptAllergies",
        "acceptNoPickup",
    ];


    /* ==============================
       COMPROBAR ACEPTACIONES
    ============================== */

    for (const id of requiredAcceptances) {

        const checkbox =
            document.getElementById(id);

        if (!checkbox || !checkbox.checked) {

            alert(
                "⚠️ Antes de confirmar el pedido debes leer y aceptar los cinco apartados de «Leer antes de confirmar»."
            );

            checkbox?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            checkbox?.focus();

            return;
        }
    }


    /* ==============================
       BOTÓN
    ============================== */

const button =
    document.getElementById("confirmButton");

    if (button) {
        button.disabled = true;
        button.textContent =
            "⏳ Enviando pedido...";
    }


    try {

        /* ==============================
           EMAIL AL CLIENTE
        ============================== */

        await sendOrderEmail(
            currentOrder.email,
            currentOrder.name,
            EMAILJS_CLIENT_TEMPLATE_ID
        );


        /* ==============================
           ESPERAR ENTRE ENVÍOS
        ============================== */

        await new Promise(
            resolve =>
                setTimeout(resolve, 1200)
        );


        /* ==============================
           EMAIL A LA PASTELERÍA
        ============================== */

        await sendOrderEmail(
            SHOP_EMAIL,
            "RedBow Bakery",
            EMAILJS_SHOP_TEMPLATE_ID
        );


        /* ==============================
           TODO CORRECTO
        ============================== */

        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("currentOrder");

        window.location.href =
            "confirmado.html?pedido=" +
            encodeURIComponent(
                currentOrder.orderNumber
            );


    } catch (error) {

        console.error(
            "Error enviando pedido:",
            error
        );

        alert(
            "⚠️ No se ha podido enviar el pedido.\n\n" +
            "Por favor, inténtalo de nuevo."
        );


        if (button) {

            button.disabled = false;

            button.textContent =
                "✅ Confirmar pedido";
        }
    }
}

/* ==============================
   ENVIAR EMAIL
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


async function sendOrderEmail(
    recipient,
    recipientName,
    templateId
) {

    const o = currentOrder;


    /* ==============================
       COMPROBAR EMAILJS
    ============================== */

    if (!window.emailjs) {

        throw new Error(
            "EmailJS no está cargado."
        );
    }


    /* ==============================
       HTML DE PRODUCTOS
    ============================== */

    const orderItemsHtml =
        buildOrderItemsHtml();


    /* ==============================
       DATOS PARA EMAILJS
    ============================== */

    const templateParams = {

        to_email:
            recipient,

        name:
            recipientName,

        order_number:
            o.orderNumber,

        customer_name:
            o.name,

        customer_phone:
            o.phone,

        customer_email:
            o.email,

        customer_address:
            o.address,

        address_link_url:
            o.addressLink,

        payment_method:
            o.payment,

        allergies:
            o.allergies ||
            "Ninguna indicada",

        notes:
            o.notes ||
            "Sin notas",

        total:
            o.total
                .toFixed(2)
                .replace(".", ",") +
            " EUR",

        order_items_html:
            orderItemsHtml
    };


    console.log(
        "Enviando email:",
        {
            recipient,
            templateId,
            templateParams
        }
    );


    /* ==============================
       ENVIAR
    ============================== */

    try {

        return await emailjs.send(
            EMAILJS_SERVICE_ID,
            templateId,
            templateParams
        );

    } catch (error) {

        console.error(
            "EmailJS.send() falló:",
            error
        );

        throw error;
    }
}

function renderReview() {

    document.getElementById("orderNumber").textContent =
        currentOrder.orderNumber;

    document.getElementById("reviewName").textContent =
        currentOrder.name;

    document.getElementById("reviewPhone").textContent =
        currentOrder.phone;

    document.getElementById("reviewEmail").textContent =
        currentOrder.email;

    document.getElementById("reviewAddress").textContent =
        currentOrder.address;

    document.getElementById("reviewPayment").textContent =
        currentOrder.payment;

    document.getElementById("reviewNotes").textContent =
        currentOrder.notes || "Sin notas";

    document.getElementById("reviewAllergies").textContent =
    currentOrder.allergies || "Ninguna indicada";

    const reviewItems =
        document.getElementById("reviewItems");


    reviewItems.innerHTML =
        currentOrder.items.map((item) => {

            const subtotal =
                item.price * item.qty;

            return `
                <div class="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div class="flex items-start justify-between gap-4">

                        <div>

                            <strong class="text-lg">
                                ${item.qty} ×
                                ${escapeHtml(item.name)}
                            </strong>

                            <p class="mt-1 text-sm text-gray-500">
                                Precio unidad:
                                ${item.price.toFixed(2).replace(".", ",")} €
                            </p>

                            ${buildDetailsHtml(item.details)}

                        </div>

                        <strong class="shrink-0">
                            ${subtotal.toFixed(2).replace(".", ",")} €
                        </strong>

                    </div>

                </div>
            `;

        }).join("");


    document.getElementById("reviewTotal").textContent =
        currentOrder.total
            .toFixed(2)
            .replace(".", ",") + " €";
}


function backToShop() {

    window.location.href = "index.html";
}

renderReview();