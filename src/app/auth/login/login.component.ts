import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login to GitHub</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>This application requires access to your GitHub organization data to display Copilot usage metrics.</p>
          <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="login()">Login with GitHub</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    }
    mat-card {
      width: 400px;
      max-width: 90%;
    }
    .error-message {
      color: red;
      margin: 10px 0;
    }
  `]
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Check for error messages in the URL
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.errorMessage = params['error'];
      }
    });
  }

  login(): void {
    this.authService.login();
  }
} 