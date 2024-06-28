import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AccessTypeEnum, AccessTypeLabelMapping } from 'src/app/core/enums/user/access-type-enum.model';
import { AccessTypeWithPermissionTreeModel } from 'src/app/core/models/settings/system-setting/access-type-with-permission-tree.model';
import { SystemSettingService } from 'src/app/core/services/settings/system-setting.service';
import { ToastrService } from 'ngx-toastr';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { PermissionTreeFlatModel } from 'src/app/core/models/settings/system-setting/permission-tree.model';
import { SaveAccessTypePermissionsModel } from 'src/app/core/models/settings/system-setting/save-access-type-permissions.model';
import { PermissionCategoryEnum } from 'src/app/core/enums/user/permission-category-enum.model';

@Component({
  selector: 'app-request-settings',
  templateUrl: './request-settings.component.html',
})
export class RequestSettingsComponent implements OnInit, OnDestroy {
  private _onDestroy = new Subject<void>();

  treeControl: FlatTreeControl<PermissionTreeFlatModel>;
  treeFlattener: MatTreeFlattener<AccessTypeWithPermissionTreeModel, PermissionTreeFlatModel>;
  dataSource: MatTreeFlatDataSource<AccessTypeWithPermissionTreeModel, PermissionTreeFlatModel>;
  checklistSelection = new SelectionModel<PermissionTreeFlatModel>(true);

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  createRequestSettingsForm: FormGroup;
  selectedPermissionList: Array<number> = [];

  accessTypeEnum = AccessTypeEnum;
  accessTypeSources = Object.keys(AccessTypeEnum).map(key => AccessTypeEnum[key as keyof typeof AccessTypeEnum]).filter(value => typeof value === 'number') as AccessTypeEnum[];
  AccessTypeLabelMapping = AccessTypeLabelMapping;
  activeTab: AccessTypeEnum = AccessTypeEnum.Manager;

  permissionCategoryEnum = PermissionCategoryEnum;
  permissionList: Array<AccessTypeWithPermissionTreeModel> = [];

  managerPermissions: number[] = [];
  employeePermissions: number[] = [];

  constructor(
    private fb: FormBuilder,
    private systemSettingService: SystemSettingService,
    private cdr: ChangeDetectorRef,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<PermissionTreeFlatModel>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadPermissions(this.activeTab);
  }

  initForm() {
    this.createRequestSettingsForm = this.fb.group({
      category: [PermissionCategoryEnum.Demands, Validators.required],
      permissions: []
    });
  }

  get f() {
    return this.createRequestSettingsForm.controls;
  }

  get _permissions(): FormArray {
    return this.createRequestSettingsForm.get("permissions") as FormArray;
  }

  getLevel = (node: PermissionTreeFlatModel) => node.level;
  isExpandable = (node: PermissionTreeFlatModel) => node.expandable;
  getChildren = (node: AccessTypeWithPermissionTreeModel): AccessTypeWithPermissionTreeModel[] => node.items || [];
  hasChild = (_: number, _nodeData: PermissionTreeFlatModel) => _nodeData.expandable;

  transformer = (node: AccessTypeWithPermissionTreeModel, level: number) => {
    const flatNode = new PermissionTreeFlatModel();
    flatNode.name = node.name;
    flatNode.id = node.id;
    flatNode.selected = node.selected;
    flatNode.code = node.code;
    flatNode.level = level;
    flatNode.expandable = !!node.items;
    flatNode.description = node.description;
    if (flatNode.selected) {
      this.checklistSelection.select(flatNode);
    }
    return flatNode;
  }

  descendantsAllSelected(node: PermissionTreeFlatModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: PermissionTreeFlatModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: PermissionTreeFlatModel): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    this.updateSelectedPermissions();
  }

  updateSelectedPermissions() {
    const selectedPermissions = this.checklistSelection.selected.map(node => node.id);
    this.createRequestSettingsForm.get('permissions').setValue(selectedPermissions);
    if (this.activeTab === AccessTypeEnum.Manager) {
      this.managerPermissions = selectedPermissions;
    } else if (this.activeTab === AccessTypeEnum.Employee) {
      this.employeePermissions = selectedPermissions;
    }
  }

  loadPermissions(accessType: AccessTypeEnum): void {
    this.systemSettingService.getAccessTypeWithPermissionTree(accessType, PermissionCategoryEnum.Demands).subscribe(res => {
      if (res && res.data.length > 0) {
        this.dataSource.data = res.data;
        this.treeControl.expandAll();
        this.cdr.detectChanges();
        this.reselectPermissions();
      }
    });
  }

  reselectPermissions() {
    let selectedPermissionsIds: number[];
    if (this.activeTab === AccessTypeEnum.Manager) {
      selectedPermissionsIds = this.managerPermissions;
    } else if (this.activeTab === AccessTypeEnum.Employee) {
      selectedPermissionsIds = this.employeePermissions;
    }
    this.treeControl.dataNodes.forEach(node => {
      if (selectedPermissionsIds.includes(node.id)) {
        this.checklistSelection.select(node);
      }
    });
  }

  onSubmit() {
    this.isLoadingSubject.next(true);
    const selectedPermissions = Array.from(new Set(this.checklistSelection.selected.map(node => node.id)));
    this.createRequestSettingsForm.get('permissions').setValue(selectedPermissions);

    if (this.createRequestSettingsForm.valid) {
      const saveModel: SaveAccessTypePermissionsModel = {
        accessType: this.activeTab,
        permissionDetails: [
          {
            category: this.createRequestSettingsForm.value.category,
            permissions: selectedPermissions
          }
        ]
      };

      this.systemSettingService.saveAccessTypePermissions(saveModel).subscribe(
        res => {
          this.toastrService.success("İşlem Başarılı");
          this.isLoadingSubject.next(false);
          setTimeout(() => window.location.reload(), 1000);
        },
        err => {
          let msg = '';
          if (err.status != 500) {
            err.error.messages.forEach(element => {
              msg += element + '. ';
            });
          } else {
            msg = "Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.";
          }
          this.toastrService.error(msg, "Hata Oluştu");
          this.isLoadingSubject.next(false);
        }
      );
    } else {
      this.toastrService.warning("Lütfen Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

  setActiveTab(accessType: AccessTypeEnum): void {
    this.activeTab = accessType;
    this.checklistSelection.clear();
    this.createRequestSettingsForm.get('permissions').setValue([]);
    this.loadPermissions(accessType);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
