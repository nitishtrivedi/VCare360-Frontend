import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {
  private datePipe = new DatePipe('en-IN');
  // ==================== DATE/TIME CONVERSION FUNCTIONS ====================

  /**
   * Converts Material UI date picker value to dd-MM-yyyy format for database
   * Frontend -> DB
   */
  formatDateForDB(date: string | null | undefined): string {
    if (!date) return '';

    try {
      // If date is an ISO string, split manually to avoid UTC conversion
      let dateObj: Date;

      if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
        // yyyy-MM-dd format (from Angular Material)
        const [year, month, day] = date.split('-').map(Number);
        dateObj = new Date(year, month - 1, day); // Local timezone
      } else {
        // Fallback for other formats — still uses local timezone
        dateObj = new Date(date);
      }

      if (isNaN(dateObj.getTime())) return '';

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date for DB:', error);
      return '';
    }
  }

  /**
   * Converts Material UI time picker value to HH:MM tt format for database
   * Frontend -> DB
   */
  formatTimeForDB(time: Date | null | undefined): string {
    if (!time) return '';

    try {
      if (!(time instanceof Date) || isNaN(time.getTime())) return '';

      let hours = time.getHours();
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      return `${formattedHours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time for DB:', error);
      return '';
    }
  }

  /**
   * Converts database date format (dd-MM-yyyy) to ISO string for MUI date picker
   * DB -> Frontend
   */
  parseDateFromDB(dateString: string | null | undefined): string | undefined {
    if (!dateString) return undefined;

    try {
      const [dd, mm, yyyy] = dateString.split('-');
      if (!dd || !mm || !yyyy) return undefined;

      const day = Number(dd);
      const month = Number(mm) - 1;
      const year = Number(yyyy);

      const date = new Date(Date.UTC(year, month, day));

      return date.toISOString(); // e.g. 2025-11-09T00:00:00.000Z
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  }

  /**
   * Converts database time format (HH:MM tt) to Date object for MUI time picker
   * DB -> Frontend
   */
  parseTimeFromDB(timeString: string | null | undefined): Date | undefined {
    if (!timeString) return undefined;

    try {
      timeString = timeString.replace(/[\s\u00A0\u2000-\u200D\u202F\u205F\u3000]+/g, ' ').trim();

      const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return undefined;

      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const period = match[3].toUpperCase();

      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = now.getMonth();
      const dd = now.getDate();

      // ✅ LOCAL DATE, NOT UTC
      return new Date(yyyy, mm, dd, hours, minutes, 0);
    } catch (error) {
      console.error('Error parsing time:', error);
      return undefined;
    }
  }

  // ==================== DISPLAY FORMATTING FOR TABLE ====================

  /**
   * Method to format date strings for display in table
   */
  formatDateForDisplay(dateString: string | null | undefined): string {
    if (!dateString) return '';

    // If already in dd-MM-yyyy format, return as-is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateString;
    }

    // Otherwise parse and format
    const isoDate = this.parseDateFromDB(dateString);
    if (!isoDate) return '';

    const date = new Date(isoDate);
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  /**
   * Method to format time strings for display in table
   */
  // formatTimeForDisplay(timeString: string | null | undefined): string {
  //   if (!timeString) return '';

  //   // If already in HH:MM AM/PM format, return as-is
  //   if (timeString.match(/^\d{2}:\d{2}\s*(AM|PM)$/i)) {
  //     return timeString;
  //   }

  //   // Try to parse and format
  //   const timeDate = this.parseTimeFromDB(timeString);
  //   if (!timeDate) return '';

  //   return this.formatTimeForDB(timeDate) || '';
  // }
}
