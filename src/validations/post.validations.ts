import * as Joi from 'joi';

export const createPostSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
});

export const getPostSchema = Joi.object({
    page: Joi.number(),
    pageSize: Joi.number(),
    authorId: Joi.number(),
    q: Joi.string()
});

export const idSchema = Joi.object({
    id: Joi.number().required(),
});

export const updatePostSchema = Joi.object({
    title: Joi.string(),
    content: Joi.string(),
});