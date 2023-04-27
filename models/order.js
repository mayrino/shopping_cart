var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type:Schema.Types.ObjectId, ref:'User'},
    cart: {type:Object, require:true},
    name: {type:String, require:true},
    address: {type:String, require:true},
    phone: {type:String, require:true},
    payment :{type:String, required:true}
});

module.exports = mongoose.model('Order',schema);