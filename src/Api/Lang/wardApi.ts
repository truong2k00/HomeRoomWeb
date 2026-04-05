import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import { WardDTO, WardResDTO } from "@/models/Lang/WarDTO";
import { PaginatedResponse, Pagination } from "../PaginatedResponse";
import { DistrictResDTO } from "@/models/Lang/DistrictDTO";

export interface GetWardParams extends Pagination {
  keywords?: string;
  districtId: number;
}

class CityApi extends BaseApi {
  Create(input: WardDTO) {
    return new Promise<WardDTO>((resolve: any, reject: any) => {
      HTTP.post("api/Ward", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAll(districtId: number) {
    return new Promise<Array<WardResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/Ward", { params: { districtId } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetAllAsync(GetParams: GetWardParams) {
    return new Promise<PaginatedResponse<DistrictResDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/Ward/GetAll", { params: { ...GetParams } })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  Update(input: WardDTO) {
    return new Promise<WardResDTO>((resolve: any, reject: any) => {
      HTTP.put("api/Ward", input)
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
      HTTP.delete(`api/Ward?id=${id}`)
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
