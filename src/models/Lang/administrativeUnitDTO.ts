export interface CreateAdministrativeUnitDTO {
  name: string;
  parentId: string;
  type: number;
  countryId: number;
}
export interface UpdateAdministrativeUnitDTO {
  name: string;
  id: string;
  isActive: boolean;
}
export interface AdministrativeUnitDTO {
  id: string;
  name: string;
  parentId: string;
  skipLevels: number[];
  type: number;
  countryId: number;
  countryName: string;
}
