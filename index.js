const express = require('express');
const app = express();


const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const db = require('./queries');
app.use(express.static('public'));


server.listen(port, () => {
    console.log('Server is running on port ${port}');
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
})

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
})

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
})

app.get('/rooms', (req, res) => {
    res.sendFile(__dirname + '/public/rooms.html');
})

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
   socket.on('join', (data) => {
       socket.join(data.room);
       tech.in(data.room).emit('message', `New user joined $data{data.room!}`);
   })

   
   socket.on('message', (data) => {
        console.log('message ${data.msg}');

        var message = {
            name: "User",
            room: data.room,
            text: data.msg
        };

        let insert = db.insertChats(message);
        tech.in(data.room).emit('message', data.msg);
    });

    db.getChats.then( val => {
        console.log(val);
    });

})
