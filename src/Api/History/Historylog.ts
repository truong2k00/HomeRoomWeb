import { BaseApi } from "@/Api/BaseApi";
import type { PaginatedResponse, Pagination } from "@/Api/PaginatedResponse";
import { HTTP } from "@/HTTPServices";
import { HistoryDTO } from "@/models/History/HistoryDTO";

export interface GetAllHistoryParams extends Pagination {
  keywords?: string;
  tableName?: string
}

class HistoryLogAPI extends BaseApi {
  GetAll(GetUserParams: any) {
    const queryString = new URLSearchParams(GetUserParams).toString();

    return new Promise<PaginatedResponse<HistoryDTO>>((resolve, reject) => {
      HTTP.get(`api/History/GetAll?${queryString}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  };
  GetAllTableName() {
    return new Promise<string[]>((resolve, reject) => {
      HTTP.get(`api/History/GetAllTableName`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  };
  GetByID(id: number) {
    return new Promise<HistoryDTO>((resolve, reject) => {
      HTTP.get(`api/History/GetByID`, { params: { id } })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  };
  GetDataRestore<T>(id: number) {
    return new Promise<T>((resolve, reject) => {
      HTTP.get(`api/History/GetDataRestore`, { params: { id } })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  };
  Restore<T>(id: number) {
    return new Promise<T>((resolve, reject) => {
      HTTP.post(`api/History/Restore`, id)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
}
export default new HistoryLogAPI();
