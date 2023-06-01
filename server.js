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


// Databse connnection
const url = 'mongodb://127.0.0.1:27017/pizza';
const connection = mongoose.connection
mongoose.connect(url , { useNewUrlParser: true,  useUnifiedTopology: true, }).then(e =>{
    console.log("mongodb is conneced.....");
}).catch(err => {
    console.log('Connection failed...',err)
});


// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

// session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} // 24 hrs
}))

app.use(flash())



// Assests
app.use(express.static("public"))
app.use(express.json())

// Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    next()
})


// set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname ,'/resources/views'))
app.set('view engine' ,'ejs');


require("./routes/web")(app)

app.listen(PORT , ()=>{
    console.log(`the server ${PORT} `);
})