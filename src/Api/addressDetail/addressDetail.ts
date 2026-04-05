import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import {
  AddressDetailResDTO,
  AddressDetailsDTO,
} from "@/models/Lang/addressDTO";
import { CityDTO, CityResDTO } from "@/models/Lang/citysDTO";
export interface AddressDetailParams {
  keyWords: string;
}

class AddressDetailsApi extends BaseApi {
  Getall(params: AddressDetailParams) {
    return new Promise<AddressDetailResDTO>((resolve: any, reject: any) => {
      HTTP.get("api/AddressDetails/GetAll", { params })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  Create(input: AddressDetailsDTO) {
    return new Promise<AddressDetailResDTO>((resolve: any, reject: any) => {
      HTTP.post("api/AddressDetails", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAddressByUser() {
    return new Promise<AddressDetailResDTO>((resolve: any, reject: any) => {
      HTTP.get("api/AddressDetails/GetAddressByUser")
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  Update(input: CityDTO) {
    return new Promise<CityResDTO>((resolve: any, reject: any) => {
      HTTP.put("api/AddressDetails", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  delete(id: number) {
    return new Promise<CityResDTO>((resolve: any, reject: any) => {
      HTTP.delete(`api/AddressDetails?id=${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new AddressDetailsApi();
