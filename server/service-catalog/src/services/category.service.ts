import categoryModel, { ICategory } from "../models/category.model";

class CategoryClass {
    /**
     * Creates a new category document.
     * @param data - The category data (e.g., { name: 'Cleaning' }).
     */
    async createCategory(data: Partial<ICategory>) {
        return await categoryModel.create(data);
    }

    /**
     * Retrieves all category documents.
     */
    async getAllCategories() {
        return await categoryModel.find();
    }

    /**
     * Retrieves a single category by ID.
     * @param id - The category ID.
     */
    async getCategoryById(id: string) {
        return await categoryModel.findById(id);
    }

    /**
     * Updates an existing category by ID.
     * @param id - The category ID.
     * @param data - The data fields to update.
     */
    async updateCategory(id: string, data: Partial<ICategory>) {
        // { new: true } returns the updated document
        // { runValidators: true } ensures Mongoose schema rules are applied
        return await categoryModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    /**
     * Deletes a category by ID.
     * @param id - The category ID.
     * * NOTE: You might want to add logic here to prevent deletion if services are linked to this category.
     */
    async deleteCategory(id: string) {
        return await categoryModel.findByIdAndDelete(id);
    }
}

export default new CategoryClass();