export enum AdminLevel1Type {
  Province = 100, // Tỉnh
  City = 101, // Thành phố
  State = 102, // Bang
  Region = 103, // Vùng
  Prefecture = 104, // Phủ (Nhật)
  Territory = 105, // Lãnh thổ
}
export enum AdminLevel2Type {
  District = 200, // Quận
  County = 201, // Huyện
  CityDistrict = 202, // Thành phố cấp huyện
  Borough = 203, // Borough (UK, US)
  Municipality = 204, // Đô thị
  SubPrefecture = 205, // Phủ nhỏ
}
export enum AdminLevel3Type {
  Ward = 300, // Phường
  Commune = 301, // Xã
  Town = 302, // Thị trấn
  Village = 303, // Làng
  Township = 304, // Township
  Subdistrict = 305, // Tiểu khu
  Neighborhood = 306, // Khu dân cư
}
export enum AdminLevel4Type {
  Street = 400, // Đường
  Road = 401, // Phố
  Zone = 402, // Khu
  ResidentialGroup = 403, // Tổ
  Block = 404, // Block
  Hamlet = 405, // Thôn
  Alley = 406, // Hẻm
  Sector = 407, // Phân khu
  HamletCluster = 408, // Ấp
}
export enum AdminLevelType {
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
}

export function getProvinceTypeSelect1() {
  return [
    { title: "province", color: "primary", value: AdminLevel1Type.Province },
    { title: "city", color: "success", value: AdminLevel1Type.City },
    { title: "state", color: "warning", value: AdminLevel1Type.State },
    { title: "region", color: "error", value: AdminLevel1Type.Region },
    { title: "prefecture", color: "info", value: AdminLevel1Type.Prefecture },
    {
      title: "territory",
      color: "secondary",
      value: AdminLevel1Type.Territory,
    },
  ];
}

export function getProvinceTypeSelect2() {
  return [
    { title: "district", color: "primary", value: AdminLevel2Type.District },
    { title: "county", color: "success", value: AdminLevel2Type.County },
    {
      title: "city district",
      color: "warning",
      value: AdminLevel2Type.CityDistrict,
    },
    { title: "borough", color: "error", value: AdminLevel2Type.Borough },
    {
      title: "municipality",
      color: "info",
      value: AdminLevel2Type.Municipality,
    },
    {
      title: "sub prefecture",
      color: "secondary",
      value: AdminLevel2Type.SubPrefecture,
    },
  ];
}

export function getProvinceTypeSelect3() {
  return [
    { title: "ward", color: "primary", value: AdminLevel3Type.Ward },
    { title: "commune", color: "success", value: AdminLevel3Type.Commune },
    { title: "town", color: "warning", value: AdminLevel3Type.Town },
    { title: "village", color: "error", value: AdminLevel3Type.Village },
    { title: "township", color: "info", value: AdminLevel3Type.Township },
    {
      title: "subdistrict",
      color: "secondary",
      value: AdminLevel3Type.Subdistrict,
    },
    {
      title: "neighborhood",
      color: "tertiary",
      value: AdminLevel3Type.Neighborhood,
    },
  ];
}

export function getProvinceTypeSelect4() {
  return [
    { title: "street", color: "primary", value: AdminLevel4Type.Street },
    { title: "road", color: "success", value: AdminLevel4Type.Road },
    { title: "zone", color: "warning", value: AdminLevel4Type.Zone },
    {
      title: "residential group",
      color: "error",
      value: AdminLevel4Type.ResidentialGroup,
    },
    { title: "block", color: "info", value: AdminLevel4Type.Block },
    { title: "hamlet", color: "secondary", value: AdminLevel4Type.Hamlet },
    { title: "alley", color: "tertiary", value: AdminLevel4Type.Alley },
    { title: "sector", color: "quaternary", value: AdminLevel4Type.Sector },
    {
      title: "hamlet cluster",
      color: "quinary",
      value: AdminLevel4Type.HamletCluster,
    },
  ];
}

export function getProvincetypeInfoLevel1(type: AdminLevel1Type) {
  switch (type) {
    case AdminLevel1Type.Province:
      return {
        value: AdminLevel1Type.Province,
        color: "primary",
        text: "province",
      };
    case AdminLevel1Type.City:
      return {
        value: AdminLevel1Type.City,
        color: "success",
        text: "city",
      };
    case AdminLevel1Type.State:
      return {
        value: AdminLevel1Type.State,
        color: "warning",
        text: "state",
      };
    case AdminLevel1Type.Region:
      return {
        value: AdminLevel1Type.Region,
        color: "error",
        text: "region",
      };
    case AdminLevel1Type.Prefecture:
      return {
        value: AdminLevel1Type.Prefecture,
        color: "info",
        text: "prefecture",
      };
    case AdminLevel1Type.Territory:
      return {
        value: AdminLevel1Type.Territory,
        color: "secondary",
        text: "territory",
      };
  }
}

