import { color } from "@/views/demos/components/badge/demoCodeBadge";

//city
export enum ProvinceCityEnum {
  Province = 1, // Tỉnh (Việt Nam, TQ)
  City = 2, // Thành phố
  State = 3, // Bang (Mỹ, Ấn Độ, Úc)
  Region = 4, // Vùng (Nga, Pháp, Ý)
  Prefecture = 5, // Phủ, tỉnh lỵ (Nhật Bản)
  Territory = 6, // Lãnh thổ (Canada, Úc)
}

export function getProvinceCity(val: ProvinceCityEnum) {
  switch (val) {
    case ProvinceCityEnum.City:
      return {
        value: ProvinceCityEnum.City,
        color: "success",
        text: "city",
      };
    case ProvinceCityEnum.Province:
      return {
        value: ProvinceCityEnum.Province,
        color: "primary",
        text: "province",
      };
    case ProvinceCityEnum.Prefecture:
      return {
        value: ProvinceCityEnum.Prefecture,
        color: "warning",
        text: "prefecture",
      };
    case ProvinceCityEnum.Region:
      return {
        value: ProvinceCityEnum.Region,
        color: "primary",
        text: "region",
      };
    case ProvinceCityEnum.State:
      return {
        value: ProvinceCityEnum.State,
        color: "primary",
        text: "state",
      };
    case ProvinceCityEnum.Territory:
      return {
        value: ProvinceCityEnum.Territory,
        color: "primary",
        text: "territory",
      };
  }
}

export function getProvinceCitySelect() {
  return [
    { title: "city", value: ProvinceCityEnum.City },
    { title: "province", value: ProvinceCityEnum.Province },
    { title: "prefecture", value: ProvinceCityEnum.Prefecture },
    { title: "region", value: ProvinceCityEnum.Region },
    { title: "state", value: ProvinceCityEnum.State },
    { title: "territory", value: ProvinceCityEnum.Territory },
  ];
}
//county
export enum CountyDistrictEnum {
  County = 1, // Huyện (VN), Quận (Mỹ, Anh)
  District = 2, // Quận (VN, Ấn Độ)
  CityDistrict = 3, // Thành phố cấp huyện (TQ)
  Borough = 4, // Quận (London, NYC)
  Municipality = 5, // Đô thị (Nhiều nước Châu Âu)
  SubPrefecture = 6, // Phủ nhỏ (Nhật Bản, Brazil)
}

export function getProvinceDistrict(val: CountyDistrictEnum) {
  switch (val) {
    case CountyDistrictEnum.County:
      return {
        value: CountyDistrictEnum.County,
        color: "primary",
        text: "county",
      };
    case CountyDistrictEnum.District:
      return {
        value: CountyDistrictEnum.District,
        color: "success",
        text: "district",
      };
    case CountyDistrictEnum.Borough:
      return {
        value: CountyDistrictEnum.Borough,
        color: "success",
        text: "borough",
      };
    case CountyDistrictEnum.CityDistrict:
      return {
        value: CountyDistrictEnum.CityDistrict,
        color: "success",
        text: "cityDistrict",
      };
    case CountyDistrictEnum.Municipality:
      return {
        value: CountyDistrictEnum.Municipality,
        color: "success",
        text: "municipality",
      };
    case CountyDistrictEnum.SubPrefecture:
      return {
        value: CountyDistrictEnum.SubPrefecture,
        color: "success",
        text: "subPrefecture",
      };
  }
}

export function getProvinceDistrictSelect() {
  return [
    { title: "county", color: undefined, value: CountyDistrictEnum.County },
    { title: "district", color: "success", value: CountyDistrictEnum.District },
    { title: "borough", color: "success", value: CountyDistrictEnum.Borough },
    {
      title: "cityDistrict",
      color: "success",
      value: CountyDistrictEnum.CityDistrict,
    },
    {
      title: "municipality",
      color: "success",
      value: CountyDistrictEnum.Municipality,
    },
    {
      title: "subPrefecture",
      color: "success",
      value: CountyDistrictEnum.SubPrefecture,
    },
  ];
}
//Ward
export enum CommuneWardEnum {
  Commune = 1, // Xã
  Ward = 2, // Phường
  Town = 3, // Thị trấn
  Village = 4, // Làng (Ấn Độ, TQ)
  Township = 5, // Thị xã (Mỹ, TQ)
  Subdistrict = 6, // Phường, tiểu khu (TQ, Thái Lan)
  Neighborhood = 7, // Khu dân cư (Hàn Quốc, Nhật)
}

