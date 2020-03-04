var flatfile = require('flat-file-db');
var DATABASES = { 'USER': 'user.db', 'PRODUCT': 'product.db' };

function get(database, key){
    var db = flatfile.sync('../tmp/' + database);
    return db.get(key)
}

function create(database, key, payload){
    var db = flatfile.sync('../tmp/' + database);
    return db.put(key, payload);
}

module.exports = {get, create, DATABASES}