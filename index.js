const express = require('express');
const getUser = require('./userController');

const app = express();
app.listen(3002,() => {
    console.log("coucou");
});

app.get('user',(req, res) => {
    getUser(req, res);
})