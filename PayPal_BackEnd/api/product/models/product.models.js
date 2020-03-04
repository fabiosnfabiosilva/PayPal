class Product {
    constructor(itemNumber, itemName, itemPrice){
        this.itemNumber = itemNumber;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
    }

    get(){
        return { itemNumber: this.itemNumber, itemName: this.itemName, itemPrice: this.itemPrice }
    }

    getItemNumber(){
        return this.itemNumber;
    }
    
    set(){
        // TODO: this function will set the variables in the user object
    }
    
}

module.exports = {Product}