"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = __importDefault(require("../helpers/token"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const getAdmin = async (req, res) => {
    try {
        const admin_id = Number(req.params.admin_id);
        const admin = await prisma.user.findFirst({
            where: {
                id: admin_id,
                role: "admin",
            },
        });
        if (!admin) {
            return res.status(400).json({
                message: "Couldnt find admin!",
            });
        }
        res.status(200).json({
            admin,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const getAdmins = async (req, res) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: "admin" },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            admins,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const createAdmin = async (req, res) => {
    try {
        let { name, email, password, gender } = req.body;
        gender = gender.toLowerCase();
        if (name.length === 0 || name === null) {
            return res.status(400).json({
                message: "Assistant name is required!",
            });
        }
        if (!emailReg.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email!",
            });
        }
        if (email.length === 0 || email === null) {
            return res.status(400).json({
                message: "Assistant email is required!",
            });
        }
        if (password.length === 0 || password === null) {
            return res.status(400).json({
                message: "Assistant password is required!",
            });
        }
        if (gender.length === 0 || gender === null) {
            return res.status(400).json({
                message: "Assistant gender is required!",
            });
        }
        const userExist = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (userExist) {
            return res.status(409).json({
                statusCode: 409,
                message: "User already exist with given email!",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(String(password), 12);
        const admin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                gender,
            },
        });
        res.status(201).json({
            message: "Admin created succesfully!",
            admin,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const createSeedAdmin = async () => {
    const userROle = "admin";
    const doesAdminExist = await prisma.user.findFirst({
        where: {
            role: userROle,
        },
    });
    const hashedPassword = await bcryptjs_1.default.hash(String(process.env.ADMIN_PASSWORD), 12);
    if (!doesAdminExist) {
        await prisma.user.create({
            data: {
                name: "admin",
                email: String(process.env.ADMIN_EMAIL),
                password: hashedPassword,
                gender: "none",
                status: "active",
            },
        });
    }
};
// authentications
const login = async (req, res) => {
    const { email, password } = req.body;
    if ((email.length === 0 || password.length) === 0) {
        return res.status(401).json({
            message: "Mobile or Password is missing!",
        });
    }
    const user = await prisma.user.findFirst({
        where: {
            email,
            role: "admin",
        },
        select: {
            password: true,
        },
    });
    if (!user) {
        return res.status(401).json({
            message: "User doesnt exist with given emai!",
        });
    }
    const doestMatch = await bcryptjs_1.default.compare(String(password), String(user.password));
    if (!doestMatch) {
        return res.status(401).json({
            message: "Password is incorrect!",
        });
    }
    createSendToken(user, 200, res);
};
const createSendToken = (user, statusCode, res) => {
    const token = token_1.default.generateAccessToken(user.id, user.role);
    const timeLimit = 31536000000; // one year
    const cookieOptions = {
        expires: new Date(Date.now() + timeLimit),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res.cookie("token", token, cookieOptions);
    user.password = ""; // hide the user password
    res.status(statusCode).json({
        status: "Logged in successfully!",
        token,
        statusCode,
    });
};
const logout = async (req, res) => {
    try {
        return res.status(202).clearCookie("token").send({
            message: "Succesfully logged out!",
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
exports.default = {
    getAdmin,
    getAdmins,
    login,
    createAdmin,
    createSeedAdmin,
    logout,
};
//# sourceMappingURL=admin.controller.js.map