exports.createPostValidator = (req, res, next) => {

    // title
    req.check('title', "Title is required").notEmpty()
    req.check('title', "Title must be between 4 and 150 characters").isLength({
        min: 4,
        max: 150
    });

    // body
    req.check('body', "Body is required").notEmpty()
    req.check('body', "Body must be between 4 and 2000 characters").isLength({
        min: 4,
        max: 2000
    });

    // check for errors
    const errors = req.validationErrors();

    // show errors as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    // go to next middleware
    next();
}


exports.userSignupValidator = (req, res, next) => {
    // check if name isn't null and between 4-10 chars
    req.check("name", "Name is required").notEmpty()

    // check if email isn't null, but is valid and normalized
    req.check("email", "Email must be between 3 and 100 characters")
    .isEmail()
    .isLength({
        min: 4,
        max: 100
    })

    req.check('password', "Password is required").notEmpty();
    req.check('password')
    .isLength({
        min: 6
    })
    .withMessage("ya password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("your password needs at least one number")

    // check for errors
    const errors = req.validationErrors();

    // show errors as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    // go to next middleware
    next();
}

exports.userUpdateValidator = (req, res, next) => {
    // check if name isn't null and between 4-10 chars
    req.check("name", "Name is required").notEmpty()

    // check if email isn't null, but is valid and normalized
    req.check("email", "Email must be between 3 and 100 characters")
    .isEmail()
    .isLength({
        min: 4,
        max: 100
    })

    // will only fire if user doesnt want to change their password
    if (req.body.password !== "") {
        req.check('password', "Password is required").notEmpty();
        req.check('password')
        .isLength({
            min: 6
        })
        .withMessage("ya password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("your password needs at least one number")
    } else {
        delete req.body.password
    }


    // check for errors
    const errors = req.validationErrors();

    // show errors as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    // go to next middleware
    next();
}

