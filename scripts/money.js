import { cart } from "./cart.js";
import { products } from "./products.js";

export function formatCurrency(matchingProduct) {
  return (matchingProduct.priceCents / 100).toFixed(2);
}

// calculate total items cost before taxes
export function CostCalculate() {
  let costTotal = 0;

  cart.forEach((itemPrd) => {
    const productId = itemPrd.productId;

    products.forEach((prodcut) => {
      if (prodcut.id === productId) {
        // when find the products that's in our cart
        // get all the items container currently in the cart
        // loop through each one and get the price of the item
        // it's just string so we converted it using parseInt
        // then multi by 100 to switch to cent to avoid float num.
        // do the same with quantity
        document
          .querySelectorAll(`.js-cart-items-container-${prodcut.id}`)
          .forEach((productCost, productQty) => {
            productCost =
              parseFloat(
                document.querySelector(`.js-product-price-${prodcut.id}`)
                  .innerText
              ) * 100;

            productQty = parseInt(
              document.querySelector(`.js-quantity-update-${prodcut.id}`)
                .innerText
            );

            // multiply prdCost by prdQty to get the total price
            // of product based on the quantity
            costTotal += productCost * productQty;
          });
      }
    });
  });
  document.querySelector(".js-products-cost").innerHTML = `$${(
    costTotal / 100
  ).toFixed(2)}`;

  return costTotal / 100;
}

export function OrderTotalCost() {
  let shippingCost = 0;

  cart.forEach((item) => {
    if (item.deliveryOptionId === "1") {
      shippingCost += 0;
    } else if (item.deliveryOptionId === "2") {
      shippingCost += 499;
    } else if (item.deliveryOptionId === "3") {
      shippingCost += 999;
    }
  });

  shippingCost = shippingCost > 0 ? shippingCost / 100 : shippingCost;

  document.querySelector(
    ".js-shipping-cost"
  ).innerHTML = `$${shippingCost.toFixed(2)}`;

  const afterShippCost = (shippingCost + CostCalculate()).toFixed(2);

  document.querySelector(
    ".js-cost-after-shipp"
  ).innerHTML = `$${afterShippCost}`;

  // calc the estimated Tax
  const calcTax = (Number(afterShippCost) * 0.1).toFixed(2);

  document.querySelector(".js-tax").innerHTML = `$${calcTax}`;

  // calculate THE TOTAL COST
  document.querySelector(".js-total-cost").innerHTML = `$${(
    Number(afterShippCost) + Number(calcTax)
  ).toFixed(2)}`;
}
