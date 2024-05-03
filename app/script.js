 
function changePassword() {
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const new_password = document.getElementById('new_password').value;
  const confirm_new_password = document.getElementById('confirm_new_password').value;

  const data = {
    username: name,
    password: password,
    new_password: new_password,
    confirm_new_password: confirm_new_password,
  };

  let loginSuccess = false;

  axios.post('http://127.0.0.1:3000/users/change', data)
      .then(response => {
          if (response.data.message === 'Change password') {
              alert("Change password successfully")
              window.location.href = 'index.html';
          } else {
              location.reload();
          }
      })
      .catch(error => {
          alert("Wrong, Try again")
          location.reload();
      });
}

function Login() {
  const name = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const data = {
    username: name,
    password: password,
  };
  axios.post('http://127.0.0.1:3000/users/login', data)
    .then(response => {
        if (response.data.message === 'Successful') {
            alert("Login successfully")
            console.log(response.data.data);
            const userData = response.data.data;
            localStorage.setItem('username', userData.name);
            localStorage.setItem('money', userData.money);
            localStorage.setItem('id', userData.user_id);
            console.log(userData);
            window.location.href = 'lobby.html';
        } else {
            // location.reload();
        }
    })
    .catch(error => {
        alert("Wrong, Try again")
    });
}

function creatAccount() {
  const name = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const data = {
    username: name,
    password: password,
  };
  var checkbox = document.getElementById("checkbox");
  if (checkbox.checked) {
    axios.post('http://127.0.0.1:3000/users/create', data)
      .then(response => {
          if (response.data.message === 'Successful') {
              alert("Successfully create account")
              window.location.href = 'index.html';
          } else {
              // location.reload();
          }
      })
      .catch(error => {
          alert("Wrong, Try again")
      });
  } else {
    alert("Please accept user privacy")
  }
}

const rooms = JSON.parse(localStorage.getItem('rooms')) || [];

function createRoom(){
  const room_name = document.getElementById('room_name');
  const roomtext = room_name.value.trim();
  const room_password = document.getElementById('room_password').value;

  const id = localStorage.getItem('id');
  if (roomtext === '') return ;

  const data = {
    room_name : roomtext,
    password : room_password,
    user_id : id
  }

  axios.post('http://127.0.0.1:3000/users/create_room', data)
    .then(response => {
      if (response.data.message === 'Successful') {
        alert('Create room successful')
        var user_data = {
          point: 0
        }
        var bot_data = {
          point: 0
        }
        localStorage.setItem(id, JSON.stringify(user_data));
        localStorage.setItem('0', JSON.stringify(bot_data));
        localStorage.setItem('room_id', response.data.room_id);
        localStorage.setItem('round', 0);
        window.location.href = 'room.html';
      } else {
        alert('fail')
      }
    });  
}

function showroom(){
  const id = localStorage.getItem('id');

  const data = {
    user_id : id
  }

  axios.post('http://127.0.0.1:3000/users/show_room', data)
  .then(response => {
    if (response.data.message === 'Successful') {
      const data = response.data.data
      const rooms = data || [];
    
      var tableBody = document.querySelector("#myTable tbody");

      tableBody.innerHTML = '';
      rooms.forEach((room, index) => {
        var row = tableBody.insertRow();
        row.id = "tr"
        row.classList.add("background-room");
        var idCell = row.insertCell(0);
        var nameCell = row.insertCell(1);
        var player = row.insertCell(2);
        var status = row.insertCell(3);
        var connect = row.insertCell(4);
        idCell.innerHTML = room.room_id
        idCell.id = "roomID"
        idCell.setAttribute("name", room.room_id);
        nameCell.innerHTML = room.name
        player.innerHTML = room.people + '/5'
        
        if (room.password == '') {
          console.log("Please enter");
          status.innerHTML = `<img src="/image/unlockstatus.png" alt="Status Image">`;
          connect.innerHTML = '<button type="button" class="join" onclick="checkpassword()">join</button>';
          localStorage.setItem('roomid_${index + 1}', room.room_id);
        } else {
          console.log("Please");
          status.innerHTML = `<img src="/image/lockstatus.png" alt="Status Image">`;
          connect.innerHTML = `<button type="button" id="joinButton_${index + 1}" class="join" onclick="show(joinButton_${index + 1})">join</button>`;
          
        }
        
      });
    } else {
    }
  });
}

function show(id) {
  const showPasswordInput = document.getElementById(id);
  const PasswordInputContainer = document.querySelector('.enter-password');
  const closePasswordInput = document.querySelector('.go-back');

  console.log(id)
  console.log(showPasswordInput)
  console.log(PasswordInputContainer)

  id.onclick = () => {
    PasswordInputContainer.classList.add('active');
  }
  
closePasswordInput.onclick = () => {
    PasswordInputContainer.classList.remove('active');
  }
}

