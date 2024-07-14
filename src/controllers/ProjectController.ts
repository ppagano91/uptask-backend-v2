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
        const { id } = req.params;
        try {
            const project = await Project.findById(id);

            if(!project){
                const error = new Error(`Proyecto con id=${id} no encontrado`)
                return res.status(404).json({error: error.message})
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error(`No tiene permiso para actualizar el proyecto`);
                return res.status(401).json({error: error.message});
            }

            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;

            await project.save();
            res.json({"msg": `Proyecto con id=${id} actualizado`});
        } catch (error) {
            console.log(error);
            res.status(500).json({"msg": error});
        }
    }

    static deleteProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id);

            if(!project){
                const error = new Error(`Proyecto con id=${id} no encontrado`);
                return res.status(404).json({error: error.message});
            }

            if(project.manager.toString() !== req.user.id.toString()){
                const error = new Error(`No tiene permiso para eliminar el proyecto`);
                return res.status(401).json({error: error.message});
            }

            await project.deleteOne();
            res.json({"msg": `Proyecto con id=${id} fue eliminado`});
        } catch (error) {
            console.log(error);
            res.status(500).json({"msg": error});
        }
    }
}