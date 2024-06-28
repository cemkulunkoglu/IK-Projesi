import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { InlineSVGModule } from "ng-inline-svg-2";
import { TranslationModule } from "src/app/modules/i18n";
import { UserInnerComponent } from "./user-inner/user-inner.component";
import { NgModule } from "@angular/core";

@NgModule({
    declarations: [
      UserInnerComponent,
    ],
    imports: [CommonModule, FormsModule, InlineSVGModule, RouterModule, TranslationModule, NgbTooltipModule],
    exports: [
      UserInnerComponent,
    ],
  })
  export class DropdownInnerModule {
  }
  