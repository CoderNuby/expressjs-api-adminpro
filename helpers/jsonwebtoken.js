const jsonwebtoken = require("jsonwebtoken");

function generateJsonWebToken(_id) {
    return new Promise((resolve, reject) => {
        const payload = {
            _id
        }
        jsonwebtoken.sign(payload, process.env.JWT_PRIVATE_KEY, {
            expiresIn: '10d'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject("It can not generated token");
            }else{
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJsonWebToken
}