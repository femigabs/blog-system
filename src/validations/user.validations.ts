import * as Joi from 'joi';

export const createUserSchema = Joi.object({
    firstName: Joi.string().lowercase().required(),
    lastName: Joi.string().lowercase().required(),
    username: Joi.string().min(3).lowercase().required(),
    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('(?=.*[a-z])'))        // at least one lowercase letter
        .pattern(new RegExp('(?=.*[A-Z])'))        // at least one uppercase letter
        .pattern(new RegExp('(?=.*[0-9])'))        // at least one digit
        .pattern(new RegExp('(?=.*[!@#\$%\^&\*])')) // at least one special character
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be no longer than 30 characters',
            'string.pattern.base': 'Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character'
        })
});

export const loginUserSchema = Joi.object({
    username: Joi.string().min(3).lowercase().required(),
    password: Joi.string()
});