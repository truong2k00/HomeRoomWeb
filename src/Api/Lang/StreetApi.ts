import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import { StreetsDTO, StreetsResDTO } from "@/models/Lang/StreetDTO";
import { PaginatedResponse, Pagination } from "../PaginatedResponse";
import { DistrictResDTO } from "@/models/Lang/DistrictDTO";

export interface GetStreetsParams extends Pagination {
  keywords?: string;
  wardId: number;
}

class CityApi extends BaseApi {
  Create(input: StreetsDTO) {
    return new Promise<StreetsDTO>((resolve: any, reject: any) => {
      HTTP.post("api/Streets", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAll(wardId: number) {
    return new Promise<Array<StreetsResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/Streets", { params: { wardId } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetAllAsync(GetParams: GetStreetsParams) {
    return new Promise<PaginatedResponse<DistrictResDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/Streets/GetAll", { params: { ...GetParams } })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  Update(input: StreetsDTO) {
    return new Promise<StreetsResDTO>((resolve: any, reject: any) => {
      HTTP.put("api/Streets", input)
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
      HTTP.delete(`api/Streets?id=${id}`)
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
