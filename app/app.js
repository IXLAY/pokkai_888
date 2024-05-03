const mysql = require('mysql2')
const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
var bodyParser = require('body-parser')

var conection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pokdeng"
});

con = conection.promise();
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
            res.status(200).json({
                message: "Successful",
                data: {
                    user_id: results[0].user_id,
                    name: results[0].username,
                    money: results[0].money
                }
            })
        }
        catch (error) {
            res.status(401).json({
                message: "Error"
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
            res.status(201).json({
                message: "Successful"
            })
        }
        catch (error) {
            res.status(401).json({
                message: "Error"
            }, 401)
        }
    });
})

app.post("/users/change_password", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let new_password = req.body.new_password
    let confirm_new_password = req.body.confirm_new_password
    conection.query(`select username, password from users where username = '${username}' and password = '${password}'`, function (error, results, fields) {
        try {
            if (results.length > 0) {
                if ((new_password == confirm_new_password)) {
                    conection.query(`update users set password = '${new_password}' where username = '${username}'`)
                    res.status(201).json({
                        message: "Change password Successful"
                    })
                }
                else {
                    res.status(204).json({
                        message: "Password is not relevant."
                    })
                }
            } else {
                res.status(404).json({
                    message: "Wrong Password"
                })
            }
        }
        catch (error) {
            res.status(401).json({
                message: "Error"
            }, 401)
        }
    });
})

app.post('/users', (req, res) => {
    let user_id = req.body.user_id
    conection.query(`select user_id, username, money, round, winrate, level from users where user_id = '${user_id}'`, function (error, results, fields) {
        try {
            if (error) throw error;
            res.status(201).json({
                message: "Successful",
                data: results
            })
        }
        catch (error) {
            res.status(401).json({
                message: "Error"
            }, 401)
        }
    });
})

app.post('/users/show_room', (req, res) => {
    conection.query(`select room_id, name, password, people from room`, function (error, results, fields) {
        try {
            res.status(201).json({
                message: "Successful",
                data: results
            })
        }
        catch (error) {
            res.status(401).json({
                message: "Error"
            }, 401)
        }
    });
})

app.post('/users/change_username', (req, res) => {
    let username = req.body.username
    let new_username = req.body.new_username
    conection.query(`update users set username = '${new_username}' where username = '${username}'`, function (error, results, fields) {
        try {
            if (error) throw error;
            res.status(201).json({
                message: "Successful",
                new_username: new_username
            })
        }
        catch (error) {
            res.status(401).json({
                message: "Error"
            }, 401)
        }
    });
})

app.post('/users/create_room', (req, res) => {
    let user_id = req.body.user_id
    let room_id = Math.floor(Math.random() * 10000)
    let room_bot_id = Math.floor(Math.random() * 10000)
    let room_user_id = Math.floor(Math.random() * 10000)
    let room_name = req.body.room_name
    let password = req.body.password
    try {
        conection.query(`insert into room (room_id, name, people, password) VALUE ('${room_id}', '${room_name}', ${1}, '${password}')`);
        conection.query(`insert into room_user (room_user_id, user_id, room_id, result_point, bet, chair, bot) VALUE ('${room_bot_id}', '${0}', '${room_id}', ${0}, ${0}, ${0}, ${true})`);
        conection.query(`insert into room_user (room_user_id, user_id, room_id, result_point, bet, chair, bot) VALUE ('${room_user_id}', '${user_id}', '${room_id}', ${0}, ${0}, ${0}, ${false})`);
        if (password == "") {
            res.status(201).json({
                message: "Successful",
                room_id: room_id,
                room_bot_id: room_bot_id,
                room_user_id: room_user_id,
                password: "none",
                people: 1
            }) 
        } else {
            res.status(201).json({
                message: "Successful",
                room_id: room_id,
                room_bot_id: room_bot_id,
                room_user_id: room_user_id,
                password: password,
                people: 1
            }) 
        }
    }
    catch {
        res.status(401).json({
            message: "Error"
        }, 401)
    }
})

