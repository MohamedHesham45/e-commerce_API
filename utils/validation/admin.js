const Joi = require("joi");

const createAdminValidation = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            "string.base": "Name must be a string.",
            "string.empty": "Name is required.",
            "any.required": "Name is required.",
        }),
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string.",
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)
        .messages({
            "string.base": "Password must be a string.",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character(@$!%*?).",
            "string.min": "Password must be at least 8 characters long.",
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
        }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Passwords must match.",
        "any.required": "Confirm Password is required.",
    }),
});
const updateAdminValidation = Joi.object({
    name: Joi.string()

        .messages({
            "string.base": "Name must be a string.",
        }),
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string.",
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)
        .messages({
            "string.base": "Password must be a string.",
            "string.pattern.base":
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character(@$!%*?).",
            "string.min": "Password must be at least 8 characters long.",
            "string.empty": "Password is required.",
            "any.required": "Password is required.",
        }),
    role: Joi.string().valid('admin', 'user').messages({
        'any.only': 'Role must be either "admin" or "user".',
    })
});
module.exports = {
    createAdminValidation,
    updateAdminValidation
}