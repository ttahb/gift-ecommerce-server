# PIRINEOS GOURMET

[See it live](https://pirineosgourmet.netlify.app/).
----

# Introduction

Welcome to *Pirineos Gourmet* – Your Premier Destination for Exquisite Corporate Gifts! At Pirineos Gourmet, we understand the significance of expressing gratitude to your employees, especially during the festive season. Our meticulously curated selection of wine, cheese, jams, and gourmet delights offers an unparalleled opportunity to convey your appreciation in the most delightful and memorable manner.

# API Exposed

#### General Routes

- /api/products  GET POST
- /api/products/:productId GET PUT PATCH DELETE
- /api/orders GET POST
- /api/orders/:orderId GET PUT PATCH DELETE
- /api/users  GET POST
- /api/users/:userId  GET POST PUT PATCH

#### Auth Routes

- /auth/login POST
- /auth/signup POST
- /auth/verify GET

#### Image Upload

- /upload POST
- /delete POST

#### Payment Routes
- /api/create-payment-intent POST

## Programmer's Persepective

This project serves as the backend to our fullstack web application using MERN stack. The fronend for this project can be found [here](https://github.com/ttahb/gift-ecommerce-client).

## Tech Stack

Node.js, Express, MongoDB, JavScript, Cloudinary, Stripe

## How to install and deploy?

Go to the folder you want to clone the project. This project was created using [vite](https://vitejs.dev/guide/)
```
git clone https://github.com/ttahb/gift-ecommerce-server.git
cd gift-ecommerce-server
npm install

```
## Set Environment Variables

You will need to create a .env file at root location of the project to setup all properties: - 
```
PORT=5005
ORIGIN=http://localhost:5173
TOKEN_SECRET='give some secret'
CLOUDINARY_NAME='your-cloudinary-name'
CLOUDINARY_KEY='your-cloudinary-key'
CLOUDINARY_SECRET='your-cloudinary-secret'
STRIPE_SECRET_KEY='your_stripe_secret_key'
```
http://localhost:5173 points to the frontend. Please follow the readme for frontend  [here](https://github.com/ttahb/gift-ecommerce-client/blob/master/README.md).
Also, please follow stripe documentation to create developer test account and get your private and publishable secret key. [Stripe](https://stripe.com/in/resources/more/how-to-integrate-a-payment-gateway-into-a-website). Private key will be used when you are setting up the backend, please read backend readme for that purpose.

## Deploy
Once done with creating with .env file, run the app using
```
npm run dev
```
After you do the above steps, you should be able to check the site at  localhost:5005 ( or check your logs for default port)


## Authors

- [Mayo Socas](https://github.com/Mayo9704)
- [Ivan Pavlov](https://github.com/12Ivan03)
- [Vijay Bhatt](https://github.com/ttahb)


