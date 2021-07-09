import { UserRegirster, Userimage } from "../../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendSms } from "../service/otp.js";
import { generateOTP } from "../service/generateOtp";
import  multer from 'multer';
import path from'path';

const userRegisters = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await UserRegirster.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
        });
        const saveUser = await createUser.save();
        if (!saveUser) {
            res.status(400).send({
                status: 400,
                message: "User Registration Failed!!",
            });
        } else {
            const verification = generateOTP();
            res.status(200).send({
                status: 200,
                message: "User Registration Successful!!",
                data: createUser,
                verification,
            });
        }
    } catch (error) {
        console.log("error Catched", error);
        res.status(400).send({ status: 400, message: error.message });
    }
};

const logUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await UserRegirster.findOne({
            where: { email: email },
        });
        if (!findUser) {
            res.status(400).send({
                status: 400,
                message: "User Not Found!!",
                data: {},
            });
        } else {
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) {
                res.status(400).send({
                    status: 400,
                    message: "Please enter valid password",
                });
            } else {
                const payload = {
                    firstName: findUser.firstName,
                    lastName: findUser.lastName,
                    email: findUser.email,
                    password: findUser.password,
                };
                const phone = 7285069535;
                const message = `your verification code is ${generateOTP()}`;
                const token = jwt.sign(payload, "secret key");
                sendSms(phone, message);

                res.status(200).send({
                    status: 200,
                    message: "User Logged in successfully!!",
                    data: { token: token },
                });
            }
        }
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message,
        });
    }
};

const allUser = async (req, res) => {
    try {
        const allUsers = await UserRegirster.findAll();
        if (!allUsers) {
            res.status(400).send({
                status: 400,
                message: "Sorry!! no users founded!!!",
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "user founded ",
                data: allUsers,
            });
        }
    } catch (error) {
        res.status(400).send({ status: 400, message: error.message });
        console.log(error);
    }
};

const userImages = async (req, res) => {
    try {
        const Image = req.file.path;
        const { userId } = req.body;
        const uploadimage = await Userimage.create({
            Image,
            userId,
        });
        const saveImage = await uploadimage.save();
        if (!saveImage) {
            res.status(400).send({
                status: 400,
                message: "Image Upload Failed",
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "Image Uploaded Successfully",
                data: saveImage,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: "Some Error Catched",
            data: error.message,
        });
    }
};

const userProfile = async (req, res) => {
    try {
        const getProfile = await UserRegirster.findAll({
            include: [
                {
                    model: Userimage,
                    as: "userImage",
                },
            ],
        });

        if (!getProfile) {
            res.status(400).send({
                status: 400,
                message: "User Not Found!!",
                data: error.message,
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "Profile Founded!!",
                data: getProfile,
            });
        }
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: "Some Error Catched",
            data: error.message,
        });
    }
};

export { userRegisters, logUser, allUser, userImages, userProfile };

// d81ae015d51842ad910ff4935c85c159
