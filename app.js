//jshint esversion:6
// require('dotenv').config()
// const express = require('express')
// const bodyparser = require('body-parser')
// const ejs = require("ejs")
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
// const encrypt = require("mongoose-encryption")
// const md5 = require('md5')
// const bcrypt = require("bcrypt")
// const PORT = 3256

// const app = express()

// app.use(express.static("public"))
// app.set("view engine", "ejs")
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

// mongoose.connect("mongodb://127.0.0.1:27017/userDB") 
// .then((iinfo)=>{
//     console.log("Successfullly connected to mongodb")
//     app.listen(PORT,()=>{
//         console.log(`Server is runnig on http://localhost:${PORT}`)
//     })
// })
// .catch((error)=>{
//     console.log("Something went wrong, ERROR : ", error)
// })

// const userSchema = new mongoose.Schema({
//     email : String,
//     password : String
// })

// // // let secret = "Thisisoursecret.";  // 
// // // userSchema.plugin(encrypt, { secret: secret, excludeFromEncryption: ['email'] });                    //  level 2
// // // userSchema.plugin(encrypt, { secret: process.env.SECRETS, encryptedFields: ['password'] });

// const userModel = mongoose.model("user", userSchema)

// const secretsSchema = new mongoose.Schema({
//     secrets : String,
//     user : [userSchema]
// })

// const secretsModel = mongoose.model("secret", secretsSchema)

// app.get("/", (req,res)=>{
//     res.render("home")
// })

// app.get("/login", (req,res)=>{
//     res.render("login")
// })

// app.get("/register", (req,res)=>{
//     res.render("register")
// })

// app.post("/register", async (req,res)=>{


//     const save = userModel({
//         email : req.body.username,
//         password : req.body.password          // level 1 and 2
//     //     // password : md5(req.body.password)  // level 3
//     //     password : md5(req.body.password)
//     })
//     await save.save()

//     res.redirect("/")
//     ////////////////////////////////////////////////////////////////////////////// level 4
//     // bcrypt.genSalt(10, (err,salt)=>{
//     //     if(err) {
//     //         console.log("error while generating salt", err)
//     //         res.render('/register')
//     //      }
//     //      else {
//     //         bcrypt.hash(req.body.password, salt, async (err,hashedPassword)=>{
//     //             if (err) {
//     //                 console.log("error while generating hash", err)
//     //                 res.redirect('/register')
                    
//     //             } else {
//     //                 const save = userModel({
//     //                     email : req.body.username,
//     //                     password : hashedPassword
//     //                 })
//     //                 await save.save()
//     //                 res.redirect("/")

                    
//     //             }
//     //         })
//     //      }

//     // })
// })

// app.post("/login", async (req,res)=>{
//     // const userPresent = await userModel.findOne({email : req.body.username}, function (err,user){
//           const userPresent = await userModel.findOne({email : req.body.username })
//         if (!userPresent) {
//             console.log("err", err)
//             res.json({
//                 msg : "False"
//             })
//                                                                            //  LVL 1 and level 2
//         } else {
//             // if(user){
//                 if(userPresent.password === req.body.password)
//                 res.render("secrets")
            // }
        // }
    // })

//     /////////////////////////////////////////////////////////////////////////////////////////
//     // const userPresent = await userModel.findOne({email : req.body.username })
//     // console.log("req.", req.body.password);
//     // console.log("userPresent", userPresent)
//     // if(userPresent){
//     // if (userPresent.password == md5(req.body.password)) {                         //level 3
//     //     res.render("secrets")
//     // }
        
//     // } else {
//     //     // alert("Username password is not correct")
//     //     console.log("not authenticated")
        
//     //     res.render("login")
        
//     // }
//     ////////////////////////////////////////////////////////////////////////////////////// level 4

//     // const userDetails = await userModel.findOne({email : req.body.username})
//     // console.log("req.body.email", req.body.username)
//     // console.log("userDetails", userDetails);
//     // if (userDetails) {
//     //     const matched = await bcrypt.compare(req.body.password,userDetails.password)
//     //     console.log("matched", matched)
//     //     if (matched) {
//     //         res.render('secrets')
            
//     //     } else {
            
//     //             res.render("login")
//     //     }
        
//     // } else {
//     //     console.log("user not found")
//     //     res.render("login") 
        
//     // }
    

// })
// app.get("/home", (req,res)=>{
//     res.render("home")
// })

// app.get("/submit", (req,res)=>{
//     res.render("submit")
// })

// app.post("/submit", async (req,res)=>{
//     const secrets = secretsModel({
//         secrets : req.body.secret,
//         user : req.body.dsf
//     })
//     await secrets.save()

//     res.render("secrets")
// })


//////////////////////////////////////// level 5 Authentication using Cookies and session Started

