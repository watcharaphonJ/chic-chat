var mysql = require('mysql');
var express = require('express')
const router = express.Router()
const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: 'chic_chat'
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
module.exports = con;
app.get('/', function (req, res) {

    con.query('SELECT * FROM member', function (err, res, field) {
        if (err) throw err;
        console.log(res)
        res.json(res)

    })
})
