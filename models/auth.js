const Joi = require("joi");

function validate(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(3).max(255).required(),
    });

    return schema.validate(user);
}

module.exports.validate = validate;
