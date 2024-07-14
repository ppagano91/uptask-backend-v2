import { Request, Response } from "express"
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({email}).select("id email name");

        if(!user){
            const error = new Error("Usuario no encontrado");
            return res.status(404).json({message: error.message, error: true})
        }


        res.json({user});
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;
        
        const user = await User.findById(id).select("id name");
        
        if(!user){
            const error = new Error("Usuario no encontrado");
            return res.status(404).json({message: error.message, error: true})
        }

        if(req.project.team.some(member => member.toString() === user.id.toString())){
            const error = new Error("El Usuario ya existe en el proyecto");
            return res.status(409).json({message: error.message, error: true})
        }

        req.project.team.push(user.id);
        await req.project.save();

        res.json({msg: `${user.name} fue agregado al proyecto`});
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;

        if(!req.project.team.some(member => member.toString() === userId.toString())){
            const error = new Error("El Usuario no existe en el proyecto");
            return res.status(409).json({message: error.message, error: true})
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
        await req.project.save();

        const user = await User.findById(userId).select("id name");
        if(user){
            return res.json({msg: `${user.name} fue eliminado del proyecto`})
        }
        res.json({msg: `Usuario eliminado del proyecto`})
    }

    static getMembersProject = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate(
            {
                path: "team",
                select: "id name email"
            }
        );

        res.json({members:project.team})
    }
}