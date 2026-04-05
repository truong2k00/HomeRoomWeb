export interface UserDTO {
  lockoutEnd?: Date
  twoFactorEnabled: boolean
  phoneNumberConfirmed: boolean
  phoneNumber: string
  emailConfirmed: boolean
  normalizedEmail: string
  email: string
  normalizedUserName: string
  userName: string
  id: string
  lockoutEnabled: boolean
  accessFailedCount: number
  password: string
  roles: string[]
}

export interface UserLoginDTO {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterUserExteranlDTO {
  sub: string
  name: string
  email: boolean
  phoneNumber: boolean
  fullname: boolean
  provider: boolean
}
export interface RegisterUser {
  sub: string
  id: string
  name: string
  given_Name: string
  userName: string
  password: string
  newpassword: string
  picture: string
  email: string
  action: string
  phoneNumber: string
  fullname: string
  provider: string
}

export interface RegisterUserExteranslDTO {
  sub: string
  id: string
  name: string
  given_Name: string
  picture: string
  email: string
  action: string
  phoneNumber: string
  fullname: string
  provider: string
}
