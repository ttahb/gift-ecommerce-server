const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const axios = require('axios');
const { google } = require('googleapis');


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
    // console.log('email', email, 'password', password);

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
    const evaluate = req.body.numb;
    console.log(evaluate)

    let redirectUri;
    if(evaluate === 0){
        console.log("from 0 ")
        redirectUri = process.env.REGISTER_REDIRECT_URI
    } else if (evaluate === 1) {
        console.log('from 1')
        redirectUri = process.env.LOGIN_REDIRECT_URI
    }

    try{

        const oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUri
        );

        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email openid'
        ];

        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });

        const response = {
            authorizationUrl,
            procces: "successful"
        };

        res.json(response);

    }catch(err){
        res.status(400).json({ errorMsg: "Internal Server Error"})
    }

})

router.get("/google-login/callback", async (req, res, next) => {
    const { code } = req.query;

    try{
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.LOGIN_REDIRECT_URI,
            code: code,
            grant_type: 'authorization_code'
        });
        // console.log("token response from google auth ==> ",tokenResponse.data);

        const accessToken = await tokenResponse.data.id_token;
        const decodeToken = await jwt.decode(accessToken);
        // console.log("decoded token here ==> ", decodeToken)

        const foundUser = await User.findOne({ email: decodeToken.email })

        if(foundUser){

            const payload = {
                email: foundUser.email, 
                fullName: foundUser.fullName, 
                userId: foundUser._id, 
                role: foundUser.role
            }

            const token = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '2h' }
            );

            res.cookie('JWToken', token, { path: '/' });
            res.send(`
                <script>
                    window.close();
                    window.opener.location.href = 'http://localhost:5173/verify-client';
                </script>
            `);
            
        } else {
            // res.status(400).json({ errorMsg: "Internal Server Error"})
            return res.status(400).send(`
                <div style="textAlign: 'center'">
                    <p style="color: 'red', fontSize: '16px'"> User with this email does not exist </p>
                </div>
            `);
        }

    }catch(err){
        res.status(400).json({ errorMsg: "Internal Server Error"});
    }
})

router.get("/google-register/callback", async (req, res, next) => {
    const { code } = req.query;

    try{

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REGISTER_REDIRECT_URI,
            code: code,
            grant_type: 'authorization_code'
        });
        // console.log("token response from google auth ==> ",tokenResponse.data);

        const accessToken = await tokenResponse.data.id_token;
        const decodeToken = await jwt.decode(accessToken);
        // console.log("decoded token here ==> ", decodeToken)

        const foundUser = await User.findOne({ email: decodeToken.email });

        if(foundUser){
            res.send(`
            <div style="textAlign: 'center'">
                    <p style="color: 'red', fontSize: '16px'"> User with this email already exist </p>
                </div>
        `);
        }

        if(!foundUser){
            const createUser = await User.create({ 
                email: decodeToken.email, 
                fullName: decodeToken.name, 
                companyName: '', 
                companySize: '0-100' 
            });
                // console.log("this is the created USer",createUser)
                
            if(!createUser){
                return res.status(500).json({ message: 'Internal Server Error'})
            };

            const payload = { 
                email: createUser.email, 
                fullName: createUser.fullName, 
                userId: createUser._id, role: 
                createUser.role
            };

            const token = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '2h'}
            );

            res.cookie('JWToken', token, { path: '/' });
            res.send(`
                <script>
                    window.close();
                    window.opener.location.href = 'http://localhost:5173/verify-client';
                </script>
            `);
        }
    } catch(err) {
        res.status(400).json({ errorMsg: "Internal Server Error"})
        console.log(err)
    } 
})

module.exports = router;