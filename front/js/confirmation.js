const orderUrl = new URL(window.location.href);
const orderId = orderUrl.searchParams.get("id");

document.querySelector("#orderId").textContent = orderId;