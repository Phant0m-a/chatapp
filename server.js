const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const bodyParser = require('body-parser')

const app = express();
const server = https.createServer(app);

// const io = socketio(server);
const io = socketio(app);
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.set('view engine', 'ejs')
//😎
app.set('views', __dirname + '/views')
// public static folder
app.use(express.static(path.join(__dirname, 'public')));

const formatMessage = require('./utils/messages');

const { userJoin, getCurrentUser, userleave, getRoomUsers } = require('./utils/users');
const chatBot = 'chatBot'

// on used for Lisening for requst io.on('message')
//emit used for sending request   io.emit('msg')

// get
app.get('/', (req, res) => {
    res.render('index');
})

// post
// app.post('/', (req, res) => {


//     res.render('chat', {
//         room: req.body.room,
//         username : req.body.username,
//     });
// })



// Run when user connect
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        // method userJoin registers user in users.js and returns this current user object
        const user = userJoin(socket.id, username, room)

        // current user is joined to the room he wants
        socket.join(user.room);

        // Welcome message
        socket.emit('message', formatMessage(chatBot, `Welcome to the ${user.room} group ${user.username}!  `));

        //Broadcast when user connects - broadcast to All user except the sender
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined the chat`));

        if (user.room != undefined) {
            // users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }


    })


    // Listen for chatMessages
    socket.on('chatMessage', (msg) => {
        // gets current active user
        const user = getCurrentUser(socket.id);
        // console.log(msg)
        if (user != undefined) {
            io.to(user.room).emit('message', formatMessage(user.username, msg));

        }
    })


    //if the user leaves the chat ...
    socket.on('disconnect', () => {
        //    io.emit is used when to broadcast to each n everyone in chat
        // io.to().emit helps send to specific group

        const user = userleave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`))
        }
        // users and room info
        if (user != undefined) {
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }


    });

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`[+] Server running on port ${PORT} 😎`));
