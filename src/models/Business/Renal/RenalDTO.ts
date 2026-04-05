export interface RenalDTO {
  id: string;
  name: string;
  title: string;
  description: string;
  addressDetailsId: string;
  businessId: string;
  renalTypeId: string;
  imageRenals: File[];
}

export interface RenalResDTO {
  id: string;
  name: string;
  title: string;
  description: string;
  addressDetailsId: string;
  businessId: string;
  renalTypeId: string;
  createAt: Date;
  imageRenals: string[];
}
