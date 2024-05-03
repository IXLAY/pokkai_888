
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
              window.location.href = 'login.html';
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
              window.location.href = 'login.html';
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
      console.log('1')
      rooms.forEach((room, index) => {
        var row = tableBody.insertRow();
        row.classList.add("background-room");
        var idCell = row.insertCell(0);
        var nameCell = row.insertCell(1);
        var player = row.insertCell(2);
        var status = row.insertCell(3);
        var connect = row.insertCell(4);
        idCell.innerHTML = room.room_id
        console.log(room.room_id)
        idCell.id = "roomID"
        idCell.setAttribute("name", room.room_id);
        nameCell.innerHTML = room.name
        player.innerHTML = room.people + '/5'

        if (room.password == '') {
          status.innerHTML = `<img src="/image/unlockstatus.png" alt="Status Image">`;
          connect.innerHTML = '<button type="button" class="join" id="joinButton" onclick="checkpassword()" >join</button>';
        } else {
          status.innerHTML = `<img src="/image/lockstatus.png" alt="Status Image">`;
          connect.innerHTML = `<button type="button" class="join" id="joinButton">join</button>`;

          const showPasswordInput = document.querySelector('.join');
          const PasswordInputContainer = document.querySelector('.enter-password');
          const closePasswordInput = document.querySelector('.go-back');

          showPasswordInput.onclick = () => {
            PasswordInputContainer.classList.add('active');
          }

        closePasswordInput.onclick = () => {
            PasswordInputContainer.classList.remove('active');
          }
        }

      });
    } else {
    }
  });
}


function checkpassword() {
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
        window.location.href = 'room.html';
      } else {
        alert('Wrong Password')
      }
    }); 
};

