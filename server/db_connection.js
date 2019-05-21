

const express = require('express')
const mysql = require('mysql')
var cors = require('cors')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const bcrypt = require('bcrypt');
const saltRounds = 0;
const config = require('./config')

const db = mysql.createConnection(config.db)
db.connect()
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())
app.use(function (req, res, next) {
    var token = req.headers.token
    console.log(token)
    // bcrypt.compare(myPlaintextPassword, hash, function (err, res) {
    //     // res == true
    // });
    next()
})
app.use("/uploads", express.static('uploads'))
app.post('/check_token', function (req, res) {
    var token = req.body.token
    db.query("SELECT * FROM user_token WHERE token = ?", token, function (err, results, field) {
        console.log(results)
        if (results.length == 1) {
            res.send({
                haveToken: true
            })
        } else {
            res.send({
                haveToken: false
            })
        }
    })
})

app.post('/get_info', function (req, res) {
    var id = req.body.id
    console.log(id)
    db.query("SELECT * FROM member WHERE id_user = ? ", id, function (err, results, field) {
        console.log(results)
        res.send({
            result: results[0]
        })
    })
})
app.post("/unfriend", function (req, res) {
    var data = req.body
    var id = [parseInt(data.id_user), data.friend_id]

    console.log(id)
    db.query("DELETE FROM friend_list WHERE id_user = ? and friend_id = ? ", id, function (err, result, field) {
        if (err) console.log(err)
        res.send({
            complete: true
        })
        console.log(result)
    })

})

app.post('/get-user', function (req, res) {
    var id = req.body.id_user
    db.query("SELECT * FROM member WHERE id_user = ?", id, function (err, results, field) {
        console.log(err)
        res.send({ result: results })
    })
})
app.post('/edit-profile', upload.single('file'), function (req, res) {

    var info = req.body
    var user = info.user
    var password = info.password
    var firstname = info.firstname
    var lastname = info.lastname
    var email = info.email
    var mobile = info.mobile
    var citizen = info.citizen
    var id = info.id
    console.log(password === "")
    if (password === "") {
        if (req.file == null) {
            var ArrData = [user, firstname, lastname, email, mobile, citizen, id]
            db.query("UPDATE member SET user = ?  ,firstname = ? ,lastname = ? ,email = ? , mobile = ? , citizen = ?  WHERE id_user =?", ArrData, function (err, results, field) {
                if (err) console.log(err)
                console.log('Rows affected:', results.affectedRows);
                res.send({
                    "success": true,
                    "message": "Update to database complete"
                })
            })
        } else {

            var image = req.file.filename
            var ArrData = [user, firstname, lastname, email, mobile, citizen, image, id]
            db.query("UPDATE member SET user = ? ,firstname = ? ,lastname = ? ,email = ? , mobile = ? , citizen = ? , img = ? WHERE id_user =?", ArrData, function (err, results, field) {
                if (err) console.log(err)
                console.log('Rows affected:', results.affectedRows);
                res.send({
                    "success": true,
                    "message": "Update to database complete"
                })
            })
        }
    } else {
        if (req.file == null) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    var ArrData = [user, hash, firstname, lastname, email, mobile, citizen, id]
                    db.query("UPDATE member SET user = ? , password = ? ,firstname = ? ,lastname = ? ,email = ? , mobile = ? , citizen = ?  WHERE id_user =?", ArrData, function (err, results, field) {
                        if (err) console.log(err)
                        console.log('Rows affected:', results.affectedRows);
                        res.send({
                            "success": true,
                            "message": "Update to database complete"
                        })
                    })
                });
            });
        } else {

            var image = req.file.filename
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    var ArrData = [user, hash, firstname, lastname, email, mobile, citizen, image, id]
                    db.query("UPDATE member SET user = ? , password = ? ,firstname = ? ,lastname = ? ,email = ? , mobile = ? , citizen = ? , img = ? WHERE id_user =?", ArrData, function (err, results, field) {
                        if (err) console.log(err)
                        console.log('Rows affected:', results.affectedRows);
                        res.send({
                            "success": true,
                            "message": "Update to database complete"
                        })
                    })
                });
            });
        }
    }
})
app.post('/login', function (req, response) {
    var user = req.body.user
    var password = req.body.password
    var jwt = require('jsonwebtoken');
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
    }, 'secret');
    var data = {
        user: user,
        password: password
    }
    var user_token = {
        user: user,
        token: token
    }

    db.query("SELECT * FROM member WHERE user=?", user, function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) {
            response.send({
                'error': true,
                'message': "User is not found"
            })
        } else {
            console.log(results)
            if (user == results[0].user) {
                var toClient = {
                    id_user: results[0].id_user,
                    token: token
                }
                bcrypt.compare(req.body.password, results[0].password, function (err, res) {

                    if (res) {
                        console.log(results)
                        db.query("INSERT INTO user_token SET ?", user_token, function (error, results, fields) {
                            if (error) throw error;
                            response.send({ 'error': false, 'token': toClient });
                        });
                    } else {
                        response.send({ 'error': true, 'token': token, 'message': "User or password are wrong" });
                    }
                });
            }
        }

    });
})

