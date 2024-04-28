const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const axios = require('axios');


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

                console.log('this is the token we have created =====> HERE +==========>  ', token)

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

// Google login and register... maybe to put them in the same path? 

router.post('/login-google', async (req,res, next) => {

    const googleToken = req.body.token;
    console.log('this is the req.body i have recieved ===> ', googleToken);
    if (typeof googleToken !== 'string') {
        return res.status(400).json({ message: 'Internal Server Error'})
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`)
        console.log("this is the respince from teh call to the googleapis ===> ",response.data.email)
        const foundUser = await User.findOne({ email: response.data.email })

        if(foundUser) {
            // console.log('this is the foudn user from the DB ===> here he is ==>', foundUser)
            const payload = {email: foundUser.email, fullName: foundUser.fullName, userId: foundUser._id, role: foundUser.role};

                const token = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: '2h' }
                );

                return res.status(200).json({ authToken: token });
        
        } else {
            return res.status(401).json({message: 'Non existing user'})
        }

    } catch(err) {
        // console.log(err)
        return res.status(400).json({ message: 'Internal Server Error'})
    }

})

router.post("/register-google", async (req, res, next) => {

    const googleToken = req.body.token
    if(typeof googleToken !== "string"){
        return res.status(400).json({ message: 'Internal Server Error'})
    }

    try{

        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleToken}`)
            // console.log(response.data)
        const findUser = await User.findOne({ email: response.data.email})

        if(findUser){
            return res.status(400).json( { message: 'User is already registered with this email' } )
        }

        const createUser = await User.create({ email: response.data.email, fullName: response.data.name, companyName: '', companySize: '0-100' })
            // console.log("this is the created USer",createUser)
            
        if(!createUser){
            return res.status(500).json({ message: 'Internal Server Error'})
        }

        const payload = { email: createUser.email, fullName: createUser.fullName, userId: createUser._id, role: createUser.role}
        const token = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: '2h'}
        );

        return res.status(200).json({ authToken: token})

    }catch(err){
        console.log(err)
        response.status(400).json({ message: 'Internal Server Error'})
    }
})

// router.get('/yahoo-login', (req, res, next) => {
//     const clientId = 'dj0yJmk9N3poeU0ya2M5OTZrJmQ9WVdrOU9GWTRlbXBTTXprbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTBk';
//     const clientSecret = 'b46f200d7bef37f8772a203eca13ef99c96a806c'
//     const redirectUri = '/yahoo-register/callback';
//     // 'http://localhost:5005/auth'

//     const yahooTokenAsk = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
//     //?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code
//     console.log('hello bfore the redirect to YAHOO')
//     console.log(res)
//     res.redirect(yahooTokenAsk)
// })

// router.post('/yahoo-register/callback', (req, res, next) => {
//     // passport.authenticate('yahoo', { failureRedirect: '/login' }),
//     console.log('hello bfore the POST yahoo ?')
//     const { code } = req.query

//     console.log("this is the code form the yahoo", req.query)
// })


module.exports = router;