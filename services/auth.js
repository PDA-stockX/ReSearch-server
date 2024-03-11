const jwt = require("jsonwebtoken");

function createToken(visibleUser, maxAge = 60 * 60 * 24 * 3) {
    return jwt.sign(
        visibleUser,
        process.env.JWT_SECRET || "my-jwt-secret", {
            expiresIn: maxAge,
        });
}

function verifyToken(_token) {
    if (!_token) {
        return null;
    }
    return jwt.verify(
        _token, process.env.JWT_SECRET || "my-jwt-secret"
    );
}

async function authenticate(req, res, next) {
    let token = req.cookies.authToken;
    let headerToken = req.headers.authorization;

    if (!token && headerToken) {
        token = headerToken.split(" ")[1];
    }

    const user = verifyToken(token);
    req.user = user;

    if (!user) {
        const error = new Error("Authorization Failed");
        error.status = 403;
        throw (error);
    }
    next();
}

module.exports = {
    createToken,
    verifyToken,
    authenticate,
};