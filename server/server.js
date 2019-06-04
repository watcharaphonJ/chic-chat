

const express = require('express')
const mysql = require('mysql')
var cors = require('cors')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const bcrypt = require('bcrypt');
var request = require('request-promise');
var http = require('http');
const config = require('./config')
const saltRounds = 0;
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailPassword.email, // your email
        pass: config.emailPassword.password // your email password
    }
});

const db = mysql.createConnection(config.db)
db.connect()
const app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())
app.use("/uploads", express.static('uploads'))
app.enable('trust proxy');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});
app.post('/check_token', function (req, res, next) {
    var token = req.body.token
    db.query("SELECT * FROM user_token WHERE token = ?", token, function (err, results, field) {
        if (err) next(err)
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

app.post('/get_info', function (req, res, next) {
    var id = req.body.id
    console.log(id)
    db.query("SELECT * FROM member WHERE id_user = ? ", id, function (err, results, field) {
        if (err) next(err)
        console.log(results)
        res.send({
            result: results[0]
        })
    })
})
app.post("/unfriend", function (req, res, next) {
    var data = req.body
    var id = [parseInt(data.id_user), data.friend_id]

    console.log(id)
    db.query("DELETE FROM friend_list WHERE id_user = ? and friend_id = ? ", id, function (err, result, field) {
        if (err) next(err)
        res.send({
            complete: true
        })
        console.log(result)
    })

})

app.post('/get-user', function (req, res, next) {
    var id = req.body.id_user
    db.query("SELECT * FROM member WHERE id_user = ?", id, function (err, results, field) {
        if (err) next(err)
        res.send({ result: results })
    })
})
app.post('/edit-profile', upload.single('file'), function (req, res, next) {

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
                if (err) next(err)
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
                if (err) next(err)
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
                        if (err) next(err)
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
                        if (err) next(err)
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


app.post('/login', function (req, response, next) {
    var user = req.body.user
    var password = req.body.password
    var res = req.body.capcha
    var secretekey = config.recaptcha.secret

    var data = {
        user: user,
        password: password
    }

    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
    }, 'secret');
    var user_token = {
        user: user,
        token: token
    }
    var options = {
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        form: {
            secret: secretekey,
            response: res,
        },
        json: true // Automatically stringifies the body to JSON
    };
    if (res) {
        request(options)
            .then((resp) => {
                if (!resp.success) {
                    return response.send({ err: resp.error - codes })
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    db.query("SELECT * FROM member WHERE user=?", user, function (err, results, fields) {
        if (err) next(err)
        if (results.length == 0) {
            return response.send({
                'error': true,
                'message': "User is not found"
            })
        } else {
            if (user == results[0].user) {
                var toClient = {
                    id_user: results[0].id_user,
                    token: token
                }
                bcrypt.compare(req.body.password, results[0].password, function (err, res) {
                    if (res) {
                        db.query("INSERT INTO user_token SET ?", user_token, function (err, result, fields) {
                            if (err) next(err)
                            var logError = {
                                id_user: results[0].id_user,
                                log_info: "success",
                                lat: req.body.lat,
                                lng: req.body.lng
                            }
                            console.log(logError)
                            db.query("INSERT INTO log_error SET ?", logError, function (err, result, field) {
                                if (err) next(err)
                                return response.send({ 'error': false, 'token': toClient });
                            })
                        });
                    } else {
                        var logError = {
                            id_user: results[0].id_user,
                            log_info: "Failed : Wrong password",
                            lat: req.body.lat,
                            lng: req.body.lng
                        }
                        db.query("INSERT INTO log_error SET ?", logError, function (err, result, field) {
                            if (err) next(err)
                            return response.send({ 'error': true, 'message': "password are wrong" });
                        })
                    }
                });
            } else {
                var logError = {
                    id_user: results[0].id_user,
                    log_info: "Failed : Wrong user",
                    lat: req.body.lat,
                    lng: req.body.lng
                }
                db.query("INSERT INTO log_error SET ?", logError, function (err, result, field) {
                    if (err) next(err)
                    return response.send({ 'error': true, 'token': token, 'message': "User are wrong" });
                })
            }
        }
    });
})

app.post("/add-friend", function (req, res, next) {
    var data = {
        id_user: req.body.id_user,
        friend_id: req.body.friend_id
    }
    db.query("INSERT INTO friend_list SET ?", data, function (err, results, field) {
        if (err) next(err)
        return res.send({ complete: true })
    })
})
app.post('/get-all-friend', function (req, res, next) {
    var id = req.body.id_user
    db.query("SELECT member.* FROM friend_list INNER JOIN member ON member.id_user = friend_list.friend_id WHERE friend_list.id_user = ?  ", id, function (err, result, field) {
        if (err) next(err)
        result.map((data, i) => {
            if (data.id_user == id) {
                result.splice(i, 1)
            }
        })
        res.send({ "result": result })
    })

})
app.post('/users', function (req, res, next) {
    var id = req.body.id_user
    db.query("SELECT * FROM member WHERE id_user NOT IN (SELECT friend_id FROM friend_list WHERE id_user = ?)", id, function (err, result, field) {
        if (err) next(err)
        result.map((data, i) => {
            if (data.id_user == id) {
                result.splice(i, 1)
            }
        })

        res.send({ "result": result })
    })

})
app.post('/signout', function (req, res, next) {
    var token = req.body
    console.log(token)
    db.query("DELETE FROM user_token WHERE token = ? ", token.token, function (err, result, fields) {
        if (err) next(err)

        console.log('Deleted Row(s):', result.affectedRows);
        res.send({
            complete: true,
            'Deleted Row(s)': result.affectedRows
        })
    })
})

app.post('/search-friend', function (req, res, next) {
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
                if (err) next(err)
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
app.post('/reset', function (req, res, next) {
    var email = req.body.email

    db.query("SELECT email FROM member WHERE email = ?", email, function (err, result, field) {
        if (result.length == 0) {
            res.send({
                complete: true, message: "This email not in database"
            })
        } else {
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: email
            }, 'secret');

            let mailOptions = {
                from: config.emailPassword.email,                // sender
                to: email,                // list of receivers
                subject: 'Reset Password',              // Mail subject
                html: '<a href="http://localhost:3000/set-password/?token=' + token + '">Link reset password </a>'
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) next(err)

                else {
                    console.log(info)
                    const data = {
                        email: email,
                        token: token
                    }
                    db.query("INSERT INTO token_reset_password SET ?", data, function (err, result, field) {
                        if (err) next(err)
                        res.send({
                            complete: true, message: ""
                        })
                    })
                }
            });

        }
    })
})
app.post('/setNewPassword', function (req, res, next) {

    var token = req.body.data.token
    var password = req.body.data.password

    db.query("SELECT email FROM token_reset_password WHERE token = ?", token, function (err, result, field) {
        if (err) next(err)
        var email = result[0].email
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                var ArrData = [hash, email]
                console.log(ArrData)

                db.query("UPDATE member SET password = ? WHERE email =?", ArrData, function (err, results, field) {
                    if (err) next(err)
                    else {
                        console.log("update password success");
                        res.send({
                            "success": true,
                            "message": "Update to database complete"
                        })
                    }
                })

            });
        });
    })
})

app.post('/register', upload.single('file'), function (req, res, next) {
    const user = req.body.user;
    const email = req.body.email
    const data = [user, email]
    if (!user) {
        console.log("error")
    }
    db.query("SELECT * FROM member WHERE user = ? or email = ?", data, function (err, results, fields) {
        if (err) next(err)
        console.log(results)
        console.log(req.body.email)
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
                        if (error) next(error);
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
                return res.send({ error: true, message: 'User is already' });
            }
            if (results[0].email == req.body.email) {
                return res.send({ error: true, message: 'Email is already' });
            }

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
                        if (error) next(error);
                        res.send({
                            error: false,
                            data: results,
                            message: 'New user has been created successfully.'
                        });
                    });

                });
            });

        }
    })
});

app.use(function (err, req, res, next) {
    res.status(500).json({ error: err.message })
})
const server = http.createServer(app);
const io = require('socket.io')(server);

// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')

    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
    })

    // ส่งข้อมูลไปยัง Client ทุกตัวที่เขื่อมต่อแบบ Realtime
    client.on('sent-message', function (message) {
        io.sockets.emit('new-message', message)
    })
})
server.listen(8888, "0.0.0.0");
module.exports = app;