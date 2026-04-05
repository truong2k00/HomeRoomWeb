import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import { Pagination } from "../PaginatedResponse";

export interface AdministrativeUnitParams extends Pagination {
  id: number;
  selectAll: boolean;
}

export interface AdministrativeUnitLevelParams extends Pagination {
  id: string;
  selectAll: boolean;
}
class AdministrativeUnitApi extends BaseApi {
  GetAll(params: AdministrativeUnitParams) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.get(`api/AddressDetailUnit/GetTrativeByCountry/${params.id}`, {
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
      HTTP.get(`api/AddressDetailUnit/GetTrativeByLevel/${params.id}`, {
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
}
export default new AdministrativeUnitApi();
