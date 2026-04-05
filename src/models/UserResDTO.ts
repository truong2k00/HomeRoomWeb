import type { Active } from "@/Common/enum/Active";

export interface UserResDTO {
  userName: string;
  id: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  idget: string;
  role: string;
  roles: string[];
  fullName: string;
  addressHome: string;
  birthday: Date;
  active: number;
  locked: boolean;
}

export interface UserDetailRes {
  avatar: string;
  account: string;
  email: string;
  locked: boolean;
  fullName: string;
  phoneNumber: string;
  addressHome: string;
  birthday: Date;
  active: Active;
  addressDetailsId: string;
  loginErr: number;
  lastRequestTime: Date;
  isActive: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: Date;
  roles: string[];
  loginProvider: string[];
}

export interface GetUserSelection {
  userName: string;
  role: string[];
  avartar: string;
}
