import type { BusinessOfTypeEnum } from "@/Common/enum/TypeOfBusiness";
import { BusinessDTORes } from "../Business/Business";
import { BusinessTypeDTORes } from "../BusinessType/businessType";
import { PayTypeBusinessDTORes } from "../PayTypeBusiness/PayTypeBusinessDTO";

export interface TypeOfBusinessDTO {
  businessId: string;
  businessTypeId: string;
  payTypeBusinessId?: string;
}
export interface TypeOfBusinessDTORes {
  action: BusinessOfTypeEnum;
}
export interface TypeOfBusinessDTOAllRes {
  business: BusinessDTORes;
  businessType: BusinessTypeDTORes;
  paytype: PayTypeBusinessDTORes;
  active: boolean;
  on: boolean;
  startAt: Date;
  endAt: Date;
}
