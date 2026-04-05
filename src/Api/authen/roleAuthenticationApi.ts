import { BaseApi } from "../BaseApi";
import { HTTP } from "@/HTTPServices";
import type {
  RoleAddUserDTO,
  RoleDTO,
  RoleResDTO,
} from "@/models/Role&UserAbility/RoleDTO";

class RoleApi extends BaseApi {
  Addrole(params: RoleAddUserDTO) {
    return new Promise<boolean>((resolve: any, reject: any) => {
      HTTP.post("api/role/AddRole", params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  removerole(params: RoleAddUserDTO) {
    console.log(params);

    return new Promise<boolean>((resolve: any, reject: any) => {
      HTTP.post("api/role/RemoveRole", params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  get(keyword?: string) {
    return new Promise<Array<RoleDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/role", { params: { keyword } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getRoleAccount(account: string) {
    return new Promise<Array<RoleResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/role/getRoleAccount", { params: { account } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getRole() {
    return new Promise<Array<RoleResDTO>>((resolve: any, reject: any) => {
      HTTP.get("api/role/getRole")
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new RoleApi();
