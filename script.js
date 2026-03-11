/* --- INTRO LOGIC --- */
function startIntro() {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        const intro = document.getElementById('intro-overlay');
        if (intro) intro.classList.add('hide-intro');
        document.body.style.overflow = "auto";
    }, 2000);
}

/* --- OFFER COUNTDOWN LOGIC --- */
const offerEndTime = new Date().getTime() + 6*60*60*1000; 
let timerInterval;

function updateCountdown() {
    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;

    const now = new Date().getTime();
    const distance = offerEndTime - now;

    if(distance <= 0) {
        countdownEl.innerText = "EXPIRED!";
        clearInterval(timerInterval);
        return;
    }

    const hrs = Math.floor((distance % (1000*60*60*24))/(1000*60*60));
    const mins = Math.floor((distance % (1000*60*60))/(1000*60));
    const secs = Math.floor((distance % (1000*60))/1000);

    countdownEl.innerText =
        `${String(hrs).padStart(2,'0')}:` +
        `${String(mins).padStart(2,'0')}:` +
        `${String(secs).padStart(2,'0')}`;
}

/* --- PRODUCT DATA --- */
const products = [
    ["Classic Cheese Burger", 199, "images/burger1.jpg"],
    ["Spicy Paneer Burger", 179, "images/burger2.jpg"],
    ["Chicken Zinger Burger", 249, "images/burger3.jpg"],
    ["Double Patty Maharaja", 349, "images/burger4.jpg"],
    ["Crispy Veg Burger", 149, "images/burger5.jpg"],
    ["BBQ Bacon Burger", 299, "images/burger6.jpg"],
    ["Mushroom Swiss Burger", 279, "images/burger7.jpg"],
    ["Peri Peri Chicken Burger", 259, "images/burger8.jpg"],
    ["Margherita Pizza", 299, "images/pizza1.jpg"],
    ["Farmhouse Pizza", 399, "images/pizza2.jpg"],
    ["Peppy Paneer Pizza", 349, "images/pizza3.jpg"],
    ["Pepperoni Feast", 499, "images/pizza4.jpg"],
    ["Veggie Paradise", 379, "images/pizza5.jpg"],
    ["Chicken Tikka Pizza", 449, "images/pizza6.jpg"],
    ["Mexican Green Wave", 389, "images/pizza7.jpg"],
    ["Double Cheese Margherita", 359, "images/pizza8.jpg"],
    ["White Sauce Pasta", 229, "images/pasta1.jpg"],
    ["Red Sauce Penne", 219, "images/pasta2.jpg"],
    ["Classic French Fries", 129, "images/fries1.jpg"],
    ["Peri Peri Fries", 149, "images/fries2.jpg"],
    ["Garlic Breadsticks", 159, "images/bread1.jpg"],
    ["Cheesy Garlic Bread", 189, "images/bread2.jpg"],
    ["Chicken Nuggets (6pc)", 199, "images/nuggets1.jpg"],
    ["Onion Rings", 139, "images/onionrings1.jpg"],
    ["Veg Fried Rice", 189, "images/rice1.jpg"],
    ["Hakka Noodles", 179, "images/noodles1.jpg"],
    ["Chilli Paneer Dry", 249, "images/chilli1.jpg"],
    ["Chicken Manchurian", 279, "images/chicken1.jpg"],
    ["Spring Rolls", 159, "images/springrolls1.jpg"],
    ["Chocolate Lava Cake", 99, "images/cake1.jpg"],
    ["Brownie with Ice Cream", 169, "images/cake2.jpg"],
    ["Vanilla Muffin", 79, "images/muffin1.jpg"],
    ["Red Velvet Cake", 149, "images/cake3.jpg"],
    ["Gulab Jamun (2pc)", 59, "images/sweets1.jpg"],
    ["Cold Coffee", 120, "images/drink1.jpg"],
    ["Oreo Shake", 150, "images/drink2.jpg"],
    ["Strawberry Smoothie", 140, "images/drink3.jpg"],
    ["Fresh Lime Soda", 80, "images/drink4.jpg"],
    ["Iced Tea", 90, "images/drink5.jpg"],
    ["Masala Chai", 40, "images/drink6.jpg"],
    ["Coca Cola (500ml)", 60, "images/drink7.jpg"],
    ["Water Bottle (1L)", 20, "images/drink8.jpg"]
];

