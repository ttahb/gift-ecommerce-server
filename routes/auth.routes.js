const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');


router.post('/signup', async (req, res, next) => {

    const { fullName, email, password, companyName, companySize } = req.body;

    if(fullName === "" || email === "" || password === ""){
        res.status(400).json({message: "Provide valid name, email and password"});
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        console.log('hello, testing')
      res.status(400).json({ message: 'Please provide a valid email address.' });
      return;
    } 

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        console.log('hello, testing')
      res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }

    try {
        const findUser = await User.findOne({ email });

        if(findUser){
            return res.status(400).json({ message: "User already exists"});
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync( password, salt);

        const createUser = await User.create({ email, password: hashPassword, fullName, companyName, companySize })
        if(!createUser){
            console.log('User not created.');
            return res.status(500).json({ message: "Internal Server Error"});
        }
        const payload = {email: createUser.email, fullName: createUser.fullName, userId: createUser._id, role: createUser.role};
        const token = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: '2h' }
        );

        return res.status(201).json({ authToken: token });

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error"});
    }
})

router.post ('/login', async (req, res, next) => {

    const { email, password } = req.body;
    console.log('email', email, 'password', password);

    if(!email && !password){
        res.status(400).json({ message: "Provide email and password."});
        return;
    }

    if(email === '' ||  password ===''){
        res.status(400).json({ message: "Email or password cannot be blank."});
        return;
    }

    try{

        const findUser = await User.findOne({ email })

        if(!findUser){
            console.log('here 1')
            res.status(400).json({ message: "Username or password incorrect."});
            return;

        }else{
            const passwordCheck = bcrypt.compareSync( password, findUser.password );

            if(passwordCheck){
                const payload = {email: findUser.email, fullName: findUser.fullName, userId: findUser._id, role: findUser.role};

                const token = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: '2h' }
                );

                return res.status(200).json({ authToken: token });
            } else {
                console.log('here 2')
                return res.status(400).json({ message: "Username or password incorrect." });
            }
        }

    } catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error "});
    }

})

router.get('/verify', isAuthenticated, (req, res, next ) => {
    console.log('payload ==> ', req.payload)
    res.status(200).json(req.payload);
})


module.exports = router;