var userModels = require('../models/user.models.js');
var database = require('../../../services/database.js');
console.log(userModels)
class UserController {
    
    getUser(req){
        return new Promise(function(resolve, reject){
            // TODO: resolve querystring content
            var result = database.get(database.DATABASES.USER, req.params.userId);
            if(result){
                result.error = '';
                return resolve(result);
            }
            return resolve({ 'error': 'User not found' })
        });        
    }
    createUser(req){
        var uuid = '';
        return new Promise(function(resolve, reject){
            var user = new userModels.User(req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.street, req.body.zip, req.body.city, req.body.state, req.body.country);
            uuid = user.getId();
            var result = database.create(database.DATABASES.USER, uuid, user.get())
            return resolve({ 'error': '', 'uuid': uuid })
            

        });        
    }
}

module.exports = UserController