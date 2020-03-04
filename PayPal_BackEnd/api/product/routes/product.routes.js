var ProductController = require('../controllers/product.controllers.js')


function getProductByItemNumber(req){
    return new Promise(function(resolve, reject){
        var productC = new ProductController()
        productC.getProduct(req).then(function(res, err){
            return resolve({
                error: err,
                itemName: res.itemName,
                itemNumber: res.itemNumber,
                itemPrice: res.itemPrice
            });
        });
    });
}

function createProduct(req){
    return new Promise(function(resolve, reject){
        var productC = new ProductController();
        productC.createProduct(req).then(function(result, err){
            return resolve(result);
        }); 
    })
}

module.exports = {getProductByItemNumber, createProduct}