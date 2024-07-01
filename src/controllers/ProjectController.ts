import type { Request, Response } from "express"
import Project from "../models/Project";
import colors from "colors"

export class ProjectController {
    static getAllProjects = async (req: Request, res: Response) => {
        res.send("Todos los proyectos");
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        try {
            // Otra opción: await Project.create(req.body);
            await project.save();
            res.send("Proyecto creado correctamente")
        } catch (error) {
            console.log(colors.red(error))
        }
    }
}