require("dotenv").config()
const express = require("express");
const path = require("path")
const app= express();
const ejs = require("ejs");
const expressLayout =require("express-ejs-layouts")
const PORT =process.env.PORT || 3000;
const mongoose = require ("mongoose");
const session = require("express-session");
const flash= require("express-flash");
const MongoDbStore = require('connect-mongo')(session);
const passport = require("passport")
const Emitter = require('events')



// Databse connnection
// const url = 'mongodb://127.0.0.1:27017/pizza';
const connection = mongoose.connection
mongoose.connect(process.env.MONGO_CONNECTION_URL , { useNewUrlParser: true,  useUnifiedTopology: true, }).then(e =>{
    console.log("mongodb is conneced.....");
}).catch(err => {
    console.log('Connection failed...',err)
});


// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})


// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



// session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} // 24 hrs
}))

// Passport config

const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())



// Assests
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname ,'/resources/views'))
app.set('view engine' ,'ejs');


require("./routes/web")(app)

app.use((req, res) => {
    res.status(404).render('errors/404')
})

// socket
const server = app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
  });
  
  const { Server } = require('socket.io');
const order = require("./app/models/order");
  const io = new Server(server);
  
  io.on('connection', (socket) => {

    // Join
    socket.on('join', (orderId) => {
      socket.join(orderId);
    });
  });
  
  eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
  });
  
  eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
  });