let cart = [];
let orders = [];
let selectedProduct = null;
let selectedIndex = -1;

/* --- LOAD MENU --- */
function loadMenu() {
    const list = document.getElementById("product-list");
    if (!list) return;

    list.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p[2]}" alt="${p[0]}">
            <h3>${p[0]}</h3>
            <p>₹${p[1]}</p>
            <button class="cart-btn" onclick="addToCart('${p[0]}', ${p[1]})">Add to Cart</button>
            <button class="buy-btn" onclick="buyNow('${p[0]}', ${p[1]})">Buy Now</button>
        </div>
    `).join('');
}

/* --- CART LOGIC --- */
function addToCart(name, price) {
    cart.push({ name: String(name), price: Number(price) });
    displayCart();
}

function displayCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("total");
    if (!container || !totalEl) return;

    if(cart.length === 0) {
        container.innerHTML = "<p style='color:#777;'>Your cart is empty.</p>";
    } else {
        container.innerHTML = cart.map((item,i) => `
            <div class="list-item">
                <span><b>${item.name}</b><br>₹${item.price}</span>
                <div>
                    <button onclick="payFromCart(${i})" class="btn-pay">Pay</button>
                    <button onclick="removeFromCart(${i})" class="btn-cancel">Cancel</button>
                </div>
            </div>
        `).join('');
    }

    totalEl.innerText = "₹" + cart.reduce((sum,item)=>sum+item.price,0);
}

function removeFromCart(i) {
    if (i >= 0 && i < cart.length) {
        cart.splice(i,1);
        displayCart();
    }
}

/* --- BUY / PAY MODAL --- */
function buyNow(name, price) {
    selectedProduct = {name, price};
    selectedIndex = -1;
    openModal();
}

function payFromCart(i) {
    if (i >= 0 && i < cart.length) {
        selectedProduct = cart[i];
        selectedIndex = i;
        openModal();
    }
}

function openModal() {
    const modal = document.getElementById("paymentModal");
    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("paymentModal");
    if (modal) modal.style.display = "none";
}

/* --- CONFIRM PAYMENT --- */
function confirmPayment() {
    const nameInput = document.getElementById("fullName");
    const addrInput = document.getElementById("address");

    if(!nameInput || !addrInput || !nameInput.value || !addrInput.value){
        alert("Please fill details!");
        return;
    }

    if (!selectedProduct) return;

    orders.push({
        customer: nameInput.value,
        product: selectedProduct.name,
        price: selectedProduct.price,
        time: new Date().toLocaleTimeString()
    });

    if(selectedIndex !== -1) {
        cart.splice(selectedIndex,1);
        displayCart();
    }

    displayOrders();

    alert("✅ Order Confirmed!");
    nameInput.value = "";
    addrInput.value = "";
    selectedProduct = null;
    selectedIndex = -1;
    closeModal();
}

/* --- DISPLAY ORDERS --- */
function displayOrders() {
    const container = document.getElementById("order-history");
    if (!container) return;

    if(orders.length===0) {
        container.innerHTML="<p style='color:#777;'>No orders yet.</p>";
    } else {
        container.innerHTML = orders.map(o=>`
            <div class="list-item">
                <span><b>${o.customer}</b><br>${o.product}</span>
                <span style="color:#FFCC00; font-weight:bold;">Success</span>
            </div>
        `).reverse().join('');
    }

    const heroCount = document.getElementById("hero-order-count");
    if(heroCount) heroCount.innerText = orders.length;
}

/* --- SEARCH --- */
function searchFood() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    let term = input.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
        let name = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
}

/* --- ONLOAD --- */
window.onload = () => {
    startIntro();
    loadMenu();
    displayCart();
    displayOrders();
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
};