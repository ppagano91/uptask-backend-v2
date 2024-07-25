import type { Request, Response } from "express"
import Project from "../models/Project";
import colors from "colors"

export class ProjectController {
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {
                        manager: {$in: req.user.id}
                    },
                    {
                        team: {$in: req.user.id}
                    }
                ]
            });
            res.json({projects});
        } catch (error) {
            console.log(error);
            res.status(500).json({"msg": error});
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id).populate("tasks");

            if(!project){
                const error = new Error(`Proyecto con id=${id} no encontrado`)
                return res.status(404).json({error: error.message})
            }
            
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
                const error = new Error(`Acción no válida`)
                return res.status(401).json({error: error.message})
            }
            res.json({project});
        } catch (error) {
            console.log(error);
            res.status(500).json({"msg": error});
        }
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        project.manager = req.user.id;

        try {
            // Otra opción: await Project.create(req.body);
            await project.save();
            res.json({"msg":"Proyecto creado correctamente"})
        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.projectName = req.body.projectName;
            req.project.clientName = req.body.clientName;
            req.project.description = req.body.description;

            await req.project.save();
            res.json({"msg": `Proyecto actualizado`});
        } catch (error) {
            console.log(error);
            res.status(500).json({"msg": error});
        }
    }

    static deleteProjectById = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne();
            res.json({"msg": `Proyecto eliminado`});
        } catch (error) {
            console.log(error);
            res.status(500).json({"msg": error});
        }
    }
}