import { HTTP } from "@/HTTPServices";
import { AddressAdministrativeUnitCreateDTO, AddressAdministrativeUnitResDTO } from "@/models/Lang/addressDTO";
import { BaseApi } from "../BaseApi";
import { Pagination } from "../PaginatedResponse";


const controller = "AddressAdministrativeUnit";

export interface AddressAdministrativeUnitParams extends Pagination {
  keyWords: string;
}

class AddressAdministrativeUnitApi extends BaseApi {
  GetAll(params: AddressAdministrativeUnitParams) {
    return new Promise<any>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/GetAllPage`, {
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
  GetById(id: string) {
    return new Promise<AddressAdministrativeUnitResDTO>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/GetTrativeAllCountry/${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetAllAddress(keyWords?: string) {
    return new Promise<AddressAdministrativeUnitResDTO[]>((resolve: any, reject: any) => {
      HTTP.get(`api/${controller}/AllAddress`, {
        params: keyWords,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  Create(dTO: AddressAdministrativeUnitCreateDTO) {
    return new Promise<AddressAdministrativeUnitResDTO>((resolve: any, reject: any) => {
      HTTP.post(`api/${controller}`, dTO)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updated(dTO: AddressAdministrativeUnitCreateDTO) {
    return new Promise<AddressAdministrativeUnitResDTO>((resolve: any, reject: any) => {
      HTTP.put(`api/${controller}`, dTO)
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
export default new AddressAdministrativeUnitApi();
