$(document).ready(function() {
    // Attach event listeners for "Add to Cart" buttons
    attachAddToCartListeners();
    

    // Retrieve cart data from Local Storage
    var storedCart = localStorage.getItem('cart');
    var cart = storedCart ? JSON.parse(storedCart) : [];

    // Update cart count and display
    updateCartIconCount();
    updateCartDisplay();

    // Handle click events on navigation links
    $('nav ul li a').click(function(e) {
        e.preventDefault();

        // Get the URL from the clicked link
        var url = $(this).attr('href');

        // Fetch the content from the URL using AJAX
        $.get(url, function(data) {
            // Create a temporary container to hold the fetched content
            var tempContainer = $('<div></div>').html(data);

            // Extract the necessary sections from the fetched content
            var content = tempContainer.find('#content').html();
            var header = tempContainer.find('header').html();
            var navigation = tempContainer.find('nav').html();

            // Update the content in the #content div
            $('#content').html(content);

            // Update the header and navigation elements
            $('header').html(header);
            $('nav').html(navigation);

            // Reattach event listeners for "Add to Cart" buttons
            attachAddToCartListeners();

            // Scroll to the top of the page
            $('html, body').animate({scrollTop: 0}, 'slow');
        });
        $('#clear-cart-btn').click(function() {
            clearCart();
            updateCartDisplay();
            updateCartIconCount();
          });
    });

    // Event listener for form submission
    $('#order-form').submit(function(e) {
        e.preventDefault();

        if (cart.length === 0) {
            $('#checkout-message').text("There is nothing in the cart.");
        } else {
            var name = $('#name').val();
            var phone = $('#phone').val();
            var address = $('#address').val();

            // Perform any desired further processing here

            $('#checkout-message').text("Thank you for ordering!");
            cart = []; // Clear the cart
            updateCartDisplay();
            updateCartIconCount();

            // Remove cart data from Local Storage
            localStorage.removeItem('cart');
        }
        $('#clear-cart-btn').click(function() {
            clearCart();
            updateCartDisplay();
            updateCartIconCount();
          });
          
    });

    function attachAddToCartListeners() {
        // Event listener for "Add to Cart" buttons
        $('.add-to-cart-btn').off().click(function() {
            var $menuItem = $(this).closest('.menu-item');
            var $quantitySection = $menuItem.find('.quantity-section');
            var itemName = $menuItem.find('.menu-item-name').text();
            var itemPrice = $menuItem.find('.menu-item-price').text();
    
            if ($quantitySection.is(':visible')) {
                // Quantity section is already visible, add to cart
                var itemQuantity = parseInt($menuItem.find('.quantity-value').text());
                addToCart(itemName, itemPrice, itemQuantity);
    
                // Display success message
                alert(itemName + " added to cart successfully");
    
                // Reset quantity and button state
                $menuItem.find('.quantity-value').text('0');
                $menuItem.find('.quantity-btn').prop('disabled', true);
                $quantitySection.hide();
            } else {
                // Show quantity section
                $quantitySection.show();
                $menuItem.find('.quantity-btn').prop('disabled', false);
            }
        });
    
        // Event listener for quantity minus button
        $('.quantity-btn.minus').off().click(function() {
            var $menuItem = $(this).closest('.menu-item');
            var quantityValue = parseInt($menuItem.find('.quantity-value').text());
    
            if (quantityValue > 0) {
                quantityValue--;
                $menuItem.find('.quantity-value').text(quantityValue);
    
                // Update button state
                if (quantityValue === 0) {
                    $menuItem.find('.add-to-cart-btn').text('Add to Cart');
                }
            }
        });
    
        // Event listener for quantity plus button
        $('.quantity-btn.plus').off().click(function() {
            var $menuItem = $(this).closest('.menu-item');
            var quantityValue = parseInt($menuItem.find('.quantity-value').text());
    
            quantityValue++;
            $menuItem.find('.quantity-value').text(quantityValue);
    
            // Update button state
            if (quantityValue > 0) {
                $menuItem.find('.quantity-btn.minus').prop('disabled', false);
                $menuItem.find('.add-to-cart-btn').text('Update Cart');
            }
        });
    }
    function addToCart(name, price) {
        var item = {
            name: name,
            price: price
        };
        cart.push(item);

        // Save cart data to Local Storage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function clearCart() {
        cart = []; // Clear the cart
      
        // Remove cart data from Local Storage
        localStorage.removeItem('cart');
      }
      
      

    function updateCartIconCount() {
        var cartIcon = $('#cart-icon');
        var countElement = cartIcon.find('.cart-count');
        var count = cart.length;

        if (count === 0) {
            countElement.remove();
        } else {
            if (countElement.length === 0) {
                countElement = $('<span class="cart-count"></span>');
                cartIcon.append(countElement);
            }
            countElement.text(count);
        }
    }
    function updateCartDisplay() {
        var cartItemsContainer = $('#cart-items');
        var cartOptionsContainer = $('#cart-options');
        cartItemsContainer.empty();
      
        if (cart.length === 0) {
          cartItemsContainer.html('<p>There is nothing in the cart.</p>');
          cartOptionsContainer.hide();
        } else {
          cartOptionsContainer.show();
      
          for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var itemElement = $('<div class="cart-item">' +
              '<img class="cart-item-image" src="https://dummyimage.com/100x100/000/fff" alt="Item">' +
              '<div class="cart-item-details">' +
              '<span class="item-name">' + item.name + '</span>' +
              '<span class="item-price">' + item.price + '</span>' +
              '<span class="item-quantity">Quantity: ' + item.quantity + '</span>' +
              '</div>' +
              '</div>');
            cartItemsContainer.append(itemElement);
          }
        }
      }
      
      
});
