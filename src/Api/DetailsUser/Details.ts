import { BaseApi } from '../BaseApi'
import { HTTP } from '@/HTTPServices'
import type { DetailsUserDTO } from '@/models/Client/DetailsDTO'

class DetailuserAPI extends BaseApi {
  UpdatDetail(input: DetailsUserDTO) {
    return new Promise(
      (resolve: any, reject: any) => {
        HTTP.put('api/User/UpdatDetail', input)
          .then(res => {
            resolve(res.data)
          })
          .catch(error => {
            reject(error)
          })
      },
    )
  }

  UpdatDetails(input: DetailsUserDTO) {
    return new Promise(
      (resolve: any, reject: any) => {
        HTTP.put('api/User/UpdatDetails', input)
          .then(res => {
            resolve(res.data)
          })
          .catch(error => {
            reject(error)
          })
      },
    )
  }
}

export default new DetailuserAPI()
