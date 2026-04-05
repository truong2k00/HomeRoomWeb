export enum BusinessOfTypeEnum {
  registered,
  confirmation,
  notRegistered,
  expired,
  waitingforpayment,
  open,
  close,
}

export function CheckConnectType(status: BusinessOfTypeEnum) {
  switch (status) {
    case BusinessOfTypeEnum.registered:
      return { color: 'success', text: 'Connected', icon: 'tabler-check', action: 'delete' }
  case BusinessOfTypeEnum.confirmation:
      return { color: 'warning', text: 'Awaiting', icon: 'tabler-exclamation-circle', action: 'cancel' }
  case BusinessOfTypeEnum.notRegistered:
      return { color: 'primary', text: 'Not Connected', icon: 'tabler-plus', action: 'create' }
  case BusinessOfTypeEnum.expired:
      return { color: 'secondary', text: 'Expired', icon: 'tabler-cash-banknote-off', action: 'expired' }
  case BusinessOfTypeEnum.waitingforpayment:
      return { color: 'warning', text: 'Waiting for Payment', icon: 'tabler-cash-register', action: 'sendPay' }
  case BusinessOfTypeEnum.open:
      return { color: 'success', text: 'Open', icon: 'tabler-check', action: 'open' }
  case BusinessOfTypeEnum.close:
      return { color: 'warning', text: 'Close', icon: 'tabler-folder-exclamation', action: 'close' }
  }
}
