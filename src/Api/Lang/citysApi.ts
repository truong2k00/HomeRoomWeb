import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import { CityDTO, CityResDTO } from "@/models/Lang/citysDTO";
import { PaginatedResponse, Pagination } from "../PaginatedResponse";

export interface GetCityParams extends Pagination {
  keywords?: string;
  countryId: number;
}
class CityApi extends BaseApi {
  Create(input: CityDTO) {
    return new Promise<CityResDTO>((resolve: any, reject: any) => {
      HTTP.post("api/city", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAll(countryId: number) {
    return new Promise<Array<CityResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/City", { params: { countryId: countryId } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetAllCity(GetParams: GetCityParams) {
    return new Promise<PaginatedResponse<CityResDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/City/GetAll", { params: { ...GetParams } })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  Update(input: CityDTO) {
    return new Promise<CityResDTO>((resolve: any, reject: any) => {
      HTTP.put("api/City", input)
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
      HTTP.delete(`api/Country?id=${id}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new CityApi();
