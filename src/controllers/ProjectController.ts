import type { Request, Response } from "express"
import Project from "../models/Project";
import colors from "colors"

export class ProjectController {
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({});
            res.json({projects});
        } catch (error) {
            console.log(error);
        }
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        try {
            // Otra opción: await Project.create(req.body);
            await project.save();
            res.json({"msg":"Proyecto creado correctamente"})
        } catch (error) {
            console.log(colors.red(error))
        }
    }
}