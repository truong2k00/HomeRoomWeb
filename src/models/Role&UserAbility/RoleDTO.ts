export interface RoleDTO {
  id: string;
  roleName: string;
  hierarchyLevel: number;
  users: RoleUserDTO[];
}
export interface RoleDTOUpdate {
  newRoleName: string;
  roleName: string;
}
export interface RoleResDTO {
  name: string;
  active: boolean;
}

export interface RoleUserDTO {
  idUser: string;
  name: string;
  avatar: string;
}

export interface RoleAddUserDTO {
  idRole: string;
  userName?: string[];
}
