import {
  cart,
  removeFromCart,
  updateCarteQuantity,
  updateDeliveryOption,
} from "./cart.js";
import { products } from "./products.js";
import { formatCurrency, CostCalculate, OrderTotalCost } from "./money.js";
import { deliveryOptions } from "./deliveryOption.js";
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm";

function renderOrderSummury() {
  // update quantity on checkOut page
  UpdateQtyCheckOut();

  // to save the html
  let cartSummaryHtml = "";

  // looping trough each product in the cart
  // to get access to all the info about it
  cart.forEach((cartItem) => {
    // get an product id and store it on productID
    const productId = cartItem.productId;
    // undifined (empty) varibale to store product info
    let matchingProduct;

    // looping trough products list
    // when ever product.id (in products list) match the product id in the cart
    // store the product in the "matchingProduct" (to have control with all data of prd)
    products.forEach((prodcut) => {
      if (prodcut.id === productId) {
        matchingProduct = prodcut;
      }
    });

    let delevOption;

    deliveryOptions.forEach((option) => {
      if (option.id === cartItem.deliveryOptionId) {
        delevOption = option;
      }
    });

    const today = dayjs();
    const dateFormate = today
      .add(delevOption.deliveryDays, "days")
      .format("dddd, MMM D");

    // when we add a product to the cart it search for it in the products list
    // store it in the matchingProduct then we use the info such image, price. name and qty
    // to every time display on the page a product with it own data
    cartSummaryHtml += `
    <div class="cart-items-container js-cart-items-container-${
      matchingProduct.id
    }">
        <div class="delivery-date">Delivery date: ${dateFormate}</div>
        <div class="cart-item-detaills">
            <img
            src="${matchingProduct.image}"
            alt="product"
            />
            <div class="cart-item-info">
            <div class="product-name product-name-${matchingProduct.id}">
                ${matchingProduct.name}
            </div>
            <div class="product-price js-product-price-${
              matchingProduct.id
            }">${formatCurrency(matchingProduct)} $</div>
            <div class="product-quantity">
                <span>
                Quantity :
                <span class="qauntity-num js-quantity-update-${
                  matchingProduct.id
                }">${cartItem.quantity}</span>
                </span>
                <div class="quantity-controle">
                  <span class="update-product-quantity change-qty js-update-btn" data-product-id="${
                    matchingProduct.id
                  }">
                  Update
                  </span>
                  <input class="quantity-input edited-${
                    matchingProduct.id
                  }"  data-product-id="${matchingProduct.id}">
                  <span class="save-quantity change-qty edited-${
                    matchingProduct.id
                  }" data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-product-quantity change-qty js-delete-btn" data-product-id="${
                    matchingProduct.id
                  }">
                  Delete
                  </span>
                </div>
            </div>
            </div>
            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>

                  ${deliveryOpt(matchingProduct, cartItem)}

            </div>
        </div>
    </div>
    `;
  });

  // display the product on the checkOut page
  document.querySelector(".js-orders").innerHTML = cartSummaryHtml;

  // for each delete button add a click eventListner
  document.querySelectorAll(".js-delete-btn").forEach((deleteButton) => {
    const confirmationPopup = document.getElementById("confirmationPopup");
    const yesButton = document.getElementById("yesButton");
    const noButton = document.getElementById("noButton");

    deleteButton.addEventListener("click", () => {
      // when click a speciphique delete button get
      // it's data that contain product Id (to make every prd has his own delete btn)
      // then store it on "productID"
      const productId = deleteButton.dataset.productId;

      const container = document.querySelector(
        `.js-cart-items-container-${productId}`
      );

      // show delete confirmation popup
      confirmationPopup.style.display = "flex";

      // Hide the confirmation popup when the "No" button is clicked
      noButton.addEventListener("click", () => {
        confirmationPopup.style.display = "none";
      });

      yesButton.addEventListener("click", () => {
        removeFromCart(productId);
        // remove the product html from the page
        container.remove();
        // Hide the confirmation popup
        confirmationPopup.style.display = "none";

        // then update the items quantity on the page
        UpdateQtyCheckOut();
      });
    });
  });

  // get all the update's button
  document.querySelectorAll(".js-update-btn").forEach((button) => {
    const productId = button.dataset.productId;

    button.addEventListener("click", () => {
      // when click update store every element(inputs & Save btn)
      // has this class in this var, but it has the same id
      // with update button
      const inputSave = document.querySelectorAll(`.edited-${productId}`);

      // then the first element has the class above store it in "inputQt"
      // then the second element has the class above store it in "saveQt"
      // I used this way to get controle of this two element,this is because
      // we only have two element can have the same id with update btn
      let inputQt = inputSave[0];
      let saveQt = inputSave[1];

      // then add to each one this class to make them appear in the page
      inputQt.classList.add("is-editing");
      saveQt.classList.add("is-editing");
    });
  });

  // Add event listeners to the "Save" buttons
  document.querySelectorAll(".save-quantity").forEach((saveButton) => {
    saveButton.addEventListener("click", () => {
      const productId = saveButton.dataset.productId;

      // Find the corresponding input field for the product
      // by getting the input with his class with specifique
      // data attribute that macthes the productId
      const inputField = document.querySelector(
        `.quantity-input[data-product-id="${productId}"]`
      );

      // Get the new quantity value from the input field
      // parseInt for getting a valid num without.
      // (if input was "2 abc" parseInt convert it to "2")
      const newQuantity = parseInt(inputField.value, 10);

      if (newQuantity > 0) {
        // Update the cart with the new quantity for that specifique prd
        updateCarteQuantity(productId, newQuantity);

        // Update the displayed quantity for each product
        document.querySelector(`.js-quantity-update-${productId}`).textContent =
          newQuantity;

        // after entring newQt, and clicking Save btn
        // remove the class we add above to make him dispear again
        inputField.classList.remove("is-editing");
        saveButton.classList.remove("is-editing");

        // update the quantity total on the top of the page
        UpdateQtyCheckOut();
      } else if (newQuantity === 0) {
        // then run this fun to remove the prd form the cart
        removeFromCart(productId);

        const container = document.querySelector(
          `.js-cart-items-container-${productId}`
        );
        container.remove();

        // update the quantity total on the top of the page
        UpdateQtyCheckOut();
      } else {
        alert("Please insert a valid number");
      }
    });
  });

  // display the total quantity exist in the cart
  // at top of the page
  function UpdateQtyCheckOut() {
    // quantity start, to store any new products
    // add to the cart
    let quantityCount = 0;

    cart.forEach((item) => {
      quantityCount += item.quantity;
    });

    // display the product quantity
    document.querySelector(
      ".js-items-count"
    ).innerHTML = `${quantityCount} items`;

    // to store the html
    let productsCount = "";
    // every time we update the quantity of products
    // update the number of items in payment section
    productsCount += `Items ( ${quantityCount} )`;

    // display it
    document.querySelector(".js-products-count").innerHTML = productsCount;

    // calculate price after update items quantity
    CostCalculate();

    emptyCart();

    OrderTotalCost();
  }

  // claculate the price products according to how many items in the cart
  CostCalculate();

  //////////////////
  OrderTotalCost();

  function emptyCart() {
    if (cart.length === 0) {
      document.querySelector(".orders").innerHTML = `
    <div class="empty_cart">
      <h2>Oops! No items in the cart<h2>
      <img src="images/empty_cart.png" alt="empty-cart-img">
    </div>`;
    }
  }
  emptyCart();

  function deliveryOpt(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const dateFormate = today
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMM D");

      const price =
        deliveryOption.deliveryDays === 7
          ? "FREE"
          : `$${formatCurrency(deliveryOption)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
          <div class="delivery-option">
              <input data-product-id="${
                matchingProduct.id
              }" data-delivery-option-id="${deliveryOption.id}" ${
        isChecked ? "checked" : ""
      } type="radio" class="delivery-option-input  js-option" name="delivery-option-${
        matchingProduct.id
      }" />
              <div>
                <div class="delivery-option-date">${dateFormate}</div>
                <div class="delivery-option-price">${price} - Shipping</div>
              </div>
          </div>
    `;
    });

    return html;
  }

  document.querySelectorAll(".js-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummury();
    });
  });
}
renderOrderSummury();
