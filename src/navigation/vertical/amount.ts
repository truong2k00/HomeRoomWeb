export default [
  {
    title: "App.Amount",
    icon: { icon: "tabler-cash-banknote-plus" },
    children: [
      {
        title: "App.SettingAmount",
        to: "amount-currency-moves",
      },
      {
        title: "App.AmountRate",
        to: "amount-currency_changes",
      },
    ],
    badgeContent: "3",
    badgeClass: "bg-primary",
  },
];
