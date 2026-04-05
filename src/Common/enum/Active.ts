export enum Active {
  active,
  isactive,
  looked,
}

export function getActives(active: Active) {
  switch (active) {
    case Active.active:
      return { color: 'success', text: 'Active' }
  case Active.isactive:
      return { color: 'warning', text: 'Is Active' }
  case Active.looked:
      return { color: 'error', text: 'Locked' }
  default:
      return { color: 'secondary', text: 'pending' }
  }
}

export function getActiveSelect() {
  return [
    { title: 'Active', value: Active.active },
    { title: 'Is Active', value: Active.isactive },
    { title: 'Locked', value: Active.looked },
  ]
}
