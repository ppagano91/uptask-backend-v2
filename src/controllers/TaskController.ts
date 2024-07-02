import type { Request, Response } from "express";
import colors from "colors";
import Task from "../models/Task";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body);
            task.project = req.project.id;

            req.project.tasks.push(task.id);

            await Promise.allSettled([task.save(), req.project.save()]);
            res.json({"msg":"Tarea creada correctamente"})
        } catch (error) {
            console.log(colors.red(error))
            res.status(500).json({"msg": error});
        }
    }

    static getAllTasksByProject = async (req: Request, res: Response) => {

        try {
            const tasks = await Task.find({project: req.project.id}).populate("project");
            res.status(200).json({tasks});

        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});

        }
    }

    static getTaskById = async (req: Request, res: Response) => {

        const { taskId } = req.params;

        try {
            const task = await Task.findById(taskId);

            if(!task){
                const error = new Error(`Tarea con id=${taskId} no encontrada`);
                res.status(404).json({msg: error.message, error: true});
            }

            if(task.project.toString() !== req.project.id){
                const error = new Error(`Acción no válida`);
                res.status(400).json({msg: error.message, error: true});
            }

            res.status(200).json({task});

        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});

        }
    }
}

export default TaskController;