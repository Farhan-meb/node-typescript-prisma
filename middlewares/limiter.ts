const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit login IP to 10 requests per windowMs
    message: 'Too many login request in 1 minute!',
});

export default { loginLimiter };
