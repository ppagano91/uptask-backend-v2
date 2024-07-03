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

        try {
            if(req.task.project.toString() !== req.project.id){
                const error = new Error(`Acción no válida`);
                return res.status(400).json({msg: error.message, error: true});
            }

            if(req.task) res.status(200).json({task: req.task});

        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});

        }
    }

    static updateTask = async (req: Request, res: Response) => {

        try {
            if(req.task.project.toString() !== req.project.id){
                const error = new Error(`Acción no válida`);
                return res.status(400).json({msg: error.message, error: true});
            }

            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save()

            res.json({"msg": `Tarea con id=${req.task.id} actualizada`});

        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});

        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            if(req.task.project.toString() !== req.project.id){
                const error = new Error(`Acción no válida`);
                return res.status(400).json({msg: error.message, error: true});
            }
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString());

            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

            res.status(200).json({msg: `Tarea con id=${req.task.id} fue eliminada`});

        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});

        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        const { status } = req.body;

        try {
            if(req.task.project.toString() !== req.project.id){
                const error = new Error(`Acción no válida`);
                return res.status(400).json({msg: error.message, error: true});
            }

            req.task.status = status;

            await req.task.save();

            res.status(200).json({msg: `Estado de Tarea actualizado`});

        } catch (error) {
            console.log(colors.red(error));
            res.status(500).json({"msg": error});

        }
    }
}

export default TaskController;