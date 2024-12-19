$(document).ready(function () {
    // Initialize localStorage for users, products, orders, and cart
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }

    // Handle registration
    $('#registerBtn').click(function () {
        var name = $('#registerName').val().trim();
        var email = $('#registerEmail').val().trim();
        var password = $('#registerPassword').val().trim();
        var role = $('#registerRole').val();
        var users = JSON.parse(localStorage.getItem('users')) || [];

        if (name && email && password) {
            var userExists = users.some(function (user) {
                return user.email === email;
            });

            if (userExists) {
                alert('User already exists!');
            } else {
                users.push({ name: name, email: email, password: password, role: role });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registration successful!');
                $('#registerForm')[0].reset();
                window.location.href = 'login.html'; 
            }
        } else {
            alert('Please fill all fields.');
        }
    });

    // Handle login
    $('#loginBtn').click(function () {
        var email = $('#loginEmail').val().trim();
        var password = $('#loginPassword').val().trim();
        var role = $('#loginRole').val();

        var users = JSON.parse(localStorage.getItem('users')) || [];
        var currentUserKey = `currentUser_${role}`; // Unique key for each role

        // Validate login credentials
        var user = users.find(function (user) {
            return user.email === email && user.password === password && user.role === role;
        });

        if (user) {
            alert('Login successful!');
            localStorage.setItem(currentUserKey, JSON.stringify(user)); // Store current user for the role
            if (role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (role === 'vendor') {
                window.location.href = 'vendor-dashboard.html';
            } else if (role === 'customer') {
                window.location.href = 'customer-dashboard.html';
            }
        } else {
            alert('Invalid email, password, or role. Please try again.');
        }
    });

    // Handle logout (for all roles)
    function handleLogout(role) {
        var currentUserKey = `currentUser_${role}`;
        localStorage.removeItem(currentUserKey); // Remove session for the role
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    }
});
