$(document).ready(function () {
    function loadVendorProducts(user) {
        var products = JSON.parse(localStorage.getItem('products')) || [];
        var vendorProducts = products.filter(product => product.vendorEmail === user.email);

        $('#productTable tbody').empty();

        if (vendorProducts.length === 0) {
            $('#productTable tbody').append('<tr><td colspan="6">No products available. Add some products!</td></tr>');
        } else {
            vendorProducts.forEach((product, index) => {
                $('#productTable tbody').append(
                    `<tr>
                        <td>${index + 1}</td>
                        <td><img src="${product.image}" class="product-image" alt="Product Image"></td>
                        <td>${product.name}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.quantity}</td>
                        <td><button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Delete</button></td>
                    </tr>`
                );
            });

            $('.delete-product').click(function () {
                var productId = $(this).data('id');
                var products = JSON.parse(localStorage.getItem('products')) || [];
                products = products.filter(product => product.id !== productId);
                localStorage.setItem('products', JSON.stringify(products));
                alert('Product deleted successfully!');
                loadVendorProducts(user);
            });
        }
    }

    $('#addProductBtn').click(function () {
        var name = $('#productName').val().trim();
        var price = $('#productPrice').val().trim();
        var quantity = $('#productQuantity').val().trim();
        var user = JSON.parse(localStorage.getItem('currentUser_vendor'));
        var products = JSON.parse(localStorage.getItem('products')) || [];
        var imageFile = $('#productImage')[0].files[0];

        if (name && price && quantity && imageFile) {
            if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
                alert('Price and quantity must be positive numbers.');
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var productId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
                products.push({
                    id: productId,
                    name: name,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    image: e.target.result,
                    vendorEmail: user.email,
                });

                localStorage.setItem('products', JSON.stringify(products));
                alert('Product added successfully!');
                $('#productForm')[0].reset();
                loadVendorProducts(user);
            };

            reader.readAsDataURL(imageFile);
        } else {
            alert('Please fill in all fields and select an image.');
        }
    });

    $('#vendorLogoutBtn').click(function () {
        localStorage.removeItem('currentUser_vendor');
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    });

    var currentUser = JSON.parse(localStorage.getItem('currentUser_vendor'));
    if (currentUser && currentUser.role === 'vendor') {
        loadVendorProducts(currentUser);
    } else {
        alert('Unauthorized access. Redirecting to login page.');
        window.location.href = 'login.html';
    }
});
