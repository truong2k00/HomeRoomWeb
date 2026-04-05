export enum PayCodeEnum {
  Monthly,
  Yearly,
}

export function GetPayCode() {
  return [
    { text: "Monthly", value: PayCodeEnum.Monthly },
    { text: "Yearly", value: PayCodeEnum.Yearly },
  ];
}

export function Findby(CodeEnum: PayCodeEnum) {
  switch (CodeEnum) {
    case PayCodeEnum.Monthly:
      return { text: "Monthly", value: PayCodeEnum.Monthly };
    case PayCodeEnum.Yearly:
      return { text: "Yearly", value: PayCodeEnum.Yearly };
  }
}

export enum PayPackageEnum {
  Basic,
  VIP,
  Premium,
}

export function GetPayPackage() {
  return [
    { text: "Basic", value: PayPackageEnum.Basic },
    { text: "VIP", value: PayPackageEnum.VIP },
    { text: "Premium", value: PayPackageEnum.Premium },
  ];
}

export function GetByPackage(PayPackage: PayPackageEnum) {
  switch (PayPackage) {
    case PayPackageEnum.Basic:
      return {
        text: "Basic",
        icon: { icon: "custom-office", size: "40" },
        value: PayPackageEnum.Basic,
      };
    case PayPackageEnum.VIP:
      return {
        text: "VIP",
        icon: { icon: "custom-diamond", size: "40" },
        value: PayPackageEnum.VIP,
      };
    case PayPackageEnum.Premium:
      return {
        text: "Premium",
        icon: { icon: "custom-suitcase", size: "40" },
        value: PayPackageEnum.Premium,
      };
    default:
      break;
  }
}
