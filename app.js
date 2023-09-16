require('dotenv').config()
require('./db/db').connect()
const express = require('express');
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/register', async (req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
    }
})
module.exports = app