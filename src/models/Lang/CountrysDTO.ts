import { useI18n } from "vue-i18n";
import { generateI18nHeaders } from "../BaseDTO";

const { t } = useI18n();

export interface CountrysDTO {
  id: number;
  countryName: string;
  languageName: string;
  vietnamesCountryName: string;
  areaCode: string;
  languageCode: string;
  countryCode: string;
  allowCreate: boolean;
  skipLevel: number[];
}
export interface CountrysResDTO {
  id: number;
  vietnamesCountryName: string;
  allowCreate: boolean;
  countryName: string;
  skipLevel: number[];
}

export const headers = generateI18nHeaders<CountrysResDTO>(t, [
  { key: "vietnamesCountryName", fallback: "VN" },
  { key: "countryName", fallback: "Country Name" },
]);
