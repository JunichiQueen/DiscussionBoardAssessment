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


router.post("/create", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save().then(() => res.status(200).json({ message: "User Created"}))
    .catch((err) => {console.log(err), res.status(404).json({ message: "Creation Failed"})});
});

router.delete("/delete", (req, res) => {
    let delUsername = req.body.delUsername;
    User.deleteOne({ username: delUsername }).then(({ ok, n}) => {
        console.log("You deleted " + delUsername + "!");
        console.log(ok);
        console.log(n);
        res.json({ deleted: "deleted something" });
    }).catch(err => res.status(404).json(err));
});

module.exports = router;
