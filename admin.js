$(document).ready(function () {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Load Admin Users
    function loadAdminUsers(searchQuery = '') {
        const vendorTableBody = $('#vendorTable tbody').empty();
        const customerTableBody = $('#customerTable tbody').empty();

        users.forEach((user, index) => {
            if (
                !searchQuery ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                const userRow = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-user" data-email="${user.email}">Delete</button>
                        </td>
                    </tr>
                `;

                if (user.role === 'vendor') {
                    vendorTableBody.append(userRow);
                } else if (user.role === 'customer') {
                    customerTableBody.append(userRow);
                }
            }
        });

        // Delete user event
        $('.delete-user').click(function () {
            const email = $(this).data('email');
            const updatedUsers = users.filter(user => user.email !== email);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            alert('User deleted successfully!');
            loadAdminUsers();
        });
    }

    // Load Admin Products
    function loadAdminProducts(searchQuery = '') {
        const productTableBody = $('#productTable tbody').empty();

        products.forEach((product, index) => {
            if (
                !searchQuery ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.vendorEmail.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                const productRow = `
                    <tr>
                        <td>${index + 1}</td>
                        <td><img src="${product.image}" alt="Product Image" class="product-image"></td>
                        <td>${product.name}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.vendorEmail}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-product" data-id="${product.id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Delete</button>
                        </td>
                    </tr>
                `;
                productTableBody.append(productRow);
            }
        });

        // Delete product event
        $('.delete-product').click(function () {
            const productId = $(this).data('id');
            const updatedProducts = products.filter(product => product.id !== productId);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            alert('Product deleted successfully!');
            loadAdminProducts();
        });

        // Edit product event
        $('.edit-product').click(function () {
            const productId = $(this).data('id');
            const product = products.find(p => p.id === productId);

            if (product) {
                const newName = prompt('Edit product name:', product.name);
                const newPrice = parseFloat(prompt('Edit product price:', product.price));

                if (newName && !isNaN(newPrice)) {
                    product.name = newName.trim();
                    product.price = newPrice;
                    localStorage.setItem('products', JSON.stringify(products));
                    alert('Product updated successfully!');
                    loadAdminProducts();
                } else {
                    alert('Invalid input! Product update canceled.');
                }
            }
        });
    }

    // Search functionality for vendors
    $('#vendorSearchBox').on('input', function () {
        const searchQuery = $(this).val();
        loadAdminUsers(searchQuery);
    });

    // Search functionality for customers
    $('#customerSearchBox').on('input', function () {
        const searchQuery = $(this).val();
        loadAdminUsers(searchQuery);
    });

    // Search functionality for products
    $('#productSearchBox').on('input', function () {
        const searchQuery = $(this).val();
        loadAdminProducts(searchQuery);
    });

    // Logout functionality
    $('#adminLogoutBtn').click(function () {
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    });

    // Initial data load
    loadAdminUsers();
    loadAdminProducts();
});
