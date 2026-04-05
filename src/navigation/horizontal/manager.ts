export default [
  {
    title: 'App.administrator',
    icon: { icon: 'tabler-buildings' },
    children: [
      { title: 'App.user.userManager', to: 'administrator-user' },
      {
        title: 'App.managerbusiness.business',
        children: [
          {
            title: 'App.managerbusiness.project',
            to: 'administrator-business',
          },
          { title: 'App.managerbusiness.businesType', to: 'administrator-business-type' },
        ],
      },
    ],
  },
  {
    title: 'App.management',
    icon: { icon: 'tabler-building-cog' },
    children: [
      {
        title: 'App.managerbusiness.business',
        children: [
          {
            title: 'App.managerbusiness.project',
            to: 'admin-manager-business',
            action: 'read',
            subject: 'Auth',
          },
        ],
        action: 'read',
        subject: 'Auth',
      },
      {
        title: 'App.managerbusiness.project',
        to: 'apps-business',
        action: 'read',
        subject: 'Auth',
      },
      { title: 'Edit', to: { name: 'apps-invoice-edit-id', params: { id: '5036' } } },
      { title: 'Add', to: 'apps-business-add&edit' },
    ],
  },
]
