export default [
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
        action: 'read',
        subject: 'Auth',
      },
      {
        title: 'eCommerce',
        to: 'dashboards-ecommerce',
        action: 'read',
        subject: 'Auth',
      },
      {
        title: 'CRM',
        to: 'dashboards-crm',
        action: 'read',
        subject: 'Auth',
      },
    ],
    badgeContent: '3',
    badgeClass: 'bg-primary',
  },
]
