import { BaseApi } from '../BaseApi'
import { HTTP } from '@/HTTPServices'
import type { PayTypeBusinessDTO, PayTypeBusinessDTORes } from '@/models/PayTypeBusiness/PayTypeBusinessDTO'

class PayTypeBusinessDTOApi extends BaseApi {
  CreateOrUpdate(query: PayTypeBusinessDTO) {
    return new Promise<PayTypeBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.post('api/PayTypeBusiness', query)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  Delete(id: string) {
    return new Promise<boolean>((resolve: any, reject: any) => {
      HTTP.delete('api/PayTypeBusiness', { params: { id } })
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  GetAll(businessTypeId: string) {
    return new Promise<PayTypeBusinessDTORes[]>((resolve: any, reject: any) => {
      HTTP.get('api/PayTypeBusiness', { params: { businessTypeId } })
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
  GetById(businessTypeId: string, payid: string) {
    return new Promise<PayTypeBusinessDTORes>((resolve: any, reject: any) => {
      HTTP.get('api/PayTypeBusiness/GetById', { params: { businessTypeId, payid } })
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default new PayTypeBusinessDTOApi()
