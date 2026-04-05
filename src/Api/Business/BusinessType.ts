import { BaseApi } from '../BaseApi'
import { HTTP } from '@/HTTPServices'
import type { BusinessTypeResDTO } from '@/models/Admin/BusinessDTO'

class BusinessTypeAPI extends BaseApi {
  GetAll() {
    return new Promise<BusinessTypeResDTO[]>((resolve: any, reject: any) => {
      HTTP.get('api/BusinessType')
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  Create(formdata: any) {
    return new Promise<BusinessTypeResDTO>(
      (resolve: any, reject: any) => {
        HTTP.post('api/BusinessType', formdata)
          .then(res => {
            resolve(res.data)
          })
          .catch(error => {
            reject(error)
          })
      })
  }

  Update(formdata: any) {
    return new Promise<number>(
      (resolve: any, reject: any) => {
        HTTP.put('api/BusinessType', formdata)
          .then(res => {
            resolve(res.data)
          })
          .catch(error => {
            reject(error)
          })
      })
  }

  Delete(id: any) {
    return new Promise<number>(
      (resolve: any, reject: any) => {
        HTTP.delete('api/BusinessType', {
          data: id,
        })
          .then(res => {
            resolve(res.data)
          })
          .catch(error => {
            reject(error)
          })
      })
  }
}

export default new BusinessTypeAPI()
