import { BaseApi } from "@/Api/BaseApi";
import { PaginatedResponse, Pagination } from "@/Api/PaginatedResponse";
import { HTTP } from "@/HTTPServices";
import { RenalTypeDTO } from "@/models/Business/Renal/RenalTypeDTO";

export interface GetRenalParams extends Pagination {
  keywords?: string;
}

class BusinessTypeAPI extends BaseApi {
  GetSettingKey(path: string) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.get("api/ImportFileConfig/GetFileJson", { params: { path: path } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new BusinessTypeAPI();
