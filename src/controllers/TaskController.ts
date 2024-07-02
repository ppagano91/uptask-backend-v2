import type { Request, Response } from "express";
import colors from "colors";
import Task from "../models/Task";
import Project from "../models/Project";

export class TaskController {
    static createTask = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body);
            task.project = req.project.id;

            req.project.tasks.push(task.id);

            await task.save();
            await req.project.save();
            res.json({"msg":"Tarea creada correctamente"})
        } catch (error) {
            console.log(colors.red(error))
        }
    }
}

export default TaskController;