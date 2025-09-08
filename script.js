document.addEventListener('DOMContentLoaded', () => {

    updateCartIcon();

    const addToCartButtons = document.querySelectorAll('.food-card .btn-secondary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.food-card');
            
            const itemName = card.querySelector('h3').textContent;
            const itemPriceText = card.querySelector('.price').textContent;
            const itemImage = card.querySelector('.food-image').src;

            const itemPrice = parseFloat(itemPriceText.replace('₹', ''));

            const cartItem = {
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            };
            
            addItemToCart(cartItem);
            showPopup(`${itemName} was added to your cart!`);

            button.textContent = 'Added!';
            button.style.backgroundColor = '#28a745';
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '#6c757d';
            }, 1500);
        });
    });

    function addItemToCart(item) {
        let cart = JSON.parse(localStorage.getItem('bellyFuelCart')) || [];
        
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem('bellyFuelCart', JSON.stringify(cart));
        updateCartIcon();
    }

    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('#cart-total');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartSummary = document.querySelector('.cart-summary');

    if (cartItemsContainer) {
        displayCartItems();
    }
    
    function displayCartItems() {
        let cart = JSON.parse(localStorage.getItem('bellyFuelCart')) || [];

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }
        
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Price: ₹${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="btn-quantity" data-index="${index}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-quantity" data-index="${index}" data-action="increase">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-total">Subtotal: ₹${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-danger btn-remove" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `₹${total.toFixed(2)}`;
        }

        addCartActionListeners();
    }
    
    function addCartActionListeners() {
        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemIndex = parseInt(event.target.getAttribute('data-index'));
                removeItemFromCart(itemIndex);
            });
        });

        const quantityButtons = document.querySelectorAll('.btn-quantity');
        quantityButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemIndex = parseInt(event.target.getAttribute('data-index'));
                const action = event.target.getAttribute('data-action');
                updateItemQuantity(itemIndex, action);
            });
        });
    }

    function updateItemQuantity(index, action) {
        let cart = JSON.parse(localStorage.getItem('bellyFuelCart')) || [];
        if (index < 0 || index >= cart.length) return;

        if (action === 'increase') {
            cart[index].quantity += 1;
        } else if (action === 'decrease') {
            cart[index].quantity -= 1;
        }

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('bellyFuelCart', JSON.stringify(cart));
        displayCartItems();
        updateCartIcon();
    }

    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('bellyFuelCart')) || [];
        cart.splice(index, 1); 
        localStorage.setItem('bellyFuelCart', JSON.stringify(cart));
        displayCartItems();
        updateCartIcon();
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.className = 'popup-notification';
        popup.textContent = message;
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 3000);
    }

    function updateCartIcon() {
        const cartLink = document.querySelector('#cart-link');
        if (!cartLink) return;

        let cart = JSON.parse(localStorage.getItem('bellyFuelCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartLink.innerHTML = `Cart <span class="cart-count">${totalItems}</span>`;
        } else {
            cartLink.innerHTML = 'Cart';
        }
    }
});

