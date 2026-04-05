import { BaseApi } from "../BaseApi";
import type { PaginatedResponse, Pagination } from "../PaginatedResponse";
import { HTTP } from "@/HTTPServices";
import type {
  BusinessDTO,
  BusinessResDTO,
  GetUserRes,
} from "@/models/Admin/BusinessDTO";

export interface GetBusinessParams extends Pagination {
  keywords?: string;
  isDelete?: string;
}

export interface GetByIdUserParams {
  id: string;
  isdelete: boolean;
}

export interface GetUserParams extends Pagination {
  id: string;
  isdelete: boolean;
}

class BusinessApi extends BaseApi {
  Create(params: BusinessDTO) {
    return new Promise<BusinessResDTO>((resolve: any, reject: any) => {
      HTTP.post("api/Business/Create", params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  Update(params: BusinessDTO) {
    return new Promise<BusinessResDTO>((resolve: any, reject: any) => {
      HTTP.post("api/Business/Update", params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAll(GetBusinessParams: GetBusinessParams) {
    return new Promise<PaginatedResponse<BusinessResDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/Business/GetAll", { params: GetBusinessParams })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  ViewUserID(GetUserParams: GetUserParams) {
    return new Promise<PaginatedResponse<GetUserRes>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/Business/ViewUserID", { params: GetUserParams })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  GetByIdUser(GetByIdUserParams: GetByIdUserParams) {
    return new Promise<BusinessResDTO>((resolve: any, reject: any) => {
      {
        HTTP.get("api/Business/GetByIdUser", { params: GetByIdUserParams })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  GetAllBusiness(GetBusinessParams: GetBusinessParams) {
    return new Promise<PaginatedResponse<BusinessResDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/Business/GetAllBusiness", { params: GetBusinessParams })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }
}
export default new BusinessApi();
