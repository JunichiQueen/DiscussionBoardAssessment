const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const user = require('./routes/user.js');
const item = require('./routes/item.js');

mongoose.connect('mongodb+srv://admin:admin@cluster0-jbwzj.gcp.mongodb.net/test?retryWrites=true&w=majority',
{ newUrlParser: true }).then(
    () => {console.log("You have connected to mongoDB")},
    (err) => {console.log(err)}
);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use('/user', user);
app.use('/item', item);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));