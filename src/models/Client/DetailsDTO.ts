import type { Active } from "@/Common/enum/Active";

export interface DetailsUserDTO {
  id: number | "";
  avatar: string | "";
  account: string | "";
  email: string | "";
  addressDetailsId: string;
  home: boolean;
  fullName: string;
  phoneNumber: string;
  addressHome: string;
  zipCode: number;
  birthday: Date;
  active: Active;
}

export interface DetailsDTO {
  account: string | "";
  avatar: string;
  fullName: string;
  home: boolean;
  zipCode: number;
  idAccounts: string;
  addressDetailsId: string;
  phoneNumber: string;
  addressHome: string;
  email: string | "";
  birthday: Date;
  active: Active;
  userImage: string;
  dateDelete: Date;
  isDeleted: boolean;
  id: number | "";
}

export interface DetailUserDTO extends DetailDTO {
  id: number;
}
export interface DetailDTO {
  avatar: string;
  account: string;
  email: string;
  zipCode: number;
  addressDetailsId: string;
  fullName: string;
  phoneNumber: string;
  addressHome: string;
  birthday: Date;
  active: Active;
}
export interface UserDetailRes extends DetailDTO {
  loginErr: number;
  lastRequestTime: Date;
  isActive: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: Date;
  roles: string[];
  countrysId: number;
  loginProvider: string[];
}
export interface UserViewDTO {
  idAccount: string;
  fullName: string;
  avatar: string;
  roles: string;
}
