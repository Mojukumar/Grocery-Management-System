document.addEventListener("DOMContentLoaded", () => {
    const catalogList = document.getElementById("catalogList");
    const productSearch = document.getElementById("productSearch");
    const cartList = document.getElementById("cartList");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const customerLogoutBtn = document.getElementById("customerLogoutBtn");
    let cart = [];
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");

    // Load product catalog
    const loadCatalog = (filter = "") => {
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        catalogList.innerHTML = '';

        const filteredProducts = filter 
            ? products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
            : products;

        filteredProducts.forEach((product, index) => {
            const productItem = document.createElement("div");
            productItem.classList.add("catalog-item", "col-md-4");
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
                <button class="btn btn-primary" onclick="addToCart(${index})">Add to Cart</button>
            `;
            catalogList.appendChild(productItem);
        });
    };

    productSearch.addEventListener("input", () => {
        loadCatalog(productSearch.value);
    });

    // Add product to cart with quantity
    window.addToCart = (index) => {
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const selectedProduct = products[index];
        const quantity = prompt(`How many of "${selectedProduct.name}" would you like to add?`, 1);

        if (quantity && !isNaN(quantity) && quantity > 0) {
            const existing = cart.findIndex(item => item.name === selectedProduct.name);
            if (existing !== -1) {
                cart[existing].quantity += parseInt(quantity);
            } else {
                cart.push({ ...selectedProduct, quantity: parseInt(quantity) });
            }
            updateCart();
        } else {
            alert("Invalid quantity. Please enter a number greater than 0.");
        }
    };

    const updateCart = () => {
        cartList.innerHTML = cart.length === 0
            ? '<p>Your cart is empty.</p>'
            : cart.map((item, index) => `
                <div class="row cart-item">
                    <div class="col-md-8">${item.name} (x${item.quantity})</div>
                    <div class="col-md-4 text-right">
                        <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>`).join('');
        const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        document.getElementById("totalPrice").innerHTML = `<h5>Total Price: $${totalPrice.toFixed(2)}</h5>`;
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCart();
    };

    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const deliveryAddress = prompt("Please enter your delivery address:");
        const phoneNumber = prompt("Please enter your phone number (10 digits):");
        if (!/^\d{10}$/.test(phoneNumber)) {
            alert("Invalid phone number. Please enter a valid 10-digit phone number.");
            return;
        }
        if (deliveryAddress) {
            orderHistory.push({ orderId: Date.now(), items: cart, totalAmount, deliveryAddress, phoneNumber, date: new Date().toISOString() });
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
            cart = [];
            updateCart();
            alert("Order placed successfully!");
            window.location.href = "orderHistory.html";
        } else {
            alert("Address is required for delivery.");
        }
    });

    customerLogoutBtn.addEventListener("click", () => {
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });

    loadCatalog();
});
