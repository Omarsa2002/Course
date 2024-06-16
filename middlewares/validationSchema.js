const {body} = require('express-validator');

const validatorSchema = ()=> [
    body('title').notEmpty().withMessage("title is require").isLength({min:2}).withMessage('length must be > 2'),
    body('price').notEmpty().withMessage('price is requir')
];

module.exports = {
    validatorSchema
};