app.post('/users/join_room', (req, res) => {
    let user_id = req.body.user_id
    let room_id = req.body.room_id
    let password = req.body.password
    conection.query(`select * from room where room_id = '${room_id}'`, function (error, results_room, fields) {
        let room_user_id = Math.floor(Math.random() * 10000)
        if (results_room[0].people < 5) {
            if (results_room[0].password == "") {
                try {
                    conection.query(`insert into room_user (room_user_id, user_id, room_id, result_point, bet, chair, bot) VALUE ('${room_user_id}', '${user_id}', '${results_room[0].room_id}', ${0}, ${0}, ${0}, ${false})`);
                    let people = parseInt(results_room[0].people) + 1
                    conection.query(`update room set people = ${people} where room_id = '${room_id}'`)
                    res.status(200).json({
                        message: "Successful",
                        room_user_id: room_user_id
                    })
                }
                catch (error) {
                    res.status(401).json({
                        message: "Error"
                    }, 401)
                }
            } else {
                if (password == results_room[0].password) {
                    try {
                        conection.query(`insert into room_user (room_user_id, user_id, room_id, result_point, bet, chair, bot) VALUE ('${room_user_id}', '${user_id}', '${results_room[0].room_id}', ${0}, ${0}, ${0}, ${false})`);
                        let people = parseInt(results_room[0].people) + 1
                        conection.query(`update room set people = ${people} where room_id = '${room_id}'`)
                        res.status(200).json({
                            message: "Successful"
                        })
                    }
                    catch (error) {
                        res.status(401).json({
                            message: "Error"
                        }, 401)
                    }
                } else {
                    res.status(404).json({
                        massage: "Incorrect password."
                    }, 404)
                }
            }
        } else {
            res.status(401).json({
                message: "The number of people in the room had reached its maximum."
            }, 401)
        }
    })
})

app.post('/users/choose_chair', async (req, res) => {
    let user_id = req.body.user_id
    let room_id = req.body.room_id
    let chair = req.body.chair
    const [result] = await con.query(`select * from room_user where room_id = '${room_id}'`)
    try {
        count = 0
        for (let index = 0; index < result.length; index++) {
            if (result[index].chair == chair) {
                count ++
                break;
            } else {
                continue;
            }
        }
        if (count >= 1) {
            res.status(201).json({
                message: "Seat occupied"
            })
        } else {
            conection.query(`update room_user set chair = ${chair} where user_id = '${user_id}' and room_id = '${room_id}'`);
            res.status(201).json({
                message: "Successful",
                user_id: user_id,
                sitONtable: chair
            })
        }
    }
    catch (error) {
        res.status(401).json({
            message: "Error"
        }, 401)
    }
})

app.post('/users/show_chair', async (req, res) => {
    let room_id = req.body.room_id
    try {
        let sql = `select users.username, room_user.bet, room_user.chair from room_user LEFT JOIN users ON room_user.user_id = users.user_id where room_id = '${room_id}'`
        conection.query(sql, function (error, result) {
            res.status(201).json({
                message: "Successful",
                data: result
            })
        })
    }
    catch (error) {
        res.status(401).json({
            message: "Error"
        }, 401)
    }
})