function checkpassword(id) {

  const user = localStorage.getItem('id');
  let password = document.getElementById('password').value;
  var table = document.getElementById("roomID");
  var id = table.getAttribute("name");  
  console.log(id)
  console.log(password)
  if (password.length <1) {
    password = "";
  } 
  console.log(password)
  const data = {
    user_id: user,
    room_id: id,
    password: password
  }
  console.log(data)

  axios.post('http://127.0.0.1:3000/users/join_room', data)
    .then(response => {
      if (response.data.message === 'Successful') {
        localStorage.setItem('room_id', id)
        var user_data = {
          point: 0
        }
        localStorage.setItem(user, JSON.stringify(user_data));
        window.location.href = 'room.html';
      } else {
        alert('Wrong Password')
      }
    }); 
};

function changeUsername() {
  const user = localStorage.getItem('id');
  const new_username = document.getElementById('new_username').value;

  const data = {
    user_id: user,
    new_username: new_username,
  };

  axios.post('http://127.0.0.1:3000/users/change_username', data)
      .then(response => {
          if (response.data.message === 'Successful') {
              alert("Change username successfully")
              window.location.href = 'lobby.html';
          } else {
              location.reload();
          }
      })
      .catch(error => {
          alert("Wrong, Try again")
          location.reload();
      });
}

function exitRoom() {
  const user = localStorage.getItem('id');
  const room_id = localStorage.getItem('room_id');

  const data = {
    user_id: user,
    room_id: room_id
  }

  axios.post('http://127.0.0.1:3000/users/exit', data)
    .then(response => {
      if (response.data.message === 'Successful') {
        localStorage.removeItem('room_id');
        localStorage.removeItem(user);
        localStorage.removeItem('0');
        window.location.href = 'lobby.html';
      } else {
      }
    }); 
}

function bet_money() {
  const user = localStorage.getItem('id');
  const room_id = localStorage.getItem('room_id');
  const bet_money = document.getElementById('bet-money').value;
  // const bet_money = 100


  const data = {
    user_id: user,
    room_id: room_id,
    bet: bet_money
  }

  console.log(data);
  axios.post('http://127.0.0.1:3000/users/bet', data)
    .then(response => {
      if (response.data.message === 'Successful') {
        console.log(response.data)

        const betContainer = document.querySelector('.bet');
        const betbutton = document.querySelector('.click');

        betContainer.classList.remove('active');
        betbutton.classList.remove('active');
        
      } else {
      }
    }); 
}

var count = 10 ;

function countdown() {

  const show = document.getElementById('time');

  show.innerHTML = count;

  count -- ;

  if(count >= 0) {

    if (localStorage.getItem("round") != 0) {
      if (localStorage.getItem("getcard") == 0) {
        getacard();
      }
    }
    
    setTimeout(countdown, 1000);

  } else {

    show.innerHTML = '0';

    const room_id = localStorage.getItem('room_id');
    const data = {
      room_id: room_id
    }

    count += 11;
    if (localStorage.getItem("round") == 0) {
      for (var i = 1; i < 6 ; i++) {

        if (document.getElementById('name_player' + i).innerHTML == document.getElementById('name') && 
            document.getElementById('money_player' + i).innerHTML != '0 ฿' ) {

          const betContainer = document.querySelector('.bet');
          const betbutton = document.querySelector('.click');

          betContainer.classList.remove('active');
          betbutton.classList.remove('active');

        }
      }

    } else if (localStorage.getItem("round") == 1) {

      winner();
    
    }
    
    const getAcardContainer = document.querySelector('.getAcard');
    getAcardContainer.classList.remove('show');

  }
}

function choose_chair(i) {
  
  for (let n = 1; n < 6; n++) {
    var check =  document.getElementById('name_player' + n).textContent
    var namecheck = document.getElementById('name').textContent
    console.log(namecheck, check)
    if (check == namecheck) {
      document.getElementById('name_player' + n).innerHTML = 'ชื่อผู้ใช้'
      document.getElementById('money_player' + n).innerHTML = '0 ฿'
      document.getElementById('pic_player' + n).src ="/image/no_player.png"
      document.getElementById('point' + n).style.opacity = 0
    }
  }
    

  var name = 'name_player' + i;
  var seatmoney = 'money_player' + i;
  var pic = 'pic_player' + i;
  
  const user = localStorage.getItem('id');
  const room_id = localStorage.getItem('room_id');

  const data = {
    user_id: user,
    room_id: room_id,
    chair: i
  }

  axios.post('http://127.0.0.1:3000/users/choose_chair', data)
    .then(response => {
      if (response.data.message === 'Successful') {

        console.log(response.data.data);
        document.getElementById('name_player' + i).innerHTML = document.getElementById('name').textContent
        document.getElementById('money_player' + i).innerHTML = '0 ฿'
        document.getElementById('pic_player' + i).src = document.getElementById('profile').src
        document.getElementById('point' + i).style.opacity = 1
      
        const betContainer = document.querySelector('.bet');
        const betbutton = document.querySelector('.click');
      
        betContainer.classList.add('active');
        betbutton.classList.add('active');
      } else {
      }
    }); 
 
}

