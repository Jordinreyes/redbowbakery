const params = new URLSearchParams(
    window.location.search
);

const orderNumber =
    params.get("pedido");

const orderNumberElement =
    document.getElementById("orderNumber");


if (orderNumber) {

    orderNumberElement.textContent =
        orderNumber;

} else {

    orderNumberElement.textContent =
        "No disponible";

}