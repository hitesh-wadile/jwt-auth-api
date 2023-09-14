const app = require('./app')
const {PORT} = process.env



app.listen(PORT, () => {
    console.log(`Server running on the Port ${PORT}`);
})