function show_chair() {
  
  const data = {
    room_id: localStorage.getItem('room_id')
  }

  axios.post('http://127.0.0.1:3000/users/show_chair', data)
    .then(response => {
      if (response.data.message === 'Successful') {

        const players = response.data.data;
        
        for (let n = 1; n < 6; n++) {
          document.getElementById('name_player' + n).innerHTML = 'ชื่อผู้ใช้'
          document.getElementById('money_player' + n).innerHTML = '0 ฿'
          document.getElementById('pic_player' + n).src ="/image/no_player.png"
          document.getElementById('point' + n).style.opacity = 0
        }

        for (let i = 0; i < players.length; i++) {
          const player = players[i];

          if (player.chair != 0) {

            document.getElementById('name_player' + player.chair).innerHTML = player.username
            document.getElementById('money_player' + player.chair).innerHTML = player.bet + ' ฿'
            document.getElementById('pic_player' + player.chair).src = document.getElementById('profile').src

            // if (document.getElementById('money_player' + player.chair).innerHTML != '0' && 
            //     document.getElementById('time').innerHTML != '0' ||
            //     document.getElementById('time').innerHTML != '10' || 
            //     document.getElementById('time').innerHTML != 'TIME') {
            // } 

            if (document.getElementById('name_player' + player.chair).innerHTML == document.getElementById('name').innerHTML) {
                document.getElementById('point' + player.chair).style.opacity = 1

            }
          }  
           

        }

      } else {
      }
    }); 
  
}

function start_game() {
  const room_id = localStorage.getItem('room_id');
  const data = { 
    room_id: room_id ,
    user_id: localStorage.getItem('id')
  };

  axios.post('http://127.0.0.1:3000/users/start_game', data)
    .then(response => {
      if (response.data.message === 'Successful') {
        var botCardsContainer = document.querySelector('.card-bot');
        var botCards = botCardsContainer.querySelectorAll('img');
        botCards.forEach(function(card, index) {
          if (index < 2) {
              card.style.opacity = '1';
          };
        });

        for (let n = 1; n < 6; n++) {
          var playerCardsContainer = document.querySelector('.card-player' + n);
          var playerCards = playerCardsContainer.querySelectorAll('img');

          if (document.getElementById('money_player' + n).innerHTML != '0 ฿')  {
            playerCards.forEach(function(card, index) {
              if (index < 2) {
                  card.style.opacity = '1';
              }
            });
          }
        };
        
        var returnValue = response.data.data
        
        var num = 0
        returnValue.forEach (item => {
          let playerData = JSON.parse(localStorage.getItem(item.user_id));
          if (item.user_id == localStorage.getItem('id')) {
            const seat = item.chair
            document.getElementById('point' + seat).innerHTML = item.result_point + ' point'

            var playerCardsContainer = document.querySelector('.card-player' + item.chair);
            var playerCards = playerCardsContainer.querySelectorAll('img');

            playerCards[num].src = `/image/card/${item.card_id}.svg`;

            num++;
          }  
          
          playerData.point = item.result_point
          localStorage.setItem(item.user_id, JSON.stringify(playerData));

        });

        num = 0;

        let random_bot = Math.floor(Math.random() * 2) 
        if (random_bot == 0 ) {
          random_bot = 4
        } else {
          random_bot = 5
        }

        for (let i = 0; i < returnValue.length; i++) {
          const item = returnValue[i];
          
          if (item.user_id === '0' && item.result_point < random_bot + 1)  {
            const data = {
              user_id: '0',
              room_id: localStorage.getItem('room_id')
            };

            axios.post('http://127.0.0.1:3000/users/getAcard', data)
              .then(response => {
                console.log(1);
                if (response.data.message === 'Successful') {
                  var returnValue = response.data.data[0];
                  let playerData = JSON.parse(localStorage.getItem('0'));
                  playerData.point = returnValue.result_point;
                  localStorage.setItem('0', JSON.stringify(playerData));
                  var botCardsContainer = document.querySelector('.card-bot');
                  var botCards = botCardsContainer.querySelectorAll('img');
                  botCards.forEach(function(card, index) {
                    if (index == 2) {
                      card.style.opacity = '1';
                    }
                  });
                }    
              });

            break;
          }
        }

        localStorage.setItem('getcard', 0);
        localStorage.setItem('round', 1)
        countdown();
      }
    });
}


