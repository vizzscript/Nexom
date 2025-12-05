import { Request, Response } from "express";
import serviceService from "../services/service.service";

export class ServiceController{
    async create(req: Request, res: Response){
        const service = await serviceService.createService(req.body);
        return res.status(201).json({success: true, data: service});
    }

    async getAll(req: Request, res: Response){
        const services  = await serviceService.getAllServices();
        return res.status(200).json({success: true, data: services});
    }

    async getOne(req: Request, res: Response){
        const service = await serviceService.getServiceById(req.params.id);
        return res.status(200).json({success: true, data: service});
    }

    async delete(req: Request, res: Response){
        const service = await serviceService.deleteService(req.params.id);
        return res.status(200).json({success: true, data: service});
    }
}

export default new ServiceController();