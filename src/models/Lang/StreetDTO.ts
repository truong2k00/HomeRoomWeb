import { StreetRoadEnum } from "@/Common/enum/country/countryEnum";

import { useI18n } from "vue-i18n";
import { generateI18nHeaders } from "../BaseDTO";

const { t } = useI18n();

export interface StreetsDTO extends StreetsResDTO {
  wardId: number;
}
export interface StreetsResDTO {
  id: string;
  street: string;
  streetRoadEnum: StreetRoadEnum;
}

export const headers = generateI18nHeaders<StreetsResDTO>(t, [
  { key: "street", fallback: "Street" },
  { key: "streetRoadEnum", fallback: "Street Road" },
]);
