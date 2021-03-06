const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Item = require("../models/itemSchema.js");
const Validator = require("../validator/validateItem.js");
const bcrypt = require("bcrypt");

//Post Array
let itemArray = [];
router.post("/addItem", (req, res) => {
    let newItem = {
        username: req.body.username,
        content: req.body.content
    };
    itemArray.push(newItem);
    res.send(itemArray);
});

router.post("/add", (req, res) => {
    //curl -d '{"username":"req.body.loginusername", "password":"req.body.loginpassword"}' -H "Content-Type: application/json" -X POST "http://localhost:5000/user/login";
    const {errors, isValid} = Validator(req.body);

    if (!isValid) {
        
        return res.status(400).json(errors);
    } 

    let newdoc = new Item({
        username: req.body.username,
        content: req.body.content,
        email: req.body.email
    });

    payload = {};
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.email, salt, (err, hash) => {
            if (err) throw err;
            payload.value = hash;
            newdoc.email = payload.value;
            newdoc.save().then(() => res.status(200).json({ message:"Item created" }))
            .catch(err => res.status(404).json({ noItems: "There are no items" }));
            
        });
    });
});

//Get Array
router.get("/", (req, res) => {
    res.send(itemArray);
});

router.get("/all", (req, res) => {
    const errors = {};
    Item.find({}, ' -email')
    .then(items => {
        if (!items) {
          errors.noItems = "There are no items";
          res.status(404).json(errors);
        }
        res.json(items);
      })
      .catch(err => res.status(404).json({ noItems: "There are no items" }));
});
  
//Put Array
router.put("/updateItem/:index", (req, res) => {
    let index = req.params.index;
    let newItem = {
        username: req.body.username,
        content: req.body.content
    };
    _.set(itemArray, index, newItem);
    res.send(itemArray);

});

router.put("/update", (req, res) => {
    Item.replaceOne({username: req.body.username},
    {username: req.body.replacename, content: req.body.replacecontent}
    ).then(({ok, n}) => {
        res.json({ noItemL: "updated" });
    }).catch(err => res.status(404).json({ invalidUser: "There is no such username" }));
});

//Delete Array
router.delete("/deleteItem/:index", (req, res) => {
    let index = req.params.index;
    _.pullAt(itemArray, index);
    res.send(itemArray);
});

router.delete("/delete", (req, res) => {
    let delUser = req.body.delUser;
    errors = {};
    const email = req.body.email;

    Item.findOne({ username: req.body.delUser}).then(Item =>{
        bcrypt.compare(email, Item.email).then(isMatch => {
            if (isMatch) {
                Item.deleteOne({ username: delUser }).then(({ ok, n}) => {
                    console.log("You deleted " + delUser + "!");
                    console.log(ok);
                    console.log(n);
                    res.json({ deleted: "deleted something" });
                }).catch(err => res.status(404).json(err));
            } else {
                errors.value = "Incorrect";
                return res.status(400).json(errors);
            }
        });

    }).catch(err => res.json(err));
    
});

module.exports = router;