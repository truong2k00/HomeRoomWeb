export enum AddressTypeEnum {
  Home,
  Office,
}

export const getAddressTypes = () => {
  return [
    {
      title: "addressHome",
      desc: "descriptionHome",
      icon: { icon: "custom-home", size: "40" },
      value: "home",
      key: AddressTypeEnum.Home,
    },
    {
      title: "addressOffice",
      desc: "descriptionOffice",
      icon: { icon: "tabler-building-skyscraper", size: "40" },
      value: "office",
      key: AddressTypeEnum.Office,
    },
  ];
};

//custom-wallet
export const getAddressType = (key: AddressTypeEnum) => {
  switch (key) {
    case AddressTypeEnum.Home:
      return { key: AddressTypeEnum.Home, value: "home" };
    case AddressTypeEnum.Office:
      return { key: AddressTypeEnum.Office, value: "office" };
    default:
      return { key: AddressTypeEnum.Home, value: "home" };
  }
};
