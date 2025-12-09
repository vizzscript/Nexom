import { Request, Response } from "express";
import serviceService from "../services/service.service";
// Helper function to handle common MongoDB ID errors (e.g., CastError)
const handleError = (res: Response, error: any) => {
    console.error(error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    // Default server error
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
};

export class ServiceController {
    async create(req: Request, res: Response) {
        try {
            const service = await serviceService.createService(req.body);
            return res.status(201).json({ success: true, data: service });
        } catch (error) {
            // Catches Mongoose validation errors or server issues
            return handleError(res, error);
        }
    }

    async bulkCreate(req: Request, res: Response) {
        try {
            // Validate that the payload is an array
            if (!Array.isArray(req.body)) {
                return res.status(400).json({ success: false, message: "Payload must be an array of services for bulk creation." });
            }

            const services = await serviceService.bulkCreateServices(req.body);

            // Note: services.length will indicate the number of documents successfully created.
            return res.status(201).json({
                success: true,
                count: services.length,
                message: `${services.length} services created successfully.`,
                data: services
            });
        } catch (error) {
            // This will catch the "Category not found" error thrown in the service layer, 
            // as well as any Mongoose validation/uniqueness errors during insertMany.
            return handleError(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const services = await serviceService.getAllServices();
            return res.status(200).json({ success: true, data: services });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const service = await serviceService.getServiceById(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "Service not found" });
            }
            return res.status(200).json({ success: true, data: service });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const service = await serviceService.updateService(req.params.id, req.body);
            if (!service) {
                return res.status(404).json({ success: false, message: "Service not found for update" });
            }
            return res.status(200).json({ success: true, data: service });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const service = await serviceService.deleteService(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "Service not found for deletion" });
            }
            return res.status(200).json({ success: true, message: "Service deleted successfully", data: service });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

export default new ServiceController();