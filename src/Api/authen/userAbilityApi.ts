import { HTTP } from '@/HTTPServices'
import { BaseApi } from '../BaseApi'
import { AddAbilityPermission, Permission } from '@/models/Admin/Auth/UserAbilityDTO'

class UserAbilityApi extends BaseApi {
  GetPermission(roleId: string, subjectName: any)
  {
    return new Promise<Permission>((resolve, reject) =>{
      HTTP.get('api/UserAbility/permissions', { params: {roleId, subjectName}})
      .then((res)=>{
        resolve(res.data)
      })
      .catch((err) =>{
        reject(err)
      })
    })
  }
  UpdateRolePermission(userAbilityDTO: AddAbilityPermission)
  {
    return new Promise<number>((resolve, reject) =>{
      HTTP.post('api/UserAbility/UpdateForAction', userAbilityDTO)
      .then((res)=>{
        resolve(res.status)
      })
      .catch((err) =>{
        reject(err)
      })
    })
  }
}

export default new UserAbilityApi()
