const date = require("date-and-time");
const jwt = require("jsonwebtoken");



const now = new Date();



const authToken = {
    member: {
        set : ( req ) => {
            const secret = req.app.get("jwt-secret");
            const token = jwt.sign(
                {
                    userNum : req.params.userNum,
                    loginId: req.params.loginId,
                    weatherMerber : req.params.weatherMerber || false,
                    token_dtm : date.format(now, 'YYYY/MM/DD HH:mm:ss')
                },
                secret,
                {
                    expiresIn: '1d',
                    issuer : "volunteer", // 토큰 발급자
                    subject : "volunteerInfo" // 토큰 제목
                });
            return token;
        }
    },
    get : (req, token) => {
        try {
            const secret = req.app.get("jwt-secret");
            const decode = jwt.verify(token, secret);
            return decode;
        } catch(err) {
            return false;
        }
    }
}



module.exports = {
    authToken : authToken
}













































