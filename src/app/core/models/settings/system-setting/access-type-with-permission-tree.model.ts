export interface AccessTypeWithPermissionTreeModel {
    id: number;
    name: string;
    code: string;
    selected: boolean;
    description: string | null;
    items: AccessTypeWithPermissionTreeModel[] | null;
  }
  