import { HTTP } from "@/HTTPServices";
import type { CountrysDTO, CountrysResDTO } from "@/models/Lang/CountrysDTO";
import { BaseApi } from "../BaseApi";
import { PaginatedResponse, Pagination } from "../PaginatedResponse";

export interface GetContryParams extends Pagination {
  keywords?: string;
}

class CountryAPI extends BaseApi {
  Create(input: CountrysDTO) {
    return new Promise<CountrysResDTO>((resolve: any, reject: any) => {
      HTTP.post("api/Country", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetAll() {
    return new Promise<Array<CountrysResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/Country")
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  GetAllCountry(GetParams: GetContryParams) {
    return new Promise<PaginatedResponse<CountrysDTO>>(
      (resolve: any, reject: any) => {
        HTTP.get("api/Country/GetAll", { params: { ...GetParams } })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      },
    );
  }
  GetById(id: number) {
    return new Promise<CountrysDTO>((resolve: any, reject: any) => {
      HTTP.get("api/Country/GetById", { params: { id } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  Update(input: CountrysDTO) {
    return new Promise<CountrysResDTO>((resolve: any, reject: any) => {
      HTTP.put("api/Country", input)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  ChangeAllowCreate(id: number, allowCreate: boolean = false) {
    return new Promise<CountrysResDTO>((resolve: any, reject: any) => {
      HTTP.put(`api/Country/ChangeAllowCreate?id=${id}&allowCreate=${allowCreate}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  UpdateSkipLevel(id: number, skip: number[]) {
    return new Promise<CountrysResDTO>((resolve: any, reject: any) => {
      HTTP.put(`api/Country/ChangeSkip?id=${id}`, skip)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  delete(id: number) {
    return new Promise<CountrysResDTO>((resolve: any, reject: any) => {
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
export default new CountryAPI();
