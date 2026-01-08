import { Types } from "mongoose";
import categoryModel from "../models/category.model";
import serviceModel, { IService } from "../models/service.model";

class ServiceClass {
    /**
     * Creates a new service document.
     * @param data - The service data.
     */
    async createService(data: Partial<IService>) {
        return await serviceModel.create(data);
    }

    /**
     * Inserts an array of services, performing necessary category lookups in the DB.
     * @param servicesData - Array of service objects (uses category name string).
     */
    async bulkCreateServices(servicesData: any[]) {
        // 1. Identify all unique category names in the incoming data
        const categoryNames = [...new Set(servicesData.map(s => s.category))];

        // 2. FETCH CATEGORY IDs from the database
        // This query ensures we only use IDs that exist in your Category collection.
        const categories = await categoryModel.find({ name: { $in: categoryNames } }, { name: 1 });

        // Create a map for quick name-to-ID conversion: { "cleaning": ObjectId("...") }
        const categoryMap = new Map<string, Types.ObjectId>();
        categories.forEach(cat => categoryMap.set(cat.name, cat._id));

        // 3. Transform the service data: replace category name with dynamic ObjectId
        const transformedServices = servicesData.map(service => {
            const categoryId = categoryMap.get(service.category);

            if (!categoryId) {
                // Throws an error if the payload contains a category name not found in the DB.
                throw new Error(`Category '${service.category}' not found in the database. Please create it first.`);
            }

            return {
                // ... other fields ...
                ...service,
                category: categoryId,     // <--- THIS IS THE DYNAMIC DB ObjectId
            };
        });

        // 4. Insert transformed data in bulk
        return await serviceModel.insertMany(transformedServices, { ordered: false });
    }

    /**
     * Retrieves all services, populating the category reference.
     */
    async getAllServices() {
        // Use .populate('category') to fetch the full Category object
        return await serviceModel.find().populate('category');
    }

    /**
     * Retrieves a single service by ID, populating the category reference.
     * @param id - The service ID.
     */
    async getServiceById(id: string) {
        // Use .populate('category') to fetch the full Category object
        return await serviceModel.findById(id).populate('category');
    }

    /**
     * Updates an existing service by ID.
     * @param id - The service ID.
     * @param data - The data fields to update.
     */
    async updateService(id: string, data: Partial<IService>) {
        // { new: true } returns the updated document
        // { runValidators: true } ensures Mongoose schema rules are applied on update
        return await serviceModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );
    }

    /**
     * Deletes a service by ID.
     * @param id - The service ID.
     */
    async deleteService(id: string) {
        return await serviceModel.findByIdAndDelete(id);
    }
}

export default new ServiceClass();