var button = document.getElementById('getAcard');

button.addEventListener('click', card);

function getacard() {

  const getAcardContainer = document.querySelector('.getAcard');

  console.log(getAcardContainer)

  getAcardContainer.classList.add('show');

}

function card() {
  localStorage.setItem('getcard', 1);
  const data = {
    user_id: localStorage.getItem('id'),
    room_id: localStorage.getItem('room_id'),
  }
  
  axios.post('http://127.0.0.1:3000/users/getAcard', data)
    .then(response => {
      console.log('a')
      if (response.data.message === 'Successful') {
        console.log(response);
        var returnValue = response.data.data[0]
        var playerCardsContainer = document.querySelector('.card-player' + returnValue.chair);
        var playerCards = playerCardsContainer.querySelectorAll('img');
        console.log(response.data.data, (returnValue));
        playerCards.forEach(function(card, index) {
          if (index > 1) {
              card.style.opacity = '1';
          }
        });

        const all_card = response.data.data

        var playerCardsContainer = document.querySelector('.card-player' + all_card[0].chair);
        var playerCards = playerCardsContainer.querySelectorAll('img');

        playerCards.forEach(function(cards, index) {
          const card = all_card.filter(item => item.chair === all_card[0].chair);
          if (card.length > index) {
            playerCards[index].src = `/image/card/${card[index].card_id}.svg`;
            }
        });

        const player = response.data.data[0];
        const seat = player.chair
        document.getElementById('point' + seat).innerHTML = player.result_point + ' point'
        
        let playerData = JSON.parse(localStorage.getItem(returnValue.user_id));
        playerData.point = returnValue.result_point
        localStorage.setItem(returnValue.user_id, JSON.stringify(playerData));
        
        const getAcardContainer = document.querySelector('.getAcard');
        getAcardContainer.classList.remove('show');

      } else {
      }
    });
}

function winner() {
  const data = {
    room_id: localStorage.getItem('room_id'),
  }

  axios.post('http://127.0.0.1:3000/users/winner', data)
  .then(response => {
    if (response.data.message === 'Successful') {
      
      const data = response.data.winner[0]
      console.log('data-player' + data.chair)
      if (data.chair != 0) {
      document.getElementById('data-player' + data.chair).classList.add('active');
      document.getElementById('pic_player' + data.chair).classList.add('active');
      };

      const card = response.data.all_card
      for (let n = 1; n < 6; n++) {
        var playerCardsContainer = document.querySelector('.card-player' + n);
        var playerCards = playerCardsContainer.querySelectorAll('img');
        var check = document.getElementById('name_player' + n).textContent;
        if (check !== 'ชื่อผู้ใช้') {
          playerCards.forEach(function(cards, index) {
            const playerCardData = card.filter(item => item.chair === n);
            if (playerCardData.length > index) {
              playerCards[index].src = `/image/card/${playerCardData[index].card_id}.svg`;
            }
          });
        }
      }

      var botCardsContainer = document.querySelector('.card-bot');
      var botCards = botCardsContainer.querySelectorAll('img');
      const botCardData = card.filter(item => item.chair === 0);
      console.log(botCardData);
      botCards.forEach(function(cards, index) {
        if (botCardData.length > index) {
          cards.src = `/image/card/${botCardData[index].card_id}.svg`;
        }
      });
    setTimeout(finish, 5000);
    }
  }); 
}


function finish() {

  document.getElementById('time').innerHTML = 'TIME';

  const data = {
    room_id: localStorage.getItem('room_id'),
  }

  axios.post('http://127.0.0.1:3000/users/finish', data)
  .then(response => {
    if (response.data.message === 'Successful') {
      localStorage.setItem('round', 0)

      for (let n = 1; n < 6; n++) {
        var playerCardsContainer = document.querySelector('.card-player' + n);
        var playerCards = playerCardsContainer.querySelectorAll('img');
        playerCards.forEach(function(card, index) {
          card.src = `/image/card/backcardred.svg`;
          card.style.opacity = '0';
          });
        }
        var botCardsContainer = document.querySelector('.card-bot');
        var botCards = botCardsContainer.querySelectorAll('img');
        botCards.forEach(function(card, index) {
          card.src = `/image/card/backcardred.svg`;
          card.style.opacity = '0';
        });

        for (i = 1; i < 6; i++) {
        document.getElementById('data-player' + i).classList.remove('active');
        document.getElementById('pic_player' + i).classList.remove('active');
        document.getElementById('point' + i).innerHTML = '0 point'        
        };

        const betContainer = document.querySelector('.bet');
        const betbutton = document.querySelector('.click');
      
        betContainer.classList.add('active');
        betbutton.classList.add('active');

        makeInterval()
      };
  }); 



}