export function getProvinceWard(val: CommuneWardEnum) {
  switch (val) {
    case CommuneWardEnum.Commune:
      return {
        value: CommuneWardEnum.Commune,
        color: undefined,
        text: "commune",
      };
    case CommuneWardEnum.Ward:
      return {
        value: CommuneWardEnum.Ward,
        color: "success",
        text: "ward",
      };
    case CommuneWardEnum.Neighborhood:
      return {
        value: CommuneWardEnum.Neighborhood,
        color: "success",
        text: "neighborhood",
      };
    case CommuneWardEnum.Subdistrict:
      return {
        value: CommuneWardEnum.Subdistrict,
        color: "success",
        text: "subdistrict",
      };
    case CommuneWardEnum.Town:
      return {
        value: CommuneWardEnum.Town,
        color: "success",
        text: "town",
      };
    case CommuneWardEnum.Township:
      return {
        value: CommuneWardEnum.Township,
        color: "success",
        text: "township",
      };
    case CommuneWardEnum.Village:
      return {
        value: CommuneWardEnum.Village,
        color: "success",
        text: "village",
      };
  }
}

export function getProvinceWardSelect() {
  return [
    { title: "ward", value: CommuneWardEnum.Ward },
    { title: "commune", value: CommuneWardEnum.Commune },
    { title: "neighborhood", value: CommuneWardEnum.Neighborhood },
    { title: "subdistrict", value: CommuneWardEnum.Subdistrict },
    { title: "town", value: CommuneWardEnum.Town },
    { title: "township", value: CommuneWardEnum.Township },
    { title: "village", value: CommuneWardEnum.Village },
  ];
}
//Street
export enum StreetRoadEnum {
  Street = 1, // Đường (Street)
  Road = 2, // Phố (Road)
  Zone = 3, // Khu vực (Zone)
  Nest = 4, // Tổ (VN)
  Block = 5, // Khu nhà, Block (Mỹ, Nhật)
  Hamlet = 6, // Thôn, bản (VN, TQ)
  Alley = 7, // Hẻm/ngõ (VN, Nhật)
  Sector = 8, // Phân khu (Ấn Độ, Rwanda)
  HamletGroup = 9, // Ấp (VN – miền Nam)
}

export function getProvinceStreet(val: StreetRoadEnum) {
  switch (val) {
    case StreetRoadEnum.Nest:
      return {
        value: StreetRoadEnum.Nest,
        color: undefined,
        text: "nest",
      };
    case StreetRoadEnum.Road:
      return {
        value: StreetRoadEnum.Road,
        color: "wanting",
        text: "road",
      };
    case StreetRoadEnum.Street:
      return {
        value: StreetRoadEnum.Street,
        color: "success",
        text: "street",
      };
    case StreetRoadEnum.Zone:
      return {
        value: StreetRoadEnum.Zone,
        color: "info",
        text: "zone",
      };
    case StreetRoadEnum.Block:
      return {
        value: StreetRoadEnum.Block,
        color: "info",
        text: "block",
      };
    case StreetRoadEnum.Hamlet:
      return {
        value: StreetRoadEnum.Hamlet,
        color: "info",
        text: "hamlet",
      };
    case StreetRoadEnum.Alley:
      return {
        value: StreetRoadEnum.Alley,
        color: "info",
        text: "alley",
      };
    case StreetRoadEnum.Sector:
      return {
        value: StreetRoadEnum.Sector,
        color: "info",
        text: "sector",
      };
    case StreetRoadEnum.HamletGroup:
      return {
        value: StreetRoadEnum.HamletGroup,
        color: "info",
        text: "hamletGroup",
      };
  }
}

export function getProvinceStreetSelect() {
  return [
    { title: "nest", value: StreetRoadEnum.Nest },
    { title: "road", value: StreetRoadEnum.Road },
    { title: "street", value: StreetRoadEnum.Street },
    { title: "zone", value: StreetRoadEnum.Zone },
    { title: "block", value: StreetRoadEnum.Block },
    { title: "hamlet", value: StreetRoadEnum.Hamlet },
    { title: "alley", value: StreetRoadEnum.Alley },
    { title: "sector", value: StreetRoadEnum.Sector },
    { title: "hamletGroup", value: StreetRoadEnum.HamletGroup },
  ];
}
