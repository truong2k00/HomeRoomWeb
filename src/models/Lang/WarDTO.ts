import { CommuneWardEnum } from "@/Common/enum/country/countryEnum";

import { useI18n } from "vue-i18n";
import { generateI18nHeaders } from "../BaseDTO";

const { t } = useI18n();

export interface WardDTO extends WardResDTO {
  districtId: number;
}
export interface WardResDTO {
  id: number;
  wardName: string;
  communeWardEnum: CommuneWardEnum;
}

export const headers = generateI18nHeaders<WardResDTO>(t, [
  { key: "wardName", fallback: "Ward Name" },
  { key: "communeWardEnum", fallback: "Commune Ward" },
]);
