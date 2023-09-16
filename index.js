const app = require('./app')
const {PORT} = process.env



app.listen(PORT, () => {
    console.log(`<h1>Server running on the Port ${PORT}</h1>`);
})