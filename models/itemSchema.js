var mongoose = require(`mongoose`);
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    content: String,
    email: {
        type: String,
        required: true
    }
});

let Item = mongoose.model(`item`, ItemSchema);

module.exports = Item;