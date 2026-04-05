import { BaseApi } from "../BaseApi";
import type { PaginatedResponse, Pagination } from "../PaginatedResponse";
import { HTTP } from "@/HTTPServices";
import type {
  TypeOfBusinessDTO,
  TypeOfBusinessDTOAllRes,
  TypeOfBusinessDTORes,
} from "@/models/TypeOfBusiness/TypeOfBusinessDTO";

export interface GetActiveParams extends Pagination {
  keywords?: string;
  businessId?: string[];
  active?: boolean;
}

export interface GetALLParams extends Pagination {
  keywords?: string;
  active?: boolean;
}


export interface GetAllByBusinessParams {
  keywords?: string;
  businessId?: string;
  active?: boolean;
}

class TypeOfBusinessAPI extends BaseApi {
  Getaction(query: TypeOfBusinessDTO) {
    return new Promise<TypeOfBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.get("api/TypeOfBusiness", { params: query })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  Create(query: TypeOfBusinessDTO) {
    return new Promise<TypeOfBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.post("api/TypeOfBusiness", query)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  Active(query: TypeOfBusinessDTO) {
    return new Promise<TypeOfBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.put("api/TypeOfBusiness", { params: query })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  GetType(query: TypeOfBusinessDTO) {
    return new Promise<TypeOfBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.get("api/TypeOfBusiness/GetType", { params: query })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  GetAll(query: GetALLParams) {
    return new Promise<PaginatedResponse<TypeOfBusinessDTOAllRes>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/TypeOfBusiness/GetAll", { params: query })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  }
  GetAllByBusiness(query: GetAllByBusinessParams) {
    return new Promise<TypeOfBusinessDTOAllRes[]>(
      (resolve: any, reject: any) => {
        HTTP.get("api/TypeOfBusiness/GetAll", { params: query })
          .then((res) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  }

  UpdatePackage(query: TypeOfBusinessDTO) {
    return new Promise<TypeOfBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.put("api/TypeOfBusiness/addpayType", { params: query })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new TypeOfBusinessAPI();
