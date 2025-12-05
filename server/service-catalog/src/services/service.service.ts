import serviceModel, { IService } from "../models/service.model";

class ServiceClass{
    async createService(data: Partial<IService>){
        return await serviceModel.create(data);
    }

    async getAllServices(){
        return await serviceModel.find();
    }

    async getServiceById(id: string){
        return await serviceModel.findById(id);
    }

    async deleteService(id: string){
        return await serviceModel.findByIdAndDelete(id);
    }
}


export default new ServiceClass();