app.post("/add-friend", function (req, res) {
    var data = {
        id_user: req.body.id_user,
        friend_id: req.body.friend_id
    }
    db.query("INSERT INTO friend_list SET ?", data, function (err, results, field) {
        if (err) return console.error(err.message)
        return res.send({ complete: true })
    })
})
app.post('/get-all-friend', function (req, res) {
    var id = req.body.id_user
    db.query("SELECT member.* FROM friend_list INNER JOIN member ON member.id_user = friend_list.friend_id WHERE friend_list.id_user = ?  ", id, function (err, result, field) {
        console.log(result)
        result.map((data, i) => {
            if (data.id_user == id) {
                result.splice(i, 1)
            }
        })
        res.send({ "result": result })
    })

})
app.post('/users', function (req, res) {
    var id = req.body.id_user
    db.query("SELECT * FROM member WHERE id_user NOT IN (SELECT friend_id FROM friend_list WHERE id_user = ?)", id, function (err, result, field) {
        if (err) console.log(err)
        result.map((data, i) => {
            if (data.id_user == id) {
                result.splice(i, 1)
            }
        })

        res.send({ "result": result })
    })

})
app.post('/signout', function (req, res) {
    var token = req.body
    console.log(token)
    db.query("DELETE FROM user_token WHERE token = ? ", token.token, function (err, result, fields) {
        if (err)
            return console.error(err.message);

        console.log('Deleted Row(s):', result.affectedRows);
        res.send({
            complete: true,
            'Deleted Row(s)': result.affectedRows
        })
    })
})

app.post('/search-friend', function (req, res) {
    console.log("test")
    var data = req.body.data
    var id = req.body.id
    console.log(data)
    if (data == "") {
        res.send({
            empty: true,
            result: {}
        })
    } else {
        db.query("SELECT * FROM member WHERE " + "user LIKE '"
            + data + "%' OR firstname LIKE '"
            + data + "%' OR lastname LIKE '"
            + data + "%' OR email  LIKE '"
            + data + "%' OR mobile LIKE '"
            + data + "%' OR citizen LIKE '"
            + data + "%' ", function (err, result, fields) {
                if (err) console.log(err)
                if (result.length == 0) {
                    res.send({
                        empty: true,
                        result: {}
                    })
                } else {
                    result.map((data, i) => {
                        if (data.id_user == id) {
                            result.splice(i, 1)
                        }
                    })
                    console.log(result)
                    res.send({
                        empty: false,
                        result: result
                    })
                }
            })
    }
})

app.post('/register', upload.single('file'), function (req, res) {
    const user = req.body.user;
    if (!user) {
        console.log("error")
    }
    db.query("SELECT user FROM member WHERE user = ?", user, function (err, results, fields) {
        if (results.length == 0) {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {

                    const data = {
                        user: req.body.user,
                        password: hash,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        citizen: req.body.citizen,
                        img: req.file.filename
                    }
                    db.query("INSERT INTO member SET ?", data, function (error, results, fields) {
                        if (error) throw error;
                        res.send({
                            error: false,
                            data: results,
                            message: 'New user has been created successfully.'
                        });
                    });

                });
            });
        } else {
            if (results[0].user == req.body.user) {
                res.send({ error: true, message: 'User id already' });
            } else {
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {

                        const data = {
                            user: req.body.user,
                            password: hash,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            citizen: req.body.citizen,
                            img: req.file.filename
                        }
                        db.query("INSERT INTO member SET ?", data, function (error, results, fields) {
                            if (error) throw error;
                            res.send({
                                error: false,
                                data: results,
                                message: 'New user has been created successfully.'
                            });
                        });

                    });
                });
            }
        }
    })
});

app.listen('8888', () => {
    console.log('start port 8888')
})
module.exports = app;