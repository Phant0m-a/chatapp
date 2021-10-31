const chatForm = document.getElementById('chat-form');
const chat_messages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// get username & room from URL

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })


// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


//  Display messages from server
socket.on('message', message => {
    // console.log(message)
    outputMessage(message)

    // Scroll down
    chat_messages.scrollTop = chat_messages.scrollHeight;

})

//Message submit
chatForm.addEventListener('submit', (e) => {
    // preventing default submittion
    e.preventDefault();

    // get message value by its id
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})



// output function

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location.href = '/';
    } else {
    }
});


// Dom room names
function outputRoomName(room) {
    roomName.innerText = room;
}

// Dom all users
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}