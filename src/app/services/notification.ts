import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {}

  /**
   * Displays error message in snackbar.
   * @param message The message to display.
   * @param duration Duration in milliseconds, default 3000.
   */
  showError(message: string, duration: number = 3000) {
    this.snackbar.open(message, "Dismiss", {
      duration,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ["snack-error"]
    });
  }

  /**
   * Displays general notification in snackbar.
   * @param message The message to display.
   * @param duration Duration in milliseconds, default 3000.
   */
  showNote(message: string, duration: number = 3000) {
    this.snackbar.open(message, "OK", {
      duration,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ["snack-success"]
    });
  }
}