app.post('/users/bet', async (req, res) => {
    let user_id = req.body.user_id
    let room_id = req.body.room_id
    let bet = req.body.bet
    const [resultUsers] = await con.query(`select user_id, username, money from users where user_id = '${user_id}'`);
    try {
        let current_money = parseInt(resultUsers[0].money);
        let deleted_money = current_money - parseInt(bet);
        if (bet <= 0) {
            res.json({
                message: "ฮั่นแน่!!! จะโกงหรอจร้ะ ดักไว้แล้วจร้าาา",
                banned: {
                    massage: "จะทำการแบนผู้เล่น ข้อหาคิดจะลองดีกับระบบ",
                    username: resultUsers[0].username
                }
            })
        } else if (current_money >= bet) {
            conection.query(`update room_user set bet = ${bet} where user_id = '${user_id}' and room_id = '${room_id}'`);
            conection.query(`update users set money = ${deleted_money} where user_id = '${user_id}'`);
            conection.query(`update room_user set bet = ${1} where user_id = '${0}' and room_id = '${room_id}'`);

            res.status(200).json({
                message: "Successful",
                data: {
                    name: resultUsers[0].username,
                    money: deleted_money,
                    bet: bet
                }
            })
        } else {
            res.json({
                message: "จำนวนเงินไม่เพียงพอ"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Error"
        }, 401)
    }
})
const calcualte_point = async (room_user_id) => {
    const [resultRoomUserCards] = await con.query(`select * from room_user_card where room_user_id = '${room_user_id}'`);
    let sum_point = 0
    for (let index = 0; index < resultRoomUserCards.length; index++) {
        sum_point += resultRoomUserCards[index].point
    }
    while (true) {
        if (sum_point >= 10) {
            sum_point -= 10

        } else {
            break
        }
    }
    conection.query(`update room_user set result_point = ${sum_point} where room_user_id = '${room_user_id}'`);
}

async function check_card(user_id, card_id_check, room_id, room_user_id, point_card, bet) {
    const [resultRoomUserCards] = await con.query(`select card_id from room_user_card where card_id = '${card_id_check}' and room_id = '${room_id}'`);
    let count = 0
    console.log(resultRoomUserCards.length)
    if (count == 2) {
        return
    } else {
        if (resultRoomUserCards.length >= 1) {
            const [resultCards] = await con.query(`select * from card`)
            let rand = Math.random() * 53;
            while (true) {
                if (rand != 0) {
                    break;
                }
                rand = Math.random() * 53
            }
            let card = Math.floor(rand)
            let card_id_new = resultCards[card - 1].card_id
            let point = resultCards[card - 1].point
            await check_card(user_id, card_id_new, room_id, room_user_id, point, bet)
        } else {
            count++
            if (bet > 0) {
                await con.query(`insert into room_user_card (room_user_id, card_id, room_id, point) VALUE ('${room_user_id}', '${card_id_check}', '${room_id}', '${point_card}')`);
                await calcualte_point(room_user_id)
                return
            }
        }
    }
}


app.post('/users/start_game', async (req, res) => {
    let room_id = req.body.room_id
    try {
        const [resultRoomUsers] = await con.query(`select * from room_user where room_id = '${room_id}'`);
        const [resultCards] = await con.query(`select * from card`)
        for (let i = 0; i < resultRoomUsers.length; i++) {
            let room_user_id = resultRoomUsers[i].room_user_id
            let user_id = resultRoomUsers[i].user_id
            let bet = resultRoomUsers[i].bet
            let count = 0;
            while (true) {
                let rand = Math.random() * 53;
                if (rand == 0) {
                    continue;
                }
                let card = Math.floor(rand)
                let card_id = resultCards[card - 1].card_id
                let point = resultCards[card - 1].point
                if (count == 2) {
                    break;
                } else {
                    count++
                    await check_card(user_id, card_id, room_id, room_user_id, point, bet)
                }
            }
        }
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function main() {
            await sleep(1000);
            var sql = `SELECT card.name, user_id, room_user.room_id, result_point, chair, card.card_id FROM room_user_card LEFT JOIN card ON room_user_card.card_id = card.card_id LEFT JOIN room_user ON room_user_card.room_user_id = room_user.room_user_id WHERE room_user.room_id = '${room_id}'`;
            conection.query(sql, function (err, result_data_room) {
                for (let index = 0; index < result_data_room.length; index++) {
                    if (result_data_room[index].user_id != 0) {
                        conection.query(`select round from users where user_id = '${result_data_room[index].user_id}'`, function (error, results_round, fields) {
                            let plus_round = parseInt(results_round[0].round) + 1;
                            conection.query(`update users set round = ${plus_round} where user_id = '${result_data_room[index].user_id}'`);
                        })
                    }
                }
                res.status(201).json({
                    message: "Successful",
                    data: result_data_room
                })
            })
        }
    main()
    } catch (err) {
        res.status(401).json({
            message: "Error"
        })
    }
})

app.post('/users/getAcard', async (req, res) => {
    let user_id = req.body.user_id
    let room_id = req.body.room_id
    const [results_room] = await con.query(`select * from room_user where user_id = '${user_id}' and room_id = '${room_id}'`);
    const [results_card] = await con.query(`select * from card`)
    try {
        let bet = results_room[0].bet
        for (let i = 0; i < results_room.length; i++) {
            let room_user_id = results_room[i].room_user_id
            let count = 0;
            while (true) {
                let rand = Math.random() * 53;
                if (rand == 0) {
                    continue;
                }
                let card = Math.floor(rand)
                let card_id = results_card[card - 1].card_id
                let point = results_card[card - 1].point
                if (count == 1) {
                    break;
                } else {
                    count++
                    await check_card(user_id, card_id, room_id, room_user_id, point, bet)
                }
            }
        }
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function main() {
            await sleep(1000);
            var sql = `SELECT card.name, user_id, room_user.room_id, result_point, chair, card.card_id FROM room_user_card LEFT JOIN card ON room_user_card.card_id = card.card_id LEFT JOIN room_user ON room_user_card.room_user_id = room_user.room_user_id WHERE room_user.room_id = '${room_id}' and room_user.user_id = '${user_id}'`;
            conection.query(sql, function (err, result_data_newCard) {
                res.status(201).json({
                    message: "Successful",
                    data: result_data_newCard
                })
            })
        }
        main()
    } catch {
        res.status(401).json({
            message: "Error"
        })
    }
})

app.post('/users/winner', async (req, res) => {
    let room_id = req.body.room_id
    const [results_room] = await con.query(`select * from room_user where room_id = '${room_id}'`)
    try {
        let room_point = []
        for (let index = 0; index < results_room.length; index++) {
            room_point.push(results_room[index].result_point)
        }
        let max_point = Math.max(...room_point)
        const [winner] = await con.query(`select user_id, room_id, result_point, chair from room_user where room_id = '${room_id}' and result_point = ${max_point}`)
        let all = `SELECT room_user.chair, room_user_card.card_id from room_user_card LEFT JOIN room_user ON room_user.room_user_id = room_user_card.room_user_id WHERE room_user.room_id = '${room_id}'`
        let sql = `SELECT room_user.chair, room_user_card.card_id from room_user_card LEFT JOIN room_user ON room_user.room_user_id = room_user_card.room_user_id WHERE room_user.result_point = ${max_point} and room_user.room_id = '${room_id}'`
        conection.query(sql, function (err, winner_card) {
            conection.query(all, function (error, all_card) {
                res.status(200).json({
                    message: "Successful",
                    winner: winner,
                    all_card: all_card,
                    winner_card: winner_card
                })
            })
        })
    } catch (error) {
        res.status(401).json({
            message: "Error"
        })
    }
})

app.post('/users/finish', async (req, res) => {
    let room_id = req.body.room_id
    level = [0, 10, 50, 100, 200, 300, 500, 700, 1000, 1500, 3000]
    try {
        const [results_room] = await con.query(`select * from room_user where room_id = '${room_id}'`)
        for (let i = 0; i < results_room.length; i++) {
            if (results_room[i].bet >= 1) {
                if (results_room[0].result_point < results_room[i].result_point) {
                    if (results_room[i].user_id != 0) {
                        const [results_winner] = await con.query(`select money, round, round_win, exp from users where user_id = '${results_room[i].user_id}'`)
                        let plus_money = parseInt(results_room[i].bet * 1.75);
                        let added_money = plus_money + parseInt(results_winner[0].money);
                        let plus_round_win = parseInt(results_winner[0].round_win) + 1;
                        let plus_winrate = (plus_round_win / parseInt(results_winner[0].round) * 100);
                        let plus_exp = parseInt(results_winner[0].exp) + 10;
                        conection.query(`update users set round_win = ${plus_round_win} where user_id = '${results_room[i].user_id}'`);
                        conection.query(`update users set money = ${added_money} where user_id = '${results_room[i].user_id}'`);
                        conection.query(`update users set winrate = ${plus_winrate} where user_id = '${results_room[i].user_id}'`);
                        conection.query(`update users set exp = ${plus_exp} where user_id = '${results_room[i].user_id}'`);
                    } else {
                        continue;
                    }
                } else if (results_room[0].result_point ==  results_room[i].result_point) {
                    if (results_room[i].user_id != 0) {
                        const [results_same] = await con.query(`select money, round, round_win, exp from users where user_id = '${results_room[i].user_id}'`)
                        let added_money = parseInt(results_room[i].bet) + parseInt(results_same[0].money);
                        let plus_exp = parseInt(results_same[0].exp) + 5;
                        let plus_winrate = (parseInt(results_same[0].round_win) / parseInt(results_same[0].round) * 100);
                        conection.query(`update users set money = ${added_money} where user_id = '${results_room[i].user_id}'`);
                        conection.query(`update users set winrate = ${plus_winrate} where user_id = '${results_room[i].user_id}'`);
                        conection.query(`update users set exp = ${plus_exp} where user_id = '${results_room[i].user_id}'`);
                    } else {
                        continue;
                    }
                } else {
                    if (results_room[i].user_id != 0) {
                        const [results_winrate] = await con.query(`select round, round_win, exp from users where user_id = '${results_room[i].user_id}'`)
                        let plus_winrate = (parseInt(results_winrate[0].round_win) / parseInt(results_winrate[0].round) * 100);
                        conection.query(`update users set winrate = ${plus_winrate} where user_id = '${results_room[i].user_id}'`);
                    } else {
                        continue;
                    }
                }
                for (let index = 0; index < level.length; index++) {
                    if (results_room[i].user_id != 0) {
                        const [select_level] = await con.query(`select exp, level from users where user_id = '${results_room[i].user_id}'`);
                        if (index + 1 <= level.length) {
                            if (select_level[0].exp > level[index + 1] && index == select_level[0].level) {
                                let up_level = parseInt(select_level[0].level) + 1
                                conection.query(`update users set level = ${up_level} where user_id = '${results_room[i].user_id}'`);
                                break;
                            }
                        }
                    }
                }
            }
        }
        conection.query(`delete from room_user_card where room_id = '${room_id}'`)
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function main() {
            await sleep(1000);
            conection.query(`update room_user set result_point = ${0}, bet = ${0} where room_id = '${room_id}'`);
            conection.query(`select username, money from users`, function (error, results_data, fields) {
                res.status(201).json({
                    message: "Successful"
                })
            })
        }
        main();
    }
    catch (error) {
        res.status(401).json({
            message: "Error"
        })
    }
})

app.post('/users/exit', async (req, res) => {
    let user_id = req.body.user_id
    let room_id = req.body.room_id
    const [results_room] = await con.query(`select * from room_user where room_id = '${room_id}'`)
    try {
        if (results_room.length <= 2) {
            conection.query(`delete from room_user where user_id = '${user_id}'`)
            conection.query(`delete from room_user where user_id = '${0}' and room_id = '${room_id}'`)
            conection.query(`delete from room where room_id = '${room_id}'`)
            res.status(200).json({
                message: "Successful"
            })
        } else {
            const [results_people] = await con.query(`select people from room where room_id = '${room_id}'`)
            let remove_people = parseInt(results_people[0].people) - 1
            conection.query(`update room set people = ${remove_people} where room_id = '${room_id}'`);
            conection.query(`delete from room_user where user_id = '${user_id}'`)
            res.status(200).json({
                message: "Successful"
            })
        }
    } catch (error) {
        res.status(401).json({
            message: "Error"
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port 1${port}`)
})