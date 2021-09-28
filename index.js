const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const port = process.env.PORT || 3000

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var dbUrl = "mongodb+srv://Fury:Chauhan%40123@chatapplication.q04mz.mongodb.net/test"

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

app.get('/msgs/delete', (req,res) => {
    Message.findOneAndDelete();
})

app.get('/msgs', (req, res) => {
    Message.find({}, (err, messages) => {

        res.send(messages);

    })

})

app.post('/msgs', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if (err) {
            res.sendStatus(500)
        } else {
            io.emit('message', req.body)
            res.status(200)
        }
    })
});

mongoose.connect(dbUrl, (err) => {
    console.log('Mongodb Database connected')
})

io.on('connection', (socket) => {
    console.log('user connected')
})

const server = http.listen(port, () => {
    console.log("Server is running succesfully on port %d", port)
});
