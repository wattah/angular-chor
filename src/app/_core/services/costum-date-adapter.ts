import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { SHORT_DAYS_OF_WEEK } from '../constants/constants';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  getFirstDayOfWeek(): number {
   return 1;
  }

  getDayOfWeekNames(_style: string): string[] {
    return SHORT_DAYS_OF_WEEK;
  }
}
