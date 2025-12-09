import { Request, Response } from "express";
import categoryService from "../services/category.service";
// Helper function to handle common MongoDB ID errors (e.g., CastError)
const handleError = (res: Response, error: any) => {
    console.error(error);
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    // Default server error
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
};


export class CategoryController {
    async create(req: Request, res: Response) {
        try {
            const category = await categoryService.createCategory(req.body);
            return res.status(201).json({ success: true, data: category });
        } catch (error) {
            // Catches duplicate key error (for unique category name) or validation errors
            if ((error as any).code === 11000) {
                return res.status(400).json({ success: false, message: "Category name already exists" });
            }
            return handleError(res, error);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const categories = await categoryService.getAllCategories();
            return res.status(200).json({ success: true, data: categories });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            return res.status(200).json({ success: true, data: category });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found for update" });
            }
            return res.status(200).json({ success: true, data: category });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const category = await categoryService.deleteCategory(req.params.id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Category not found for deletion" });
            }
            // 204 No Content is often used for successful deletion, but 200 with data is also fine
            return res.status(200).json({ success: true, message: "Category deleted successfully", data: category });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

export default new CategoryController();