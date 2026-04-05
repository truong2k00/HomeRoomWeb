import type { PayCodeEnum, PayPackageEnum } from '@/Common/enum/Pay/PayCode'
import { generateI18nHeaders } from '../BaseDTO'

import { useI18n } from "vue-i18n";

const { t } = useI18n();


export interface PayTypeBusinessDTO {
  id: string
  businessTypeId: string
  free: boolean
  package: PayPackageEnum
  maximum: number
  price: number
  payCode: PayCodeEnum
}
export interface PayTypeBusinessDTORes {
  id: string
  free: boolean
  package: PayPackageEnum
  maximum: number
  price: number
  payCode: PayCodeEnum
  businessTypeId: string
}



export const headers = generateI18nHeaders<PayTypeBusinessDTORes>(t, [
  { key: "free", fallback: "Free" },
  { key: "package", fallback: "Package" },
  { key: "maximum", fallback: "Maximum" },
  { key: "price", fallback: "Price" },
  { key: "payCode", fallback: "Pay Code" },
]);
