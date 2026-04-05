export default [
  { heading: "Admin" },
  {
    title: "App.administrator",
    icon: { icon: "tabler-buildings" },
    children: [
      { title: "App.user.userManager", to: "administrator-user" },
      {
        title: "App.user.userManager",
        to: "administrator-business-activeType",
        action: "manager",
        subject: "all",
      },
      {
        title: "App.managerbusiness.business",
        children: [
          {
            title: "App.managerbusiness.project",
            to: "administrator-business",
          },
          {
            title: "App.managerbusiness.businesType",
            to: "administrator-business-type",
          },
        ],
      },
      {
        title: "App.managers.role",
        children: [
          {
            title: "App.managers.role",
            to: "administrator-role",
          },
        ],
      },
    ],
  },
  {
    title: "App.management",
    icon: { icon: "tabler-building-cog" },
    children: [
      {
        title: "Edit",
        to: { name: "apps-invoice-edit-id", params: { id: "5036" } },
      },
      { title: "Add", to: "apps-business-add&edit" },
    ],
  },
  {
    title: "App.manager",
    icon: { icon: "tabler-shield-lock" },
    children: [
      {
        title: "App.managerbusiness.business",
        children: [
          {
            title: "App.managerbusiness.project",
            to: "admin-manager-business",
            action: "read",
            subject: "Auth",
          },
          {
            title: "App.managerbusiness.typeCreatProject",
            to: "administrator-typeOfbusiness-active",
            action: "All",
            subject: "manager",
          },
          {
            title: "App.managerbusiness.rennaltype",
            to: "admin-manager-business-rennaltype",
            action: "All",
            subject: "manager",
          },
        ],
        action: "read",
        subject: "Auth",
      },

      {
        title: "App.Address",
        children: [
          {
            title: "App.Countrys",
            to: "administrator-address",

            action: "read",
            subject: "Auth",
          },
        ],
        action: "read",
        subject: "Auth",
      },
      {
        title: "App.managers.role",
        to: "administrator-role",
        action: "read",
        subject: "Auth",
      },
      {
        title: "App.businesscomfirmation",
        to: "administrator-typeOfbusiness",
        action: "read",
        subject: "Auth",
      },
      {
        title: "Edit",
        to: { name: "apps-invoice-edit-id", params: { id: "5036" } },
      },
      // { title: "Add", to: "apps-business-addandedit" },
    ],
  },
];
