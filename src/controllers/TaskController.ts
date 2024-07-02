import type { Request, Response } from "express";
import colors from "colors";
import Task from "../models/Task";
import Project from "../models/Project";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if(!project){
            const error = new Error(`Proyecto con id=${projectId} no encontrado`)
            return res.status(404).json({error: error.message})
        }

        try {
            const task = new Task(req.body);
            task.project = project.id;

            project.tasks.push(task.id);

            await task.save();
            await project.save();
            res.json({"msg":"Tarea creada correctamente"})
        } catch (error) {
            console.log(colors.red(error))
        }
    }
}

export default TaskController;