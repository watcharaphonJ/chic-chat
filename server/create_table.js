
const mysql = require('mysql')
const config = require('./config')
const connection = mysql.createConnection(config.db)
connection.connect(function (err) {
    if (err) console.log(err)
    let createTokenResetPassword = "CREATE TABLE IF NOT EXISTS token_reset_password (" +
        "id_token int(11) AUTO_INCREMENT PRIMARY KEY  NOT NULL," +
        "email text NOT NULL," +
        "token text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  NOT NULL)" +
        "ENGINE = InnoDB AUTO_INCREMENT = 26 DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci"
    let createMember = "CREATE TABLE IF NOT EXISTS member (" +
        "id_user INT(11) AUTO_INCREMENT  PRIMARY KEY NOT NULL ," +
        "user VARCHAR(16) COLLATE utf8_unicode_ci NOT NULL," +
        "password VARCHAR(70) COLLATE utf8_unicode_ci NOT NULL, " +
        "firstname TEXT COLLATE utf8_unicode_ci NOT NULL, " +
        "lastname TEXT COLLATE utf8_unicode_ci NOT NULL, " +
        "email TEXT COLLATE utf8_unicode_ci NOT NULL, " +
        "mobile VARCHAR(10) COLLATE utf8_unicode_ci NOT NULL," +
        "citizen TEXT COLLATE utf8_unicode_ci NOT NULL," +
        "img TEXT COLLATE utf8_unicode_ci NOT NULL ) " +
        "ENGINE = InnoDB AUTO_INCREMENT = 26 DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci";

    let createFriendList = "CREATE TABLE IF NOT EXISTS friend_list (" +
        "id_user int(11) unsigned NOT NULL," +
        "friend_id int(11) NOT NULL" +
        " ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci"

    let createUserToken = "CREATE TABLE IF NOT EXISTS user_token (" +
        "id_token int(11) AUTO_INCREMENT NOT NULL ," +
        "user varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL," +
        "token text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL," +
        "PRIMARY KEY (`id_token`)" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci"

    connection.query(createMember, function (err, results, fields) {
        if (err) console.log(err);
        console.log(results)
    });
    connection.query(createTokenResetPassword, function (err, results, fields) {
        if (err) console.log(err);
        console.log(results)
    });
    connection.query(createFriendList, function (err, results, fields) {
        if (err) console.log(err);
        console.log(results)
    });
    connection.query(createUserToken, function (err, results, fields) {
        if (err) console.log(err);
        console.log(results)
    });
    connection.end(function (err) {
        if (err) return console.log(err.message);
    });
})







