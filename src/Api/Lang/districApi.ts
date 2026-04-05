import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import { DistrictDTO, DistrictResDTO } from "@/models/Lang/DistrictDTO";
import { PaginatedResponse, Pagination } from "../PaginatedResponse";

export interface GetDistrictParams extends Pagination {
  keywords?: string;
  cityId: number;
}

class CityApi extends BaseApi {
  Create(input: DistrictDTO) {
    return new Promise<DistrictResDTO>((resolve: any, reject: any) => {
      HTTP.post("api/District", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAll(cityId: number) {
    return new Promise<Array<DistrictResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/District", { params: { cityId } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetAllAsync(GetParams: GetDistrictParams) {
    return new Promise<PaginatedResponse<DistrictResDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/District/GetAll", { params: { ...GetParams } })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  Update(districtDTO: DistrictDTO) {
    return new Promise<DistrictResDTO>((resolve: any, reject: any) => {
      HTTP.put("api/District", districtDTO)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  delete(id: number) {
    return new Promise<number>((resolve: any, reject: any) => {
      HTTP.delete(`api/District?districtId=${id}`)
        .then((res) => {
          if (res.status === 200) resolve(id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default new CityApi();
