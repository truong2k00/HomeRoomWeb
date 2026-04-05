import { BaseApi } from '../BaseApi'
import type { ReStatusOnBusiness } from '@/Common/enum/Action'
import { HTTP } from '@/HTTPServices'
import type { ParticipateDTO, ParticipateResDTO } from '@/models/Participate/ParticipateDTO'

class ParticipateApi extends BaseApi {
  GetAction(Participate: ParticipateDTO) {
    return new Promise<ParticipateResDTO>((resolve: any, reject: any) => {
      HTTP.get('api/Participate/GetAction', { params: Participate })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  CRD(Participate: ParticipateDTO) {
    return new Promise<ReStatusOnBusiness>((resolve: any, reject: any) => {
      HTTP.post('api/Participate/CRD', null, { params: Participate })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
export default new ParticipateApi()
