import { BaseApi } from "@/Api/BaseApi";
import type { PaginatedResponse, Pagination } from "@/Api/PaginatedResponse";
import type { Active } from "@/Common/enum/Active";
import { HTTP } from "@/HTTPServices";
import type { UserDetailRes } from "@/models/Client/DetailsDTO";
import type { GetUserSelection, UserResDTO } from "@/models/UserResDTO";

export interface GetUserParams extends Pagination {
  keywords?: string;
  role: string[];
  active: Active;
}

class UserApi extends BaseApi {
  GetAllAccount(GetUserParams: any) {
    const params = { ...GetUserParams };

    // Nếu có role là mảng, tách thành chuỗi query thủ công
    const queryString = new URLSearchParams();

    for (const key in params) {
      if (key === "role" && Array.isArray(params[key])) {
        params[key].forEach((value: string) => {
          queryString.append("role", value);
        });
      } else if (params[key] !== null && params[key] !== undefined) {
        queryString.append(key, params[key]);
      }
    }

    return new Promise<PaginatedResponse<UserResDTO>>((resolve, reject) => {
      HTTP.get(`api/User/GetAllAccount?${queryString.toString()}`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }
  FilterAllAccount(
    keywords?: string,
    idrole?: string,
    remove: boolean = false
  ) {
    return new Promise<GetUserSelection[]>((resolve, reject) => {
      HTTP.get(`api/User/FilterAllAccount`, {
        params: { keywords, idrole, remove },
      })
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

  getByUser() {
    return new Promise<UserDetailRes>((resolve: any, reject: any) => {
      HTTP.get("api/User/GetByUser")
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  GetUserById(userId: any) {
    console.log(userId);

    return new Promise<UserDetailRes>((resolve: any, reject: any) => {
      HTTP.get("api/User/GetUserById", { params: { userId } })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getmyrole() {
    return new Promise<string[]>((resolve: any, reject: any) => {
      HTTP.get("api/User/getmyrole")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
export default new UserApi();
