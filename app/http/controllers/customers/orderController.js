const Order = require("../../../models/order")
const moment = require("moment")


function orederController() {
    return {
        store(req, res) {
            // validate request
            const { phone, address } = req.body;

            if (!phone || !address) {
                req.flash('error', 'All fields are requried')

                return res.redirect("/cart");
            }
            // console.log(req.user);
            const order = new Order({
                customerId: req.user,
                items: req.session.cart.items,
                phone,
                address
            })


            order.save().then(result => {
                req.flash('success', "Order palce successfully")

               
                delete req.session.cart
                // Emit
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced', result)
                return res.redirect("/customer/orders")
            }).catch((err) => {
                req.flash('error', "Smething went Wrong")
                return res.redirect("/cart")
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user },
                null,
                {
                    sort: { 'createdAt': -1 }
                })
            res.render("customers/orders", { orders: orders, moment: moment })
            // console.log(orders);
        },
        async show(req, res) {

            const order = await Order.findById(req.params.id)

            // Authorize user
            if (req.user.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return res.redirect('/')
        }
    }

}

module.exports = orederController;