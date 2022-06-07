"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = __importDefault(require("../helpers/email"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkValidation = (data, res) => {
    if (!data) {
        return res.status(204).json({
            message: "Fill all required fields!",
        });
    }
};
const checkIfGroupExist = async (id, res) => {
    const doesExist = await prisma.group.findUnique({
        where: {
            id,
        },
    });
    if (!doesExist) {
        return res.status(404).json({
            message: "Group doesnt exist!",
        });
    }
};
const getGroup = async (req, res) => {
    try {
        const group_id = Number(req.params.group_id);
        const group = await prisma.group.findUnique({
            where: {
                id: group_id,
            },
            include: {
                students: true,
            },
        });
        if (!group) {
            return res.status(400).json({
                message: "Couldnt find the group!",
            });
        }
        res.status(200).json({
            group,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const getGroups = async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            groups,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const createGroup = async (req, res) => {
    try {
        const { name, leader, subject, scheduleTime } = req.body;
        if (name.length === 0 || name === null) {
            return res.status(400).json({
                message: "Group name is required!",
            });
        }
        if (leader.length === 0 || leader === null) {
            return res.status(400).json({
                message: "Group leader is required!",
            });
        }
        if (subject.length === 0 || subject === null) {
            return res.status(400).json({
                message: "Group subject is required!",
            });
        }
        if (scheduleTime.length === 0 || scheduleTime === null) {
            return res.status(400).json({
                message: "Group schedule time is required!",
            });
        }
        const group = await prisma.group.create({
            data: {
                name,
                leader,
                subject,
                scheduleTime,
            },
        });
        const groups = await prisma.group.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(201).json({
            message: "Study group created succesfully!",
            group,
            groups,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const updateGroup = async (req, res) => {
    try {
        const group_id = Number(req.params.group_id);
        const { name, leader, subject, scheduleTime } = req.body;
        if (name.length === 0 || name === null) {
            return res.status(400).json({
                message: "Group name is required!",
            });
        }
        if (leader.length === 0 || leader === null) {
            return res.status(400).json({
                message: "Group leader is required!",
            });
        }
        if (subject.length === 0 || subject === null) {
            return res.status(400).json({
                message: "Group subject is required!",
            });
        }
        if (scheduleTime.length === 0 || scheduleTime === null) {
            return res.status(400).json({
                message: "Group schedule time is required!",
            });
        }
        checkIfGroupExist(group_id, res);
        const group = await prisma.group.update({
            where: {
                id: group_id,
            },
            data: {
                name,
                leader,
                subject,
                scheduleTime,
            },
        });
        const updatedGroup = await prisma.group.findFirst({
            where: { id: group_id },
        });
        res.status(200).json({
            message: "Group updated succesfully!",
            updatedGroup,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const deleteGroup = async (req, res) => {
    try {
        const group_id = Number(req.params.group_id);
        checkIfGroupExist(group_id, res);
        await prisma.group.delete({
            where: {
                id: group_id,
            },
        });
        const groups = await prisma.group.findMany({});
        res.status(200).json({
            message: "Group deleted succesfully!",
            groups,
        });
    }
    catch (err) {
        res.status(400).json({
            message: "Something went wrong!",
        });
    }
};
const assignStudents = async (req, res) => {
    const group_id = Number(req.params.group_id);
    const { student_ids } = req.body;
    checkIfGroupExist(group_id, res);
    const group = await prisma.group.findFirst({
        where: {
            id: group_id,
        },
        include: {
            students: true,
        },
    });
    let succesfullyAssigned = 0;
    for (let student_id of student_ids) {
        const student = await prisma.user.findFirst({
            where: {
                id: student_id,
                role: "student",
            },
            include: {
                studyGroups: true,
            },
        });
        const isGroupAlreadyAssigned = student?.studyGroups?.some((group) => {
            return group.id === Number(group_id);
        });
        if ((student && student.studyGroups && student.studyGroups.length >= 4) ||
            isGroupAlreadyAssigned) {
            continue;
        }
        await prisma.group.update({
            where: {
                id: group_id,
            },
            data: {
                students: {
                    connect: {
                        id: student_id,
                    },
                },
            },
        });
        succesfullyAssigned += 1;
        if (student) {
            await email_1.default.sendEmail(student.email, "Added to group!", `Your have been added to a new group '${group?.subject}'!`);
        }
    }
    const updatedGroup = await prisma.group.findFirst({
        where: {
            id: group_id,
        },
    });
    return res.status(200).json({
        message: `Students are assigned in this groups! Success : ${succesfullyAssigned} | Failed : ${student_ids.length - succesfullyAssigned}`,
        failedReason: "Failed students are already in maximum of 4 groups Or already assigned to this group!",
        succesfullyAssigned,
        failedToAssign: student_ids.length - succesfullyAssigned,
        updatedGroup,
    });
};
const removeStudent = async (req, res) => {
    const group_id = Number(req.params.group_id);
    const { student_id } = req.body;
    checkIfGroupExist(group_id, res);
    const group = await prisma.group.findFirst({
        where: {
            id: group_id,
        },
        include: {
            students: true,
        },
    });
    const isStudentAssignedToGroup = group?.students?.some((student) => {
        return student.id === Number(student_id);
    });
    if (!isStudentAssignedToGroup) {
        return res.status(400).json({
            message: "Student isn't assigned to this group!",
        });
    }
    const _group = await prisma.group.update({
        where: {
            id: group_id,
        },
        data: {
            students: {
                disconnect: {
                    id: student_id,
                },
            },
        },
    });
    let studentEmail = "";
    if (group && group.students) {
        for (let student of group?.students) {
            if (student.id === Number(student_id)) {
                studentEmail = student.email;
            }
        }
        await email_1.default.sendEmail(studentEmail, "Removed from group!", `Your have been removed from a group '${_group.subject}'!`);
    }
    const updatedGroup = await prisma.group.findFirst({
        where: {
            id: group_id,
        },
    });
    res.status(200).json({
        message: "Student successfully removed from this group!",
        updatedGroup,
    });
};
exports.default = {
    getGroup,
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    assignStudents,
    removeStudent,
};
//# sourceMappingURL=group.controller.js.map