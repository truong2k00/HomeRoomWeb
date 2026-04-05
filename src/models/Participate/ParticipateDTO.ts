import type { ReStatusOnBusiness } from '@/Common/enum/Action'

export interface ParticipateDTO {
  userName: string
  businessId: string
}

export interface ParticipateResDTO {
  status: ReStatusOnBusiness
  actionName: string
}
