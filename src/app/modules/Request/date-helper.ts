import { NgxMatNativeDateAdapter } from "@angular-material-components/datetime-picker";
import { Injectable } from "@angular/core";

@Injectable()
export class CustomDateAdapter extends NgxMatNativeDateAdapter {
  getFirstDayOfWeek(): number {
     return 1;
   }
}
