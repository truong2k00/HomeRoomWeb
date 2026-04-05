export enum BusinessTypeEnum {
  HRAttendance,
  product,
  renal,
}

export const getBusinessTypes = () => {
  return [
    { key: BusinessTypeEnum.HRAttendance, value: 'HR Attendance' },
    { key: BusinessTypeEnum.product, value: 'Product' },
    { key: BusinessTypeEnum.renal, value: 'Renal' },
  ]
}

export function TypeGet(type?: BusinessTypeEnum) {
  if (type === undefined) return { key: BusinessTypeEnum.product, value: 'Product' }
  switch (type) {
    case BusinessTypeEnum.product:
      return { key: BusinessTypeEnum.product, value: 'Product' }
    case BusinessTypeEnum.HRAttendance:
      return { key: BusinessTypeEnum.HRAttendance, value: 'HR Attendance' }
    case BusinessTypeEnum.renal:
      return { key: BusinessTypeEnum.renal, value: 'Renal' }
  }
}
