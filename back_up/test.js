let cards = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]

let people = ['u1', 'u2'];


let rooms = [
    "r1"
]

let room_user = [
    {
        user_id: "u1",
        room_id: "r1"
    },
    {
        user_id: "u2",
        room_id: "r1"
    }
]
//start 
let room_user_card = []

let selected_card = [];
for (let index = 0; index < room_user.length; index++) {
    let count = 0;
    while (true) {
        let number = Math.floor(Math.random() * 10)
        let ru = room_user[index]
        console.log(ru)
        if (count == 2) {
            break;
        }
        if (selected_card.includes(number)) {
            continue
        } else {
            count++
            room_user_card.push({
                user_id: ru.user_id,
                room_id: ru.room_id,
                card_id: number
            })
            selected_card.push(number)
        }
    }
}

console.log(room_user_card);

// calcualte point
let user_point = []

for (let i = 0; i < room_user.length; i++) {
    let current_user_point = 0;
    let current_user_id = room_user[i].user_id
    for (let j = 0; j < room_user_card.length; j++) {
        if (current_user_id == room_user_card[j].user_id) {
            current_user_point += room_user_card[j].card_id
        }
    }
    user_point.push({
        user_id: current_user_id,
        point: current_user_point
    })
}

console.log(user_point);

// check point
let prev_value = 0;
let user_index;
for (let index = 0; index < user_point.length; index++) {
    if (prev_value < user_point[index].point) {
        prev_value = user_point[index].point
        user_index = index
    }
}



console.log(user_point[user_index]);
// console.log(room_user_card);
// console.log(user_point);
// console.log(user_point[user_index].user_id);