import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  template: '<div class="loading">Processing login, please wait...</div>',
  styles: ['.loading { display: flex; justify-content: center; align-items: center; height: 100vh; }']
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      
      if (code) {
        this.authService.handleCallback(code, state).subscribe(success => {
          if (success) {
            this.router.navigate(['/']); // Navigate to home or dashboard
          } else {
            // Handle error
            this.router.navigate(['/login'], { 
              queryParams: { error: 'Failed to authenticate with GitHub' } 
            });
          }
        });
      } else {
        this.router.navigate(['/login'], { 
          queryParams: { error: 'No authorization code provided' } 
        });
      }
    });
  }
} 