const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
var bodyParser = require('body-parser')
var mysql = require('mysql');

var conection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pokdeng"
});

conection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/users/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    conection.query(`select * from users where username = '${username}' and password = '${password}'`, function (error, results, fields) {
        try {
            if (error) throw error;
            res.json({
                status_code: 200,
                message: "Successful",
                data: {
                    name: results[0].username,
                    money: results[0].money
                }
            })
        }
        catch (error) {
            res.json({
                status_code: 401,
                message: "Error",
            }, 401)
        }
    });
})

app.post('/users/create', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    conection.query(`insert into users (username, password, money) VALUE ('${username}', '${password}', '${500.00}')`, function (error, results, fields) {
        try {
            if (error) throw error;
            res.json({
                status_code: 201,
                message: "Successful",
            })
        }
        catch (error) {
            res.json({
                status_code: 401,
                message: "Error",
            }, 401)
        }
    });
})

app.post("/users/change", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let new_password = req.body.new_password
    let confirm_new_password = req.body.confirm_new_password
    conection.query(`select username, password from users where username = '${username}' and password = '${password}'`, function (error, results, fields) {
        try {
            if ((new_password == confirm_new_password)) {
                conection.query(`update users set password = '${new_password}' where username = '${username}'`)
                res.json({
                    status_code: 201,
                    massage: "Change password",
                    users: results[0].username,
                    new_password: new_password
                })
            }
            else {
                res.json({
                    status_code: 401,
                    message: "Password is not relevant.",
                }, 401)
            }
        }
        catch (error) {
            res.json({
                status_code: 401,
                message: "Error",
            }, 401)
        }
    });
})

app.post('/users/create_room', (req, res) => {
    let username = req.body.username
    let room_id = Math.floor(Math.random() * 10000)
    let room_user_id = Math.floor(Math.random() * 10000)
    let room_name = req.body.room_name
    let password = req.body.password
    conection.query(`select user_id from users where username = '${username}'`, function (error, results, fields) {
        let user_id = results[0].user_id
        try {
            conection.query(`insert into room (room_id, name, password) VALUE ('${room_id}', '${room_name}', '${password}')`);
            conection.query(`insert into room_user (room_user_id, user_id, room_id, result_point, bet) VALUE ('${room_user_id}', '${user_id}', '${room_id}', ${0}, ${0})`);
            if (error) throw error;
            res.json({
                status_code: 201,
                message: "Successful"
            })
        }
        catch (error) {
            res.json({
                status_code: 401,
                message: "Error",
            }, 401)
        }
    });
})

app.post('/users/join_room', (req, res) => {
    let username = req.body.username
    let room_id = req.body.room_id
    let password = req.body.password
    conection.query(`select user_id from users where username = '${username}'`, function (error, results_user, fields) {
        conection.query(`select * from room where room_id = '${room_id}'`, function (error, results_room, fields) {
            let user_id = results_user[0].user_id
            let use_id_room = results_room[0].room_id
            let password_room = results_room[0].password
            let room_user_id = Math.floor(Math.random() * 10000)
            if (password == password_room) {
                try {
                    conection.query(`insert into room_user (room_user_id, user_id, room_id, result_point, bet) VALUE ('${room_user_id}', '${user_id}', '${use_id_room}', ${0}, ${0})`);
                    if (error) throw error;
                    res.json({
                        status_code: 201,
                        message: "Successful"
                    })
                }
                catch (error) {
                    res.json({
                        status_code: 401,
                        message: "Error",
                    }, 401)
                }
            } else {
                res.json({
                    status_code: 404,
                    massage: "Incorrect password"
                })
            }
        })
    });
})

app.post('/users/bet', (req, res) => {
    let user_id = req.body.user_id
    let del_money = req.body.del_money
    conection.query(`select user_id, username, money from users where user_id = '${user_id}'`, function (error, results, fields) {
        try {
            if (error) throw error;
            let current_money = parseInt(results[0].money);
            let deleted_money = current_money - parseInt(del_money);
            if (del_money <= 0) {
                res.json({
                    message: "ฮั่นแน่!!! จะโกงหรอจร้ะ ดักไว้แล้วจร้าาา",
                    banned:{
                        massage:"จะทำการแบนผู้เล่น ข้อหาคิดจะลองดีกับระบบ",
                        username:results[0].username
                    }
                })
            } else if (current_money >= del_money) {
                conection.query(`update room_user set bet = ${del_money} where user_id = '${user_id}'`);
                conection.query(`update users set money = ${deleted_money} where user_id = '${user_id}'`);
                res.json({
                    status_code: 200,
                    message: "Successful",
                    data: {
                        name: results[0].username,
                        money: deleted_money
                    }
                })
            } else {
                res.json({
                    message: "จำนวนเงินไม่เพียงพอ"
                })
            }
        } catch (error) {
            res.json({
                status_code: 401,
                message: "Error"
            }, 401)
        }
    })
})

function calcualte_point(user_id, res) {
    conection.query(`select * from room_user where user_id = '${user_id}'`, function (error, results_room, fields) {
        let room_user_id = results_room[0].room_user_id
        conection.query(`select * from room_user_card where room_user_id = '${room_user_id}'`, function (error, results, fields) {
            array = []
            if (error) throw error;
            let sum_point = 0
            for (let index = 0; index < results.length; index++) {
                sum_point += results[index].point
            }
            while (true) {
                if (sum_point >= 10) {
                    sum_point -= 10
                } else {
                    break
                }
            }
            conection.query(`update room_user set result_point = ${sum_point} where room_user_id = '${room_user_id}'`);
        })
    })
}

