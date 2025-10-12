import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-daycarelayout',
  imports: [RouterOutlet, RouterLink, MatIconModule, MatCardModule],
  templateUrl: './daycarelayout.html',
  styleUrl: './daycarelayout.css',
  standalone: true,
})
export class Daycarelayout {
  subMenuOpen: { [key: string]: boolean } = {
    enrollments: false,
    students: false,
  };
  isExpanded: boolean = false;

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  expand() {
    this.isExpanded = true;
  }

  collapse() {
    this.isExpanded = false;
    // Close all submenus when sidebar collapses
    Object.keys(this.subMenuOpen).forEach((key) => {
      this.subMenuOpen[key] = false;
    });
  }

  toggleSubmenu(menuName: string) {
    this.subMenuOpen[menuName] = !this.subMenuOpen[menuName];
  }

  openSubmenu(menuName: string) {
    this.subMenuOpen[menuName] = true;
  }
}
