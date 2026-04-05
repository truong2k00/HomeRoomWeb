import { RoleUserDTO } from "../Role&UserAbility/RoleDTO";
import type { UserDetailRes } from "../UserResDTO";
import type { BusinessTypeEnum } from "@/Common/enum/BusinessType";

export interface BusinessTypeResDTO {
  id: string;
  name: string;
  type: BusinessTypeEnum;
  createAt: Date;
  description: string;
}
export interface BusinessTypeDTO {
  id?: string;
  name: string;
  type: BusinessTypeEnum;
  description: string;
}
export interface BusinessDTO {
  id: string;
  name: string;
  description: string;
  businessTypeIds: string[];
  action: string;
  userName: string;
}
export interface BusinessResDTO {
  id: string;
  name: string;
  description: string;
  avartar: string;
  coverPhoto: string;
  active: boolean;
  action: string;
  usercount: number;
  businessTypes: BusinessTypeResDTO[];
  userDetailRes: UserDetailRes;
  userlist: RoleUserDTO[];
}
export interface GetUserRes {
  idAccount: string;
  fullName: string;
  avatar: string;
  roles: string;
}
