const order = require("../../../models/order")

const Order = require('../../../models/order')

function orderController() {
    return {
       async index(req, res) {
        
        try {
            const orders = await order
              .find({ status: { $ne: 'completed' } })
              .sort({ createdAt: -1 })
              .populate('customerId', '-password')
              .exec();
          
            if (req.xhr) {
              return res.json(orders);
            } else {
              return res.render('admin/orders');
            }
          } catch (err) {
            console.error(err);
            // Handle the error appropriately
            return res.status(500).send('An error occurred');
          }
        }
    }
}

module.exports = orderController