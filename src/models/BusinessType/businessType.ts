import { BusinessTypeEnum } from "@/Common/enum/BusinessType";

export interface BusinessTypeDTORes {
  id: string;
  createAt: Date;
  name: string;
  type: BusinessTypeEnum;
  description: string;
}
