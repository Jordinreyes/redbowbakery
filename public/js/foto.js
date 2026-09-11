
        function openImage(src, alt) {
            const modal = document.getElementById("imageModal");
            const image = document.getElementById("modalImage");

            image.src = src;
            image.alt = alt;

            modal.classList.remove("hidden");
            modal.classList.add("flex");

            document.body.classList.add("overflow-hidden");
        }

        function closeImage() {
            const modal = document.getElementById("imageModal");
            const image = document.getElementById("modalImage");

            modal.classList.add("hidden");
            modal.classList.remove("flex");

            image.src = "";
            image.alt = "";

            document.body.classList.remove("overflow-hidden");
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
            closeImage();
            }
        });


        function addProduct(name, price, quantityId) {
            const quantityInput = document.getElementById(quantityId);

            const quantity = Number(quantityInput.value);

            if (!quantityInput.value || quantity < 1 || !Number.isInteger(quantity)) {
            quantityInput.focus();
            quantityInput.reportValidity();
            return;
            }


            add(name, price, quantity);
        }