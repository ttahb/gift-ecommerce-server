const router = require("express").Router();
const User = require("../models/User.model");
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const axios = require('axios');
const { google } = require('googleapis');

router.post('/login', async (req,res, next) => {
    const evaluate = req.body.numb;

    let redirectUri;
    if(evaluate === 0){
        redirectUri = process.env.REGISTER_REDIRECT_URI;
    } else if (evaluate === 1) {
        redirectUri = process.env.LOGIN_REDIRECT_URI;
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
        res.status(400).json({ errorMsg: "Internal Server Error"});
    }

})

router.get("/login/callback", async (req, res, next) => {
    const { code } = req.query;

    try{
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.LOGIN_REDIRECT_URI,
            code: code,
            grant_type: 'authorization_code'
        });

        const accessToken = await tokenResponse.data.id_token;
        const decodeToken = await jwt.decode(accessToken);

        const foundUser = await User.findOne({ email: decodeToken.email });

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

router.get("/register/callback", async (req, res, next) => {
    const { code } = req.query;

    try{

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REGISTER_REDIRECT_URI,
            code: code,
            grant_type: 'authorization_code'
        });

        const accessToken = await tokenResponse.data.id_token;
        const decodeToken = await jwt.decode(accessToken);

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
        res.status(400).json({ errorMsg: "Internal Server Error"});
    } 
})

module.exports = router;