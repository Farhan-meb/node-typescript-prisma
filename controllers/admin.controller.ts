import { Request, Response } from "express";

const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

const getAdmin = async (req: Request, res: Response) => {};

export default {
    getAdmin,
};
