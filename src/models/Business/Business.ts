import { generateI18nHeaders } from "../BaseDTO";
import { BusinessTypeDTORes } from "../BusinessType/businessType";
import { RoleUserDTO } from "../Role&UserAbility/RoleDTO";
import { UserDetailRes } from "../UserResDTO";
import { useI18n } from "vue-i18n";

const { t } = useI18n();


export interface BusinessDTORes {
  id: string;
  name: string;
  description: string;
  avartar: string;
  coverPhoto: string;
  action: string;
  usercount: number;
  active: boolean;
  businessTypes: BusinessTypeDTORes[];
  userDetailRes: UserDetailRes;
  userlist: RoleUserDTO[];
}


export const headers = generateI18nHeaders<BusinessDTORes>(t, [
  { key: "avartar", fallback: "avartar" },
  { key: "name", fallback: "Name" },
  { key: "description", fallback: "Description" },
  { key: "usercount", fallback: "User Count" },
  { key: "active", fallback: "Active" },
]);
