$(function () {
    $('#username, #password').on('focus', function () { $('#formErrorMessage').removeClass('danger-alert'); })
    $('#loginForm').on('submit', function (e) {
        var username = $('#username').val();
        var password = $('#password').val();
        if (username === '' || password === '') {
            $('#formErrorMessage').addClass('danger-alert').text('Please fill in all fields');
        } else {
            $('#formErrorMessage').removeClass('danger-alert');
            $.ajax({
                method: 'POST',
                url: 'http://recruits.siennsoft.com/api/jwt',
                data: {
                    Username: username,
                    Password: password
                    // Username: 'sienn',
                    // Password: 'TheLittlePasswordThatCouldAuthenticate'
                },
                error: function (requestObject, error, errorThrown) {
                    $('#formErrorMessage').addClass('danger-alert').text(errorThrown);
                },
                success: function (response) {
                    $('#loginForm').hide();
                    var access_token = JSON.parse(response).access_token;
                    localStorage.setItem('sienn_token', access_token);
                    loadMainContent();
                }
            });
        }
        e.preventDefault();
    })
});

function loadMainContent() {
    var template = '<div id="products"></div>';
    $('#mainContent').html(template);
    var products = getAllProducts();
    products.done(function (response) {
        response.map(function (item) {
            var product = new Product(item);
            $('#products').append(product.getProduct());
        });
    }).fail(function (err) {
        console.log(err);
    });
}

function getAllProducts() {
    return $.ajax({
        method: 'GET',
        url: 'http://recruits.siennsoft.com/api/products',
        headers: { "Authorization": "Bearer " + localStorage.getItem('sienn_token') },
    });
}

function Product(item) {
    this.productID = item.productID;
    this.name = item.name;
    this.description = item.description;
    this.price = item.price;
    this.getProduct = function () {
        return '<div class="card" id="' + item.productID + '">\
                 <p class="card-name"><b>'+ item.name + '</b></p>\
                 <p class="card-price">'+ item.price + '$</p>\
                 <p class="card-description">'+ item.description + '</p>\
                </div>'
    }
}