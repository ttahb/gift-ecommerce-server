const isAdmin = (req, res, next) => {
    console.log(req.payload.role)
    if(req.payload.role === 'admin'){
        next();
    } else {
        return res.status(401).json({message:"Unauthorized access."})
    }
}

module.exports = { isAdmin };