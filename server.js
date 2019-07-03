// express server
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io").listen(server);
// Two arrays one is for user and other is for connections
users =[];
connections = [];
server.listen(process.env.PORT || 3000);
console.log("server running")
app.get('/',(req,res)=> {
    res.sendFile(__dirname+'/index.html');
})
io.sockets.on('connection', (socket)=> {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);
    //Disconnect
    socket.on('disconnect', () => {
        if(!socket.username) return;
        users.splice(users.indexOf(socket.usernames),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
        console.log("Disconnected: %s sockets connected", connections.length);
    });
    socket.on('send message', (data)=> {
        console.log(data);
        io.sockets.emit('new message',{msg: data, user:socket.username});
    })
    socket.on('new user', (data, callback) =>{
        callback(true);
        socket.username =data;
        users.push(socket.username);
        updateUsernames();
    })
    function updateUsernames () {
        io.sockets.emit('get users',users);
    }
})
