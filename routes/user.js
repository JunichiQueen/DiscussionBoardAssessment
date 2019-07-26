const express = require('express');
const router = express.Router();
const User = require('../models/userschema');
const ValidateEmail = require('../validator/validateUser.js');
const bcrypt = require('bcrypt');


router.get("/all", (req, res) => {
    const errors = {};
    User.find({}, ' -password')
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
    const {errors, IsValid} = ValidateEmail(req.body);
    if (!IsValid) {
        return res.status(404).json(errors);
    }

    let password2 = req.body.password2;
    if (password2 != req.body.password){
        return res.status(400).json({ message: "Passwords do not match" });
    }

    User.findOne({ username: req.body.username }).then(User => {
        if (User.username == req.body.username){
            return res.status(400).json({ message: "Username already exists"});
        
    }}).catch(() => {
        User.findOne({ email: req.body.email }).then(User2 => {
            if (User2.email == req.body.email){
                return res.status(400).json({ message: "Email already exists"});
            }
        }).catch(() => {
            let newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            payload = {};
        
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if (err) throw err;
                    payload.value = hash;
                    newUser.password = payload.value;
                    newUser.save().then(() => res.status(200).json({ message: "User Created"}))
                    .catch((err) => {console.log(err), res.status(404).json({ message: "Creation Failed"})});
                });
            });
        });
    });
});

router.post("/login", (req, res) => {
    errors = {};
    User.findOne( {username: req.body.username }).then(User => {
        bcrypt.compare(req.body.password, User.password).then(isMatch => {
            if (isMatch) {
                console.log({ login: "Login Successful"});
                return res.status(200).json({ message: "Login Successful"});
            } else {
                errors.value = "Incorrect Password";
                return res.status(400).json(errors);
            }
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})

//Needs additional security considerations
router.put("/update", (req, res) => {
    User.replaceOne({username: req.body.username},
    {email: req.body.replaceemail, content: req.body.replacepassword}
    ).then(({ok, n}) => {
        res.json({ noItemL: "updated" });
    }).catch(err => res.status(404).json({ invalidUser: "There is no such username" }));
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
