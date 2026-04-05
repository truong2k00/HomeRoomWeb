import { AddressTypeEnum } from "@/Common/enum/AddressType";

import { useI18n } from "vue-i18n";
import { generateI18nHeaders } from "../BaseDTO";

const { t } = useI18n();

export interface Ids {
  id: string;
}
export interface AddressDetailsDTO extends Ids {
  addressType: AddressTypeEnum;
  countrysId: number;
  cityId: number;
  districtId: number;
  wardId: number;
  streetsId: string;
  specificAddress: string;
}
export interface AddressDetailResDTO extends AddressDetailsDTO {
  countrysName: string;
  cityName: string;
  districtName: string;
  wardName: string;
  streetsName: string;
  addressString: string;
}

export const headers = generateI18nHeaders<AddressDetailResDTO>(t, [
  { key: "countrysName", fallback: "Country Name" },
  { key: "cityName", fallback: "City Name" },
  { key: "districtName", fallback: "District Name" },
  { key: "wardName", fallback: "Ward Name" },
  { key: "streetsName", fallback: "Streets Name" },
  { key: "addressString", fallback: "Address" },
]);
