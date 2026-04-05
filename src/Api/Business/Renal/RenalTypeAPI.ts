import { BaseApi } from "@/Api/BaseApi";
import { PaginatedResponse, Pagination } from "@/Api/PaginatedResponse";
import { HTTP } from "@/HTTPServices";
import { RenalTypeDTO } from "@/models/Business/Renal/RenalTypeDTO";

export interface GetRenalParams extends Pagination {
  keywords?: string;
}

class RenalTypeAPI extends BaseApi {
  GetAll(keywords: string) {
    return new Promise<RenalTypeDTO[]>((resolve: any, reject: any) => {
      HTTP.get("api/RenalType/ALL", { params: keywords })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  GetAllPage(params: GetRenalParams) {
    return new Promise<PaginatedResponse<RenalTypeDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/RenalType/ALLPage", { params })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      },
    );
  }

  GetbyId(id: string) {
    return new Promise<RenalTypeDTO>((resolve: any, reject: any) => {
      HTTP.get("api/RenalType", { params: id })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  Create(formdata: any) {
    return new Promise<RenalTypeDTO>((resolve: any, reject: any) => {
      HTTP.post("api/RenalType", formdata)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  Update(formdata: any) {
    return new Promise<RenalTypeDTO>((resolve: any, reject: any) => {
      HTTP.put("api/RenalType", formdata)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  Delete(id: any) {
    return new Promise<string>((resolve: any, reject: any) => {
      HTTP.delete("api/RenalType", { params: { id } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new RenalTypeAPI();
