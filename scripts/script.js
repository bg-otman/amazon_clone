import { cart, addToCart } from "./cart.js"; // get the cart variable, and the fun addToCart form cart.js...
import { products } from "./products.js"; // get the products variable form products.js
import { formatCurrency } from "./money.js";

// dispalay items quantity on the page
UpdateQuantityDisplay();

// variable for saving the genarting HTML
let productsContainer = "";

// generating the HTML, creating the products container
// using the info form the products file
products.forEach((products) => {
  productsContainer += `
        <div class="product-container">
        
          <div class="product-image-container">
            <img
              src="${products.image}"
              alt="product"
            />
          </div>

          <div class="product-name limit-to-2-lines">
            ${products.name}
          </div>

          <div class="product-rating-container">
            <img src="images/ratings/rating-${
              products.rating.stars
            }.png" alt="rate" />
            <div class="prodcut-rating-count">${products.rating.count}</div>
          </div>

          <div class="product-price">$${formatCurrency(products)}</div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${products.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="add-to-cart js-added-${products.id}">
            <img src="images/icons/checkmark.png" alt="checkmark" />
            "Added"
          </div>

          <div class="button-container">
            <button class="add-to-cart-button js-add-to-cart" data-product-id="${
              products.id
            }">Add to Cart</button>
          </div>
        </div>`;
});

// display products on the page
document.querySelector(".js-products-container").innerHTML = productsContainer;

////////////////////////////////
// We're going to use an object to save the timeout ids.
// The reason we use an object is because each product
// will have its own timeoutId. So an object lets us
// save multiple timeout ids for different products.
const addedMessageTimeouts = {};

function updateCartQuantity(productId) {
  ///
  UpdateQuantityDisplay();

  // the added display after we click add button
  const addedElement = document.querySelector(`.js-added-${productId}`);

  // when we click add button, add an class to this element
  addedElement.classList.add("js-added");

  setTimeout(() => {
    // when click add button to a product
    // add a unique time out to this product using Id
    const addedTimeOut = addedMessageTimeouts[productId];

    // if ther's a time out running in this variable
    // (is addedTimeOut => Truty)
    if (addedTimeOut) {
      // clear it
      clearTimeout(addedTimeOut);
    }

    // save a time out in this variable
    // when the time is out (2seconds),
    // remove the "js-added" class from addElement
    const timeClear = setTimeout(() => {
      addedElement.classList.remove("js-added");
    }, 2000);

    // and re-assing the timeout to addMessage..
    // the reason we assing it here is to use above
    // if timeClear Still runing
    //  ==> addedMessageTimeouts[productId] will be true
    // then addTimeOut === true, then we clearTimeout(addedTimeOut)
    // if timeClear finished, we remove the class after 2 sec
    addedMessageTimeouts[productId] = timeClear;
  });
}

////////////////////////////////
// make the add button interactive
// by adding an event listner to every add to cart button
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    // create a variable called productId
    // and get from button the data that contain product Id
    const { productId } = button.dataset;

    // run the fun we imported at top
    addToCart(productId);

    updateCartQuantity(productId);
  });
});

function UpdateQuantityDisplay() {
  // quantity start, to store any new products
  // add to the cart
  let quantityCount = 0;

  cart.forEach((item) => {
    quantityCount += item.quantity;
  });

  // display the product quantity
  document.querySelector(".js-cart-quantity").innerHTML = quantityCount;
}
