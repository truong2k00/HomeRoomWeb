export enum Actions {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
  manage = "manage",
}

export enum ReStatusOnBusiness {
  participated, // đã tham gia
  required, // yêu cầu xác nhận
  notParticipated, // chưa Tham Gia
}

export interface ActionsResCheck {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  manager: boolean;
}

export function CheckConnect(status: ReStatusOnBusiness) {
  switch (status) {
    case ReStatusOnBusiness.participated:
      return {
        color: "success",
        text: "Connected",
        icon: "tabler-check",
        action: "delete",
      };
    case ReStatusOnBusiness.required:
      return {
        color: "warning",
        text: "Awaiting",
        icon: "tabler-exclamation-circle",
        action: "cancel",
      };
    case ReStatusOnBusiness.notParticipated:
      return {
        color: "primary",
        text: "Not Connected",
        icon: "tabler-plus",
        action: "create",
      };
  }
}

export function CheckActionName(action: string): ActionsResCheck {
  const permissions = action.split(",");

  return {
    read: permissions.includes(Actions.read),
    create: permissions.includes(Actions.create),
    update: permissions.includes(Actions.update),
    delete: permissions.includes(Actions.delete),
    manager: permissions.includes(Actions.manage),
  };
}

export function GetActions(action: string) {
  action.toLowerCase();
  switch (action) {
    case Actions.read:
      return { color: "success", text: "Read" };
    case Actions.update:
      return { color: "warning", text: "Update" };
    case Actions.delete:
      return { color: "error", text: "Delete" };
    case Actions.manage:
      return { color: "primary", text: "Manage" };
    default:
      return { color: "secondary", text: "Create" };
  }
}

export function GetAllAction() {
  return [
    {
      value: Actions.create,
      text: "Create",
    },
    {
      value: Actions.read,
      text: "Read",
    },
    {
      value: Actions.update,
      text: "Update",
    },
    {
      value: Actions.delete,
      text: "Delete",
    },
    {
      value: Actions.manage,
      text: "Manage",
    },
  ];
}
