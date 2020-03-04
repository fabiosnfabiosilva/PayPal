var productModels = require('../models/product.models.js');
var database = require('../../../services/database.js');
console.log(productModels)
class ProductController {
    
    getProduct(req){
        return new Promise(function(resolve, reject){
            // TODO: resolve querystring content
            var result = database.get(database.DATABASES.PRODUCT, req.params.itemNumber);
            if(result){
                result.error = '';
                return resolve(result);
            }
            return resolve({ 'error': 'User not found' })
        });        
    }
    createProduct(req){
        var uuid = '';
        return new Promise(function(resolve, reject){
            var product = new productModels.Product(req.body.itemNumber, req.body.itemName, req.body.itemPrice);
            
            var result = database.create(database.DATABASES.PRODUCT, product.getItemNumber(), product.get())
            return resolve({ 'error': '', 'itemNumber': product.getItemNumber() })
            

        });        
    }
}

module.exports = ProductController