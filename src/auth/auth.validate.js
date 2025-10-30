const validateSignUpCoordinator = [
    body("username").Lenght({min: 6}).withMessage("Invalid Username"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLenght({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("phone").isLenght({min: 3}).withMessage("Phone must be at least 3 characters long"),
    body("position").isLenght({min: 20}).withMessage("Position must be at least 20 characters long"),
];

const validateSignUpVolunteer = [
    body("username").Lenght({min: 6}).withMessage("Invalid Username"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLenght({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("phone").isLenght({min: 3}).withMessage("Phone must be at least 3 characters long"),
    body("availability").isLenght({min: 20}).withMessage("Availability must be at least 20 characters long"),
    body("speciality").isLenght({min: 25}).withMessage("Speciality must be at least 25 characters long"),
    body("HoursContributed").isLenght({min:2}).withMessage("HoursContributed must be a number"),
]; //Hours contributed como se hace para verificar que sea un numero?

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
};