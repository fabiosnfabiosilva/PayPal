const paypal = require('@paypal/checkout-server-sdk');
const paypalClient = require('../controllers/paypal.controllers.js')
var request = require('request');

var CLIENT =
  'AQ-DNxzq1DQkSKVZYdfMXoeId-gtvFk4kaPFgb0DuRjdbqH-wo5rUCcfCziBG-N03a12J_SGPHYBq4r1';
var SECRET =
  'ELZCtu-bcghGvxUD-LnbNKT8VsPhjvbJSwBPfKNUWDA2wmbRWzN3Q1ldCDjl4XySXYAPxZYgekegSdZr';
var PAYPAL_API = 'https://api.sandbox.paypal.com';

function createPayment(req){
  return new Promise(function(resolve, reject){
    request.post(PAYPAL_API + '/v1/payments/payment',
    {
        auth:
        {
          user: CLIENT,
          pass: SECRET
        },
        body:
        {
          intent: 'sale',
          payer:
          {
            payment_method: 'paypal'
          },
          transactions: [
          {
            amount:
            {
              total: req.body.productPrice,
              currency: req.body.currency
            }
          }],
          redirect_urls:
          {
            return_url: 'http://localhost:3000/thankyou',
            cancel_url: 'http://localhost:3000/cancel'
          }
        },
        json: true
      }, function(err, response)
      {
        var respCode = 200;
        if (err)
        {
          console.error(err);
          respCode = 500;
        }
        // 3. Return the payment ID to the client
        return resolve({ 
          respCode: respCode,
          id: response.body.id
        });
      });
    });
}
  
 function executePayment(req, paymentInfo){
   return new Promise(function(resolve, reject){
    // 2. Get the payment ID and the payer ID from the request body.
    console.log(req.body.paymentID);
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute',
      {
        auth:
        {
          user: CLIENT,
          pass: SECRET
        },
        body:
        {
          payer_id: payerID,
          transactions: [
          {
            amount:
            {
                total: '5.78',
                //total: req.body.productPrice,
                currency: req.body.currency
            },
            items: {
              shipping_address: {
                recipient_name: (req.body.lastName + ' ' + req.body.firstName),
                line1: req.body.street,
                city: req.body.city,
                country_code: req.body.country,
                postal_code: req.body.zip,
                phone: req.body.phoneNumber,
                state: req.body.state
              }
            }
          }],
          redirect_urls:
          {
            return_url: 'http://localhost:3000/thankyou',
            cancel_url: 'http://localhost:3000/cancel'
          }
        },
        json: true
      },
      function(err, response)
      {
        var respCode = 200;
        if (err)
        {
          console.log(response)
          console.error(err);
          respCode = 500;
        }
        // 4. Return a success response to the client
        return resolve({
          respCode: respCode,
          status: 'success'
        });
      });
    })
}

async function validatePayment(req){
   const orderID = req.body.orderID;

   let request = new paypal.orders.OrdersGetRequest(orderID);
   let respCode = 200;
   let status = "success"
   let order;
   try {
     order = await paypalClient.client().execute(request);
   } catch (err) {
     console.error(err);
     respCode = 500;
     status = "call error"
   }
   console.log(order)
   if (order.result.status !== "APPROVED") {
     respCode = 400
     status = "payment didn't work"
   }
 
   return {respCode: respCode, status: status};
}

async function handleRequest(req) {
    console.log(req.body)
    // 3. Call PayPal to set up a transaction
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      "intent": "CAPTURE",
      "application_context": {
        "return_url": "http://localhost:3000/checkout",
        "cancel_url": "https://example.com",
        "brand_name": "MyAssessmentBrand",
        "locale": "en-US",
        "landing_page": "BILLING",
        "shipping_preference": "SET_PROVIDED_ADDRESS",
        "user_action": "CONTINUE"
      },
      "purchase_units": [
        {
          "reference_id": "PUHF",
          "description": "Sporting Goods",
          "custom_id": "CUST-HighFashions",
          "soft_descriptor": "HighFashions",
          "amount": {
            "currency_code": req.body.currencyCode,
            "value": req.body.totalPrice,
            "breakdown": {
              "item_total": {
                "currency_code": req.body.currencyCode,
                "value": req.body.totalPrice
              },
              "shipping": {
                "currency_code": req.body.currencyCode,
                "value": (req.body.shippingCost ? req.body.shippingCost : "0")
              },
              "handling": {
                "currency_code": req.body.currencyCode,
                "value": (req.body.handlingCost ? req.body.handlingCost : "0")
              },
              "tax_total": {
                "currency_code": req.body.currencyCode,
                "value": (req.body.taxTotal ? req.body.taxTotal : "0")
              },
              "shipping_discount": {
                "currency_code": req.body.currencyCode,
                "value": (req.body.shippingDiscount ? req.body.shippingDiscount : "0")
              }
            }
          },
          "items": req.body.products,
          "shipping": {
            "method": "United States Postal Service",
            "address": {
              "name": {
                "full_name": req.body.firstName,
                "surname": req.body.lastName
              },
              "address_line_1": req.body.street.slice(req.body.street.indexOf(' ')),
              "address_line_2": req.body.street.slice(0, req.body.street.indexOf(' ')),
              "admin_area_2": req.body.city,
              "admin_area_1": req.body.state,
              "postal_code": req.body.zip,
              "country_code": req.body.country
            }
          }
        }
      ]
    });

    let order;
    let respCode = 200; 
    console.log(paypal)
    try {
      order = await paypalClient.client().execute(request);
    } catch (err) {

      // 4. Handle any errors from the call
      console.error(err);
      respCode = 500;
    }
    console.log('handleRequest')
    // 5. Return a successful response to the client with the order ID
    return {
      respCode: respCode,
      id: order.result.id
    }
}

module.exports = {createPayment, executePayment, handleRequest, validatePayment}