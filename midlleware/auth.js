const User = require("../Models/user_model")
const { comparePasswords } = require("../cyrpto")
const { decryptData } = require("../cyrpto/jwt")

const auth = async (req, res, next) => {

    let decryptToken = decryptData(req.headers.authorization)
    // let txt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90YWpvbm1heG1hc29saXlldjc3NUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InFhcW51czMxMTIhIiwiaWF0IjoxNzExMzkxOTc4fQ.m5rlTKcOG0o7A5ffbhnEVdO3BaipsyX4Kfz0Vbc01Yc"
    // console.log(decryptData(txt));
    
    if (!decryptToken) {
        res.status(500).send("Iltimos qayta login qiling")
        return;
    }
    let { email, password } = await User.findOne({ email: decryptToken.email })
    let comaparePasswordAuth = comparePasswords(decryptToken.password, password)
    if (!email && !comaparePasswordAuth) {
        res.status(500).send("Iltimos qayta login qiling")
        return;
    }

    req.user = { email, password }
    next()
}

module.exports = auth