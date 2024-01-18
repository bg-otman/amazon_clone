export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: "1",
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2",
    },
  ];
}

function saveToStroage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;

  // in the cart array if ther's a product with
  // a simillar Id, save the array in the matching item variable
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  // bring the select element to know how many items we choosed
  const selectElement = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  // if the matchingItem is not undefined, it means ther's
  // an object inside same as the product we want to add to cart
  // So we just increase the quantity by selected value
  // if matchingItem is falsy, add new product to cart
  if (matchingItem) {
    // add selected quantity to old quantity
    matchingItem.quantity += Number(selectElement.value);
  } else {
    cart.push({
      productId,
      quantity: Number(selectElement.value),
      deliveryOptionId: "1",
    });
  }

  saveToStroage();
}

export function removeFromCart(productId) {
  let newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStroage();
}

// this fun to update quantity in checkOut page
// it allows the user modify the quantit of order's products
// by putting new quantity and this fun replace the new quanity
// by the old one
export function updateCarteQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStroage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStroage();
}
