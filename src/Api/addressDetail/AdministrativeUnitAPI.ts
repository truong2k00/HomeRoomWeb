import { AdminLevelType } from "@/Common/enum/country/AdministrativeUnitEnum";
import { HTTP } from "@/HTTPServices";
import {
  AdministrativeUnitDTO,
  CreateAdministrativeUnitDTO,
  UpdateAdministrativeUnitDTO,
} from "@/models/Lang/administrativeUnitDTO";
import { BaseApi } from "../BaseApi";
import { Pagination } from "../PaginatedResponse";

export interface AdministrativeUnitParams extends Pagination {
  id: number;
  keyWords: string;
  selectAll: boolean;
}

export interface AdministrativeUnitParamsAll {
  id: number;
  keyWords: string;
}

const controller = "AdministrativeUnit";

export interface AdministrativeUnitLevelParams extends Pagination {
  id: string;
  keyWords: string;
  selectAll: boolean;
  level: AdminLevelType;
}

export interface AdministrativeUnitLevelParamsAll {
  id: string;
  keyWords: string;
  level: AdminLevelType;
}
class AdministrativeUnitApi extends BaseApi {
  GetAll(params: AdministrativeUnitParams) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/GetTrativeByCountry/${params.id}`, {
        params,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetTrativeAllCountry(params: AdministrativeUnitParamsAll) {
    return new Promise<AdministrativeUnitDTO[]>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/GetTrativeAllCountry/${params.id}`, {
        params,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetTrativeByLevel(params: AdministrativeUnitLevelParams) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/GetTrativeByLevel/${params.id}`, {
        params,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetTrativeAllLevel(params: AdministrativeUnitLevelParamsAll) {
    return new Promise<AdministrativeUnitDTO[]>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/GetTrativeAllLevel/${params.id}`, {
        params,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  Create(addressDetailUnitDTO: CreateAdministrativeUnitDTO) {
    return new Promise<AdministrativeUnitDTO>((resolve: any, reject: any) => {
      HTTP.post(`api/${controller}`, addressDetailUnitDTO)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updated(addressDetailUnitDTO: UpdateAdministrativeUnitDTO) {
    return new Promise<AdministrativeUnitDTO>((resolve: any, reject: any) => {
      HTTP.put(`api/${controller}`, addressDetailUnitDTO)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  delete(id: string) {
    return new Promise<boolean>((resolve: any, reject: any) => {
      HTTP.delete(`api/${controller}`, { params: { id } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new AdministrativeUnitApi();
