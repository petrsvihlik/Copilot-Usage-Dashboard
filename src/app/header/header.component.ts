import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private router: Router, 
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  links = [
    {label: 'Organization', path: '/organization-level'},
    {label: 'Impact', path: '/impact'},
    {label: 'Org Seats', path: '/org-seats'}
  ];

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.token$.subscribe(token => {
      this.isLoggedIn = !!token;
    });
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