function checkcard(user_id, card_id_check, room_id, room_user_id, point_card, bet, res) {
    conection.query(`select card_id from room_user_card where card_id = '${card_id_check}' and room_id = '${room_id}'`, function (error, results, fields) {
        let count = 0
        console.log(results.length)
        if (count == 2) {
            return
        } else {
            if (results.length >= 1) {
                conection.query(`select * from card`, function (error, results_card, fields) {
                    let card = Math.floor(Math.random() * 53)
                    let card_id_new = results_card[card - 1].card_id
                    let point = results_card[card - 1].point
                    console.log(card_id_new)
                    checkcard(card_id_new, room_id, room_user_id, point)
                })
            } else {
                count++
                if (bet > 0) {
                    conection.query(`insert into room_user_card (room_user_id, card_id, room_id, point) VALUE ('${room_user_id}', '${card_id_check}', '${room_id}', '${point_card}')`);
                    function sleep(ms) {
                        return new Promise(resolve => setTimeout(resolve, ms));
                    }
                    async function demo() {
                        await sleep(1000);
                        calcualte_point(user_id, res)
                    }
                    demo();
                    return
                }
            }
        }
    })
}

app.post('/users/start_game', (req, res) => {
    let room_id = req.body.room_id
    conection.query(`select * from room_user where room_id = '${room_id}'`, function (error_room, results_room, fields) {
        conection.query(`select * from card`, function (error, results_card, fields) {
            try {
                for (let i = 0; i < results_room.length; i++) {
                    let room_user_id = results_room[i].room_user_id
                    let user_id = results_room[i].user_id
                    let bet = results_room[i].bet
                    let count = 0;
                    while (true) {
                        let card = Math.floor(Math.random() * 53)
                        let card_id = results_card[card - 1].card_id
                        let point = results_card[card - 1].point
                        if (count == 2) {
                            break;
                        } else {
                            count++
                            checkcard(user_id, card_id, room_id ,room_user_id, point, bet, res)
                        }
                    }
                }
            }
            catch (error_room) {
                res.status(401).json({
                    massage:"Error"
                }, 401)
            }
        })
    });
})

app.post('/users/getAcard', (req, res) => {
    let user_id = req.body.user_id
    conection.query(`select * from room_user where user_id = '${user_id}'`, function (error, results_room, fields) {
        conection.query(`select * from card`, function (error, results_card, fields) {
            try {
                if (error) throw error;
                let list_room_id = results_room
                let room_id = results_room[0].room_id
                let bet = results_room[0].bet
                for (let i = 0; i < list_room_id.length; i++) {
                    let room_user_id = results_room[i].room_user_id
                    let card = Math.floor(Math.random() * 53)
                    let card_id = results_card[card - 1].card_id
                    let point = results_card[card - 1].point
                    checkcard(user_id, card_id, room_id ,room_user_id, point, bet)
                    res.json({
                        status_code: 201,
                        message: "Successful"
                    })
                }
            res.json({
                status_code: 200,
                message: "Successful"
            })
            } catch (error) {
                res.json({
                    status_code: 401,
                    message: "Error",
                }, 401)
            }
        })
    })
})

app.post('/users/calcualte_point', (req, res) => {
    let user_id = req.body.user_id
    conection.query(`select * from room_user where user_id = '${user_id}'`, function (error, results_room, fields) {
        let room_user_id = results_room[0].room_user_id
        conection.query(`select * from room_user_card where room_user_id = '${room_user_id}'`, function (error, results, fields) {
            try {
                if (error) throw error;
                let sum = 0
                for (let index = 0; index < results.length; index++) {
                    sum += results[index].point
                }
                while (true) {
                    if (sum >= 10) {
                        sum -= 10
                    } else {
                        break
                    }
                }
                conection.query(`update room_user set result_point = ${sum} where room_user_id = '${room_user_id}'`);
                res.json({
                    status_code: 200,
                    message: "Successful",
                    point: sum
                })
            } catch (error) {
                res.json({
                    status_code: 401,
                    message: "Error",
                }, 401)
            }
        })
    })
})

app.post('/users/finish', (req, res) => {
    let room_id = req.body.room_id
    try {
    conection.query(`select * from room_user where room_id = '${room_id}'`, function (error, results_room, fields) {
        let data = results_room
        let room_point = []
        for (let index = 0; index < data.length; index++) {
            room_point.push(data[index].result_point)
        }
        let max_point = Math.max(...room_point)
        conection.query(`select * from room_user where room_id = '${room_id}' and result_point = '${max_point}'`, function (error, winner, fields) {
            for (let i = 0; i < winner.length; i++) {
                conection.query(`select username, money from users where user_id = '${winner[i].user_id}'`, function (error, results, fields) {
                    let current_money = parseInt(results[0].money);
                    let added_money = parseInt(winner[i].bet) + current_money;
                    conection.query(`update users set money = ${added_money} where user_id = '${winner[i].user_id}'`);
                })              
            }
        })
    })
    conection.query(`delete from room_user_card where room_id = '${room_id}'`)
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function demo() {
        await sleep(1000);
        conection.query(`update room_user set result_point = ${0},bet = ${0} where room_id = '${room_id}'`);
    }
    demo();
        res.json({
            status_code: 201,
            message: "Successful"
        })
    }
    catch (error) {
        res.json({
            status_code: 401,
            message: "Error",
        }, 401)
    }
})



app.listen(port, () => {
    console.log(`Example app listening on port 1${port}`)
})