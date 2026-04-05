import { CountyDistrictEnum } from "@/Common/enum/country/countryEnum";

import { useI18n } from "vue-i18n";
import { generateI18nHeaders } from "../BaseDTO";

const { t } = useI18n();

export interface DistrictDTO extends DistrictResDTO {
  cityId: number;
}
export interface DistrictResDTO {
  id: number;
  districtName: string;
  countyDistrictEnum: CountyDistrictEnum;
}
export const headers = generateI18nHeaders<DistrictResDTO>(t, [
  { key: "districtName", fallback: "District Name" },
  { key: "countyDistrictEnum", fallback: "County District" },
]);
