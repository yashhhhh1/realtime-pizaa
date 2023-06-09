const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema=new Schema({
   customerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            require:true
   },
   items:{
    type: Object,
    required:true
   },
   phone:{
    type:String,
    require:true
   },
   address:{
    type:String,
    require:true
   },
   paymentType:{
    type:String,
    default:"COD"
   },
   status:{
    type:String,
    default:"order_placed"
   }

    
}, {timestamps:true})


module.exports= mongoose.model('Order',orderSchema)