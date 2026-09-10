const currentOrder =
    JSON.parse(
        sessionStorage.getItem("currentOrder")
    );

if (!currentOrder) {
    window.location.href = "index.html";
}

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