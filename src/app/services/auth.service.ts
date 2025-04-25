import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly GITHUB_CLIENT_ID = environment.github.clientId;
  private readonly GITHUB_OAUTH_REDIRECT_URI = environment.github.redirectUri;
  private readonly GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
  private readonly TOKEN_STORAGE_KEY = 'github_token';
  private readonly TOKEN_EXCHANGE_URL = 'http://localhost:3000/exchange-github-code';
  
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Start the GitHub OAuth flow
   */
  login(): void {
    const params = new URLSearchParams({
      client_id: this.GITHUB_CLIENT_ID,
      redirect_uri: this.GITHUB_OAUTH_REDIRECT_URI,
      scope: environment.github.scope,
      state: this.generateRandomState()
    });

    window.location.href = `${this.GITHUB_OAUTH_URL}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback and exchange code for token
   */
  handleCallback(code: string, state: string): Observable<boolean> {
    // Verify state matches our stored state (In a real app, implement proper state validation)
    
    // Exchange the code for a token using our proxy server
    return this.getTokenFromCode(code).pipe(
      tap(token => {
        this.storeToken(token);
        this.tokenSubject.next(token);
      }),
      map(() => true),
      catchError((error) => {
        console.error('Authentication error:', error);
        return of(false);
      })
    );
  }

  /**
   * Exchange the code for a token using our proxy server
   */
  private getTokenFromCode(code: string): Observable<string> {
    return this.http.post<{access_token: string}>(this.TOKEN_EXCHANGE_URL, { code })
      .pipe(map(response => response.access_token));
  }

  /**
   * Get the stored token from localStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_STORAGE_KEY);
  }

  /**
   * Store the token in localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getStoredToken();
  }

  /**
   * Log out the user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    this.tokenSubject.next(null);
    this.router.navigate(['/']);
  }

  /**
   * Generate a random state parameter for OAuth security
   */
  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
} 