export function getProvincetypeInfoLevel2(type: AdminLevel2Type) {
  switch (type) {
    case AdminLevel2Type.District:
      return {
        value: AdminLevel2Type.District,
        color: "primary",
        text: "district",
      };
    case AdminLevel2Type.County:
      return {
        value: AdminLevel2Type.County,
        color: "success",
        text: "county",
      };
    case AdminLevel2Type.CityDistrict:
      return {
        value: AdminLevel2Type.CityDistrict,
        color: "warning",
        text: "city district",
      };
    case AdminLevel2Type.Borough:
      return {
        value: AdminLevel2Type.Borough,
        color: "error",
        text: "borough",
      };
    case AdminLevel2Type.Municipality:
      return {
        value: AdminLevel2Type.Municipality,
        color: "info",
        text: "municipality",
      };
    case AdminLevel2Type.SubPrefecture:
      return {
        value: AdminLevel2Type.SubPrefecture,
        color: "secondary",
        text: "sub prefecture",
      };
  }
}

export function getProvincetypeInfoLevel3(type: AdminLevel3Type) {
  switch (type) {
    case AdminLevel3Type.Ward:
      return {
        value: AdminLevel3Type.Ward,
        color: "primary",
        text: "ward",
      };
    case AdminLevel3Type.Commune:
      return {
        value: AdminLevel3Type.Commune,
        color: "success",
        text: "commune",
      };
    case AdminLevel3Type.Town:
      return {
        value: AdminLevel3Type.Town,
        color: "warning",
        text: "town",
      };
    case AdminLevel3Type.Village:
      return {
        value: AdminLevel3Type.Village,
        color: "error",
        text: "village",
      };
    case AdminLevel3Type.Township:
      return {
        value: AdminLevel3Type.Township,
        color: "info",
        text: "township",
      };
    case AdminLevel3Type.Subdistrict:
      return {
        value: AdminLevel3Type.Subdistrict,
        color: "secondary",
        text: "subdistrict",
      };
    case AdminLevel3Type.Neighborhood:
      return {
        value: AdminLevel3Type.Neighborhood,
        color: "tertiary",
        text: "neighborhood",
      };
  }
}

export function getProvincetypeInfoLevel4(type: AdminLevel4Type) {
  switch (type) {
    case AdminLevel4Type.Street:
      return {
        value: AdminLevel4Type.Street,
        color: "primary",
        text: "street",
      };
    case AdminLevel4Type.Road:
      return {
        value: AdminLevel4Type.Road,
        color: "success",
        text: "road",
      };
    case AdminLevel4Type.Zone:
      return {
        value: AdminLevel4Type.Zone,
        color: "warning",
        text: "zone",
      };
    case AdminLevel4Type.ResidentialGroup:
      return {
        value: AdminLevel4Type.ResidentialGroup,
        color: "error",
        text: "residential group",
      };
    case AdminLevel4Type.Block:
      return {
        value: AdminLevel4Type.Block,
        color: "info",
        text: "block",
      };
    case AdminLevel4Type.Hamlet:
      return {
        value: AdminLevel4Type.Hamlet,
        color: "secondary",
        text: "hamlet",
      };
    case AdminLevel4Type.Alley:
      return {
        value: AdminLevel4Type.Alley,
        color: "tertiary",
        text: "alley",
      };
    case AdminLevel4Type.Sector:
      return {
        value: AdminLevel4Type.Sector,
        color: "quaternary",
        text: "sector",
      };
    case AdminLevel4Type.HamletCluster:
      return {
        value: AdminLevel4Type.HamletCluster,
        color: "quinary",
        text: "hamletcluster",
      };
  }
}

export function getProvincetypeInfo(type: AdminLevelType) {
  switch (type) {
    case AdminLevelType.Level1:
      return {
        value: AdminLevelType.Level1,
        color: "primary",
        text: "province",
      };
    case AdminLevelType.Level2:
      return {
        value: AdminLevelType.Level2,
        color: "success",
        text: "district",
      };
    case AdminLevelType.Level3:
      return {
        value: AdminLevelType.Level3,
        color: "warning",
        text: "ward",
      };
    case AdminLevelType.Level4:
      return {
        value: AdminLevelType.Level4,
        color: "error",
        text: "street",
      };
  }
}

//common

// 👉 có thể refactor lại bằng cách tạo 1 file enum riêng cho phần này
export const getTypeLevel = (type: number, levelType: number) => {
  switch (levelType) {
    case 1:
      return getProvincetypeInfoLevel1(type);
    case 2:
      return getProvincetypeInfoLevel2(type);
    case 3:
      return getProvincetypeInfoLevel3(type);
    case 4:
      return getProvincetypeInfoLevel4(type);
    default:
      return { text: "none", color: "default" };
  }
};

export const getTypeLevelSelect = (levelType: number) => {
  switch (levelType) {
    case 1:
      return getProvinceTypeSelect1();
    case 2:
      return getProvinceTypeSelect2();
    case 3:
      return getProvinceTypeSelect3();
    case 4:
      return getProvinceTypeSelect4();
    default:
      return [{ text: "none", color: "default", value: 0 }];
  }
};

export const keyTranslatedTitle = (level: number) => {
  switch (level) {
    case 1:
      return "App.City.";
    case 2:
      return "App.Districts.";
    case 3:
      return "App.Ward.";
    case 4:
      return "App.Street.";
    default:
      return "";
  }
};
