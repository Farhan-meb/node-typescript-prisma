import jwt from 'jsonwebtoken';

const generateAccessToken = (id: Number, role: String) => {
    return jwt.sign({ id, role }, String(process.env.ACCESS_TOKEN_SECRET), {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
};

export default { generateAccessToken };