require('dotenv').config()
const express = require('express')
const bodyparser = require('body-parser')
const ejs = require("ejs")
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require("passport")
const passportLocalMongoose = require('passport-local-mongoose')

const PORT = 3256

const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({                           // https://www.npmjs.com/package/express-session
    secret : "This is Secret",
    resave : false,
    saveUninitialized : false
}))

app.use(passport.initialize());
app.use(passport.session())


mongoose.connect("mongodb://127.0.0.1:27017/userDB") 
.then((iinfo)=>{
    console.log("Successfullly connected to mongodb")
    app.listen(PORT,()=>{
        console.log(`Server is runnig at http://localhost:${PORT}`)
    })
})
.catch((error)=>{
    console.log("Something went wrong, ERROR : ", error)
})
// mongoose.set('useCreateIndex', true) // in case of deprecated warning

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

userSchema.plugin(passportLocalMongoose)

const userModel = mongoose.model("user", userSchema)

passport.serializeUser(userModel.serializeUser())  // Generate cookies
passport.deserializeUser(userModel.deserializeUser()) // Destroy cookies

// const secretsSchema = new mongoose.Schema({
//     secrets : String,
//     user : [userSchema]
// })
// const secretsModel = mongoose.model("secret", secretsSchema)

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/login", (req,res)=>{
    res.render("login")
})

app.get("/register", (req,res)=>{
    res.render("register")
})

app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated){
        console.log(Object.keys(req))
        console.log(req.isAuthenticated)
        res.render("secrets")
    } else {
        res.redirect("/login")
    }
})

app.get("/logout", (req,res)=>{
    req.logout()
    res.redirect("/")
})

app.post("/register", async (req,res)=>{
    userModel.register({username : req.body.username}, req.body.password, (error, result)=>{  // though we have defined email in userSchema we store username as "username" because of passport documentation 
        if (error) {
            console.log("error while registering", error)
            res.redirect("/register")

            
        } else {
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets")
            })
            
        }
    })

})

app.post("/login", async (req,res)=>{   // https://www.passportjs.org/concepts/authentication/login/
    const user = new userModel({
        username : req.body.username,      // same here for username instead of email, 
        password : req.body.password
    })
    req.login(user, (error, result)=>{
        if (error) {
            console.log("error while login user", error)
            // res.redirect('/reigste')
            
        } else {
            
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets")
            })
        }
    })

})

app.get("/home", (req,res)=>{
    req.logout((err)=>{
        if (err) {
            console.log("error while logout ", err)
            
        }
    res.redirect("/")
    })
})

app.get("/submit", (req,res)=>{
    res.render("submit")
})

app.post("/submit", async (req,res)=>{
    const secrets = secretsModel({
        secrets : req.body.secret,
        user : req.body.dsf
    })
    await secrets.save()

    res.render("secrets")
}) 
//////////////////////////////////////// level 5 Authentication using Cookies and session End



//////////////////////////////////////// level 6 Authentication using OAuth Started

// require('dotenv').config()
// const express = require('express')
// const bodyparser = require('body-parser')
// const ejs = require("ejs")
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
// const PORT = 3256

// const app = express()

// app.use(express.static("public"))
// app.set("view engine", "ejs")
// app.use(bodyParser.urlencoded({
//     extended: true
// }))

// mongoose.connect("mongodb://127.0.0.1:27017/userDB") 
// .then((iinfo)=>{
//     console.log("Successfullly connected to mongodb")
//     app.listen(PORT,()=>{
//         console.log(`Server is runnig at http://localhost:${PORT}`)
//     })
// })
// .catch((error)=>{
//     console.log("Something went wrong, ERROR : ", error)
// })

// const userSchema = new mongoose.Schema({
//     email : String,
//     password : String
// })

// const userModel = mongoose.model("user", userSchema)

// const secretsSchema = new mongoose.Schema({
//     secrets : String,
//     user : [userSchema]
// })
// const secretsModel = mongoose.model("secret", secretsSchema)

// app.get("/", (req,res)=>{
//     res.render("home")
// })

// app.get("/login", (req,res)=>{
//     res.render("login")
// })

// app.get("/register", (req,res)=>{
//     res.render("register")
// })

// app.post("/register", async (req,res)=>{

// })

// app.post("/login", async (req,res)=>{

// })

// app.get("/home", (req,res)=>{
//     res.render("home")
// })

// app.get("/submit", (req,res)=>{
//     res.render("submit")
// })

// app.post("/submit", async (req,res)=>{
//     const secrets = secretsModel({
//         secrets : req.body.secret,
//         user : req.body.dsf
//     })
//     await secrets.save()

//     res.render("secrets")
// }) 
//////////////////////////////////////// level 6 Authentication using OAuth Ended
