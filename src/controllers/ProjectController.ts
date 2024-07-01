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

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);

            if(!project){
                const error = new Error(`Proyecto con id=${id} no encontrado`)
                return res.status(404).json({error: error.message})
            }
            res.json({project});
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

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findByIdAndUpdate(id, req.body);

            if(!project){
                const error = new Error(`Proyecto con id=${id} no encontrado`)
                return res.status(404).json({error: error.message})
            }

            await project.save();
            res.json({"msg": `Proyecto con id=${id} actualizado`});
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);

            if(!project){
                const error = new Error(`Proyecto con id=${id} no encontrado`)
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne();
            res.json({"msg": `Proyecto con id=${id} fue eliminado`});
        } catch (error) {
            console.log(error);
        }
    }
}