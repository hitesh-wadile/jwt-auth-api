require('dotenv').config()
require('./db/db').connect()

const User = require('./model/user')
const express = require('express');
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()

const {JWT_SECRET_STRING} = process.env

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/register', async (req,res)=>{
    try {
        const {firstname,lastname, email, password} = req.body

        if(!(firstname && lastname && email && password)){
            res.send(400).send('All Fields are Required')
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            res.send(401).send('User Already Exists')
        }

        const encryptedPassword = await bycrypt.hash(password,10)

        const user = await User.create({
            firstname,
            lastname,
            email,
            password : encryptedPassword
        })

        const token = jwt.sign(
            {id : user._id, email : user.email},
            JWT_SECRET_STRING,
            {expiresIn : "2h"}
        )

        user.token = token
        user.password = undefined

        res.status(201).json(user)

    } catch (error) {
        console.log(error);
    }
})

app.post('/login', async (req,res)=>{
    try {
        const {email,password} = req.body

        if(!(email && password)){
            res.status(400).send('Invalid Fields')
        }

        const user = await User.findOne({email})

        // if(!(user)){
        //     res.redirect('/register')
        // }

        const passwordMatched = await bycrypt.compare(password,user.password)
        if(passwordMatched){
            const token = jwt.sign(
                {id: user._id},
                JWT_SECRET_STRING,
                {
                    expiresIn : "2h"
                }
            )
            
            user.token = token
            user.password = undefined
        }
        

        const options = {
            expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly : true
        }

        res.status(200).cookie("token",token,options).json({
            success : true,
            token,
            user
        })
    } catch (error) {
        console.log(error);
    }
})
module.exports = app