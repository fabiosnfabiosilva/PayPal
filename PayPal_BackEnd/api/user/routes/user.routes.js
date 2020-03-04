var UserController = require('../controllers/user.controllers.js')


function getUserById(req){
    return new Promise(function(resolve, reject){
        var userC = new UserController()
        userC.getUser(req).then(function(res, err){
            return resolve({
                error: err,
                firstName: res.firstName,
                lastName: res.lastName,
                email: res.email,
                phone: res.phone,
                street: res.address.street,
                zip: res.address.zip,
                city: res.address.city, 
                state: res.address.state,
                country: res.address.country
            });
        });
    });
}

function createUserById(req){
    return new Promise(function(resolve, reject){
        var userC = new UserController();
        userC.createUser(req).then(function(result, err){
            return resolve(result);
        }); 
    })
}

module.exports = {getUserById, createUserById}