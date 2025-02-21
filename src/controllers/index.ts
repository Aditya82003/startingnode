import { Request, Response } from "express"
import { User } from "../models/user"
import mongoose from "mongoose";

export async function handleAllUsers(_: Request, res: Response) {
    const allUsers = await User.find({})
    res.status(200).json(allUsers)
}

export async function handlePostRequest(req: Request, res: Response) {
    try {
        const { firstName, lastName, email, gender, jobTitle } = req.body;

        if (!firstName || !lastName || !email || !gender || !jobTitle) {
            res.status(400).json({ message: "Please enter all the details" });
            return
        }
        const result = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            gender: gender,
            jobTitle: jobTitle
        });
        console.log(result);
        res.status(201).json({ message: "Successfully Created", user: result._id });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return
    }
}
export async function handleUserByID(req: Request, res: Response) {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Please enter a valid user ID" });
        return
    }
    const user = await User.findById(id)
    if (!user) {
        res.status(400).send({ message: "User not found" })
        return
    }
    res.status(200).send(user)
}

export async function handleDeleteReq(req: Request, res: Response) {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Please enter a valid user ID" });
            return
        }
        const result = await User.findByIdAndDelete(id)
        if (!result) {
            res.status(404).json({ message: "User not found" })
            return
        }
        res.status(200).send({ message: "successfully deleted", UserName: result?.firstName })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export async function handlePatchReq(req: Request, res: Response) {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Please enter a valid user ID" });
        return
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedUser) {
            res.status(400).send({ message: "User not found" })
            return
        }
        console.log(updatedUser)
        res.status(200).json({ message: "User successfully updated", Time: updatedUser?.updatedAt })
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}