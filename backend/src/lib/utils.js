import jwt from 'jsonwebtoken';


export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt_token', token, {
        httpOnly: true, // accessible only by web server
        sameSite: 'strict', // CSRF protection
        secure: process.env.NODE_ENV === 'production', // allow http locally; secure only in prod
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return token;
}