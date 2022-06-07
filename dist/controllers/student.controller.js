"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __importDefault(require("../helpers/email"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const getStudent = async (req, res) => {
    try {
        const student_id = Number(req.params.student_id);
        const student = await prisma.user.findFirst({
            where: {
                id: student_id,
                role: "student",
            },
            include: {
                studyGroups: true,
            },
        });
        if (!student) {
            return res.status(400).json({
                message: "Couldnt find student!",
            });
        }
        res.status(200).json({
            student,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const getStudents = async (req, res) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: "student" },
            include: {
                studyGroups: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            students,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const createStudent = async (req, res) => {
    try {
        let { name, email, gender, placeOfBirth, dateOfBirth } = req.body;
        gender = gender.toLowerCase();
        if (name.length === 0 || name === null) {
            return res.status(400).json({
                message: "Student name is required!",
            });
        }
        if (!emailReg.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email!",
            });
        }
        if (email.length === 0 || email === null) {
            return res.status(400).json({
                message: "Student email is required!",
            });
        }
        if (gender.length === 0 || gender === null) {
            return res.status(400).json({
                message: "Student email is required!",
            });
        }
        if (placeOfBirth.length === 0 || placeOfBirth === null) {
            return res.status(400).json({
                message: "Student place of birth is required!",
            });
        }
        if (dateOfBirth === null) {
            return res.status(400).json({
                message: "Student date of birth is required!",
            });
        }
        const studentExist = await prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (studentExist) {
            return res.status(409).json({
                statusCode: 409,
                message: "Student already exist with given email!",
            });
        }
        const student = await prisma.user.create({
            data: {
                name,
                email,
                gender,
                role: "student",
                placeOfBirth,
                dateOfBirth,
                image: "",
            },
            include: {
                studyGroups: true,
            },
        });
        await email_1.default.sendEmail(student.email, "Account created!", `Your student account is created with name '${student.name}'`);
        const students = await prisma.user.findMany({
            where: { role: "student" },
            include: {
                studyGroups: true,
            },
        });
        res.status(201).json({
            message: "Student created succesfully!",
            student,
            students,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const updateStudent = async (req, res) => {
    try {
        const student_id = Number(req.params.student_id);
        let { name, email, gender, placeOfBirth, dateOfBirth } = req.body;
        gender = gender.toLowerCase();
        if (name.length === 0 || name === null) {
            return res.status(400).json({
                message: "Student name is required!",
            });
        }
        if (!emailReg.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email!",
            });
        }
        if (email.length === 0 || email === null) {
            return res.status(400).json({
                message: "Student email is required!",
            });
        }
        if (placeOfBirth.length === 0 || placeOfBirth === null) {
            return res.status(400).json({
                message: "Student place of birth is required!",
            });
        }
        if (dateOfBirth.length === 0 || dateOfBirth === null) {
            return res.status(400).json({
                message: "Student date of birth is required!",
            });
        }
        checkIfStudentExist(student_id, res);
        const student = await prisma.user.update({
            where: {
                id: student_id,
            },
            data: {
                name,
                email,
                gender,
                placeOfBirth,
                dateOfBirth,
            },
            include: {
                studyGroups: true,
            },
        });
        await email_1.default.sendEmail(student.email, "Account updated!", `Your student account infromaions are updated!`);
        const updatedStudent = await prisma.user.findFirst({
            where: {
                id: student_id,
                role: "student",
            },
        });
        res.status(200).json({
            message: "Student succesfully updated!",
            updatedStudent,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const deleteStudent = async (req, res) => {
    try {
        const student_id = Number(req.params.student_id);
        const studentExist = await prisma.user.findFirst({
            where: {
                id: student_id,
            },
            include: {
                studyGroups: true,
            },
        });
        if (!studentExist) {
            return res.status(404).json({
                statusCode: 404,
                message: "Student doesnt exist!",
            });
        }
        const studentEmail = studentExist.email;
        await prisma.user.delete({
            where: {
                id: student_id,
            },
        });
        await email_1.default.sendEmail(studentEmail, "Account updated!", `Your student account infromaions are updated!`);
        const students = await prisma.user.findMany({
            where: { role: "student" },
            include: {
                studyGroups: true,
            },
        });
        res.status(200).json({
            message: "Successfully deleted student!",
            students,
        });
    }
    catch (err) {
        res.status(400).json({
            messsage: "Somethin went wrong!",
        });
    }
};
const updateStudentStatus = async (req, res) => {
    const student_id = Number(req.params.student_id);
    const { status } = req.body;
    checkIfStudentExist(student_id, res);
    const student = await prisma.user.update({
        where: {
            id: student_id,
        },
        data: {
            status,
        },
        include: {
            studyGroups: true,
        },
    });
    res.status(200).json({
        message: "Successfully updated students status",
        student,
    });
};
const addtoGroup = async (req, res) => {
    try {
        const { group_ids } = req.body;
        const student_id = Number(req.params.student_id);
        if (group_ids.length <= 0) {
            return res.status(209).json({
                message: "Minimum one group is required!",
            });
        }
        let student = await prisma.user.findFirst({
            where: { id: student_id, role: "student" },
            include: { studyGroups: true },
        });
        if (student?.studyGroups && student.studyGroups.length >= 4) {
            return res.status(200).json({
                message: "Student is already assigned to maximum 4 groups!",
            });
        }
        let succesfullyAssigned = 0;
        let _student;
        for (let group_id of group_ids) {
            const isGroupAlreadyAssigned = student?.studyGroups?.some((group) => {
                return group.id === Number(group_id);
            });
            if (isGroupAlreadyAssigned) {
                continue;
            }
            _student = await prisma.user.update({
                where: {
                    id: student_id,
                },
                data: {
                    studyGroups: {
                        connect: { id: group_id },
                    },
                },
                include: {
                    studyGroups: true,
                },
            });
            if (_student &&
                _student.studyGroups &&
                _student.studyGroups.length >= 4) {
                return res.status(200).json({
                    message: `Student is assigned to maximum 4 groups! Success : ${succesfullyAssigned} | Failed : ${group_ids.length - succesfullyAssigned}`,
                    succesfullyAssigned,
                    failedToAssign: group_ids.length - succesfullyAssigned,
                    updateStudent: _student,
                });
            }
            succesfullyAssigned += 1;
        }
        if (student) {
            await email_1.default.sendEmail(student.email, "Added to groups!", succesfullyAssigned > 1
                ? `Your have been added to ${succesfullyAssigned} new groups!`
                : `Your have been added to ${succesfullyAssigned} new group!`);
        }
        const updatedStudent = await prisma.user.findFirst({
            where: {
                id: student_id,
                role: "student",
            },
        });
        res.status(200).json({
            message: `Student added to the given group! Success : ${succesfullyAssigned} | Failed : ${group_ids.length - succesfullyAssigned}`,
            succesfullyAssigned,
            failedToAssign: group_ids.length - succesfullyAssigned,
            updatedStudent,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const removeFromGroup = async (req, res) => {
    try {
        const { group_id } = req.body;
        const student_id = Number(req.params.student_id);
        const student = await prisma.user.findFirst({
            where: {
                id: student_id,
                role: "student",
            },
            include: {
                studyGroups: true,
            },
        });
        const isGroupAssignedToStudent = student?.studyGroups?.some((group) => {
            return group.id === Number(group_id);
        });
        let subjectName = "";
        if (student && student.studyGroups) {
            for (let group of student.studyGroups) {
                if (group.id === Number(group_id)) {
                    subjectName = group.subject;
                }
            }
        }
        if (!isGroupAssignedToStudent) {
            return res.status(400).json({
                message: "Given group is not assigned to the student!",
            });
        }
        const _student = await prisma.user.update({
            where: {
                id: student_id,
            },
            data: {
                studyGroups: {
                    disconnect: {
                        id: group_id,
                    },
                },
            },
            include: {
                studyGroups: true,
            },
        });
        await email_1.default.sendEmail(_student.email, "Deleted from group!", `You have been removed from group ${subjectName}`);
        res.status(200).json({
            messsage: "Student have been deleted from the selected group!",
            student: _student,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const checkIfStudentExist = async (id, res) => {
    const studentExist = await prisma.user.findFirst({
        where: {
            id,
            role: "student",
        },
    });
    if (!studentExist) {
        return res.status(404).json({
            statusCode: 404,
            message: "Student doesnt exist with given email!",
        });
    }
};
const checkValidation = (data, res) => {
    if (!data) {
        return res.status(204).json({
            message: "Fill all required fields!",
        });
    }
};
exports.default = {
    getStudent,
    getStudents,
    updateStudentStatus,
    createStudent,
    addtoGroup,
    removeFromGroup,
    updateStudent,
    deleteStudent,
};
//# sourceMappingURL=student.controller.js.map