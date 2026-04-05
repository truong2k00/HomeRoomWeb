export enum RolesEnum {
  ADMINISTRATOR = 'administrator',
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  MODERATOR = 'moderator',
  EDITOR = 'editor',
  MANAGER = 'manager',
  SUPERUSER = 'superuser',
}

export function colorRoles(role: string) {
  const roleLowerCase = role.toLowerCase()
  switch (roleLowerCase) {
    case RolesEnum.ADMINISTRATOR:
      return { color: 'secondary', icon: 'tabler-shield-lock' }
  case RolesEnum.ADMIN:
      return { color: 'default', icon: 'tabler-device-laptop' }
  case RolesEnum.USER:
      return { color: 'success', icon: 'tabler-user-circle' }
  case RolesEnum.GUEST:
      return { color: 'warning', icon: 'tabler-user-off' }
  case RolesEnum.MODERATOR:
      return { color: 'info', icon: 'tabler-message-circle' }
    case RolesEnum.EDITOR:
      return { color: 'info', icon: 'tabler-edit' }
    case RolesEnum.MANAGER:
      return { color: 'error', icon: 'tabler-briefcase' }
    case RolesEnum.SUPERUSER:
      return { color: 'error', icon: 'tabler-shield' }
    default:
      return { color: 'teal', icon: 'tabler-code' }
  }
}

// if (roleLowerCase === 'subscriber')
//   return { color: 'warning', icon: 'tabler-circle-check' }
// if (roleLowerCase === 'author')
//   return { color: 'success', icon: 'tabler-user' }
// if (roleLowerCase === 'maintainer')
//   return { color: 'primary', icon: 'tabler-chart-pie-2' }
// if (roleLowerCase === 'editor')
//   return { color: 'info', icon: 'tabler-edit' }
// if (roleLowerCase === 'admin')
//   return { color: 'secondary', icon: 'tabler-device-laptop' }
// if (roleLowerCase === 'administrator')
//   return { color: 'error', icon: 'tabler-shield-lock' } // 'red' -> 'error'
// if (roleLowerCase === 'superuser')
//   return { color: 'deep-purple-darken-2', icon: 'tabler-shield' } // 'purple' -> deep purple variant
// if (roleLowerCase === 'moderator')
//   return { color: 'blue-darken-2', icon: 'tabler-message-circle' } // 'blue' -> Vuetify blue variant
// if (roleLowerCase === 'manager')
//   return { color: 'cyan-darken-2', icon: 'tabler-briefcase' } // 'cyan' -> Vuetify cyan variant
// if (roleLowerCase === 'guest')
//   return { color: 'grey-darken-1', icon: 'tabler-user-off' } // 'gray' -> Vuetify grey variant
// if (roleLowerCase === 'user')
//   return { color: 'green-darken-2', icon: 'tabler-user-circle' } // 'green' -> Vuetify green variant
// if (roleLowerCase === 'developer')
//   return { color: 'teal-darken-2', icon: 'tabler-code' } // 'teal' -> Vuetify teal variant
// if (roleLowerCase === 'tester')
//   return { color: 'pink-darken-2', icon: 'tabler-bug' } // 'pink' -> Vuetify pink variant
