export default [
  {
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Analytics',
        to: 'dashboards-analytics',
        icon: { icon: 'tabler-chart-pie-2' },
        action: 'read',
        subject: 'Auth',
      },
      {
        title: 'eCommerce',
        to: 'dashboards-ecommerce',
        icon: { icon: 'tabler-atom-2' },
        action: 'read',
        subject: 'Auth',
      },
      {
        title: 'CRM',
        to: 'dashboards-crm',
        icon: { icon: 'tabler-3d-cube-sphere' },
        action: 'read',
        subject: 'Auth',
      },
    ],
  },
]
