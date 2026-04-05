import { ProvinceCityEnum } from "@/Common/enum/country/countryEnum";

import { useI18n } from "vue-i18n";
import { generateI18nHeaders } from "../BaseDTO";

const { t } = useI18n();

export interface CityDTO extends CityResDTO {
  countrysId: number;
}
export interface CityResDTO {
  id: number;
  cityName: string;
  provinceCityEnum: ProvinceCityEnum;
}


export const headers = generateI18nHeaders<CityResDTO>(t, [
  { key: "cityName", fallback: "City Name" },
  { key: "provinceCityEnum", fallback: "Province City" },
]);
