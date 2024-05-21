// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

const { isAuthenticated } = require('./middleware/jwt.middleware');

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


// 👇 Start handling routes here
const fileRoutes = require("./routes/uploadFile.routes");
app.use("/api", fileRoutes);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const authGoogleRouter = require("./routes/auth-google.routes");
app.use("/auth-google", authGoogleRouter);

const productRouter = require("./routes/product.routes");
app.use("/api", productRouter);

const orderRouter = require("./routes/order.routes");
app.use("/api", isAuthenticated, orderRouter);

const userRoutes = require("./routes/user.routes");
app.use("/api", isAuthenticated, userRoutes);

const paymentRoutes = require('./routes/payments.routes');
app.use('/api', paymentRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
