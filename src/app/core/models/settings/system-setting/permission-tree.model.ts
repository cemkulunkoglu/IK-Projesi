export interface PermissionTreeModel {
    id: number;
    name: string;
    code: string;
    selected: boolean;
    description: string | null;
    items: PermissionTreeModel[] | null;
  }
  
  export class PermissionTreeFlatModel {
    id: number;
    name: string;
    code: string;
    selected: boolean;
    description: string | null;
    level: number;
    expandable: boolean;
  }
  