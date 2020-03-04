var uuid = require('uuid');

class User {
    constructor(firstName, lastName, email, phone, street, zip, city, state, country){
        this.id = uuid.v4();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone; 
        this.street = street;
        this.zip = zip;
        this.city = city;
        this.state = state;
        this.country = country;
    }

    get(){
        return { id: this.id, firstName: this.firstName, lastName: this.lastName, email: this.email, phone: this.phone, address: { street: this.street, zip: this.zip, city: this.city, state: this.state, country: this.country }}
    }

    getId(){
        return this.id;
    }
    
    set(){
        // TODO: this function will set the variables in the user object
    }
    
}

module.exports = {User}