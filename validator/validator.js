const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateUser = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";

    if (!Validator.isEmail(data.email)){
        errors.email = "Email is Invalid"
    }

    if (isEmpty(data.email)){
        errors.email = "Email is empty"
    }

    return {
        errors,
        IsValid: isEmpty(errors)
    };

};

module.exports = validateUser;