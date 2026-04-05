export interface Permission {
  id: number
  subjectName: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
  manager: boolean
}
export interface AddAbilityPermission{
  roleId: string
  actions: Permission[]
}
