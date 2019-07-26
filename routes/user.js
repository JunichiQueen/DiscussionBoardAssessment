const express = require('express');
const router = express.Router();
const User = require('../models/userschema');


router.get("/all", (req, res) => {
    const errors = {};
    User.find()
    .then(users => {
        if (!users){
            errors.noUsers = "There are no users";
            res.status(404).json(errors);
        }
        res.json(users);
    })
    .catch(err => console.log(err));
});

module.exports = router;
