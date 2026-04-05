export default [
  { heading: 'Setting' },
  {
    title: 'App.Settings',
    icon: { icon: 'tabler-settings' },
    children: [
      {
        title: 'App.SettingRole.SettingAccount',
        to: 'apps-Setting-Role',
        action: 'read',
        subject: 'Auth',
      },
    ],
  },
]
