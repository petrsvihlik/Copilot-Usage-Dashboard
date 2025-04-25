import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, map, mergeMap, Observable, of, catchError } from 'rxjs';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationLevelService {

  private copilotUsageDataUrl = 'assets/copilot_usage_data.json'; // URL to JSON data
  private copilotSeatsDataUrl = 'assets/copilot_seats_data.json'; // URL to JSON data

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCopilotUsageData(): Observable<any>  {
    // Try to get data from API, fallback to sample data on error
    return this.invokeCopilotUsageApi().pipe(
      catchError(error => {
        console.warn('Error fetching Copilot usage data from API, using sample data instead:', error);
        return this.http.get(this.copilotUsageDataUrl);
      })
    );
  }

  getCopilotSeatsData(): Observable<any>  {
    // Try to get data from API, fallback to sample data on error
    return this.invokeCopilotSeatApi().pipe(
      catchError(error => {
        console.warn('Error fetching Copilot seats data from API, using sample data instead:', error);
        return this.http.get(this.copilotSeatsDataUrl);
      })
    );
  }

  invokeCopilotUsageApi(): Observable<any> {
    const orgName = environment.orgName; 
    // Use template literal to replace ${orgName} with the actual org name
    const apiUrl = `${environment.ghBaseUrl}/${environment.copilotUsageApiUrl.replace('${orgName}', orgName)}`;
    const token = this.authService.getStoredToken(); 
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    return this.http.get(apiUrl, { headers }).pipe(
      map((data: any) => {
        // Transform the API response to match the expected format
        return data.map((item: any) => {
          // Calculate total suggestions and acceptances
          let totalSuggestions = 0;
          let totalAcceptances = 0;
          let totalLinesSuggested = 0;
          let totalLinesAccepted = 0;
          
          const breakdown: any[] = [];
          
          // Process IDE completions data if available
          if (item.copilot_ide_code_completions && item.copilot_ide_code_completions.editors) {
            item.copilot_ide_code_completions.editors.forEach((editor: any) => {
              const editorName = editor.name;
              
              if (editor.models) {
                editor.models.forEach((model: any) => {
                  if (model.languages) {
                    model.languages.forEach((lang: any) => {
                      // Add to totals
                      totalSuggestions += lang.total_code_suggestions || 0;
                      totalAcceptances += lang.total_code_acceptances || 0;
                      totalLinesSuggested += lang.total_code_lines_suggested || 0;
                      totalLinesAccepted += lang.total_code_lines_accepted || 0;
                      
                      // Add to breakdown
                      breakdown.push({
                        language: lang.name,
                        editor: editorName,
                        suggestions_count: lang.total_code_suggestions || 0,
                        acceptances_count: lang.total_code_acceptances || 0,
                        lines_suggested: lang.total_code_lines_suggested || 0,
                        lines_accepted: lang.total_code_lines_accepted || 0,
                        active_users: lang.total_engaged_users || 0
                      });
                    });
                  }
                });
              }
            });
          }
          
          return {
            day: item.date,
            total_suggestions_count: totalSuggestions,
            total_acceptances_count: totalAcceptances,
            total_lines_suggested: totalLinesSuggested,
            total_lines_accepted: totalLinesAccepted,
            total_active_users: item.total_active_users || 0,
            total_chat_acceptances: item.copilot_ide_chat?.total_chats || 0,
            total_chat_turns: item.copilot_ide_chat?.total_chats || 0,
            total_active_chat_users: item.copilot_ide_chat?.total_engaged_users || 0,
            breakdown: breakdown
          };
        });
      })
    );
  }

  invokeCopilotSeatApi(): Observable<any> {
    const orgName = environment.orgName;
    // Use template literal to replace ${orgName} with the actual org name
    const apiUrl = `${environment.ghBaseUrl}/${environment.copilotSeatApiUrl.replace('${orgName}', orgName)}`;
  
    let firstPage = true;
  
    // Function to fetch a single page
    const fetchPage = (pageNo: number): Observable<any> => {
      return this.getPaginatedSeatsData(apiUrl, pageNo);
    };
  
    return fetchPage(1).pipe(
      mergeMap((firstPageData: any) => {
        const totalPages = firstPageData.total_pages;
        let allSeats = [...firstPageData.seats];
  
        if (totalPages <= 1) {
          // If there's only one page, return the data
          return [firstPageData];
        }
  
        // Fetch all remaining pages
        const pageRequests = [];
        for (let page = 2; page <= totalPages; page++) {
          pageRequests.push(fetchPage(page));
        }
  
        return pageRequests.length
          ? combineLatest(pageRequests).pipe(
              map((otherPages: any[]) => {
                otherPages.forEach((pageData) => {
                  allSeats = allSeats.concat(pageData.seats);
                });
                return { ...firstPageData, seats: allSeats };
              })
            )
          : of({ ...firstPageData, seats: allSeats });
      })
    );
  }

  getPaginatedSeatsData(apiUrl:any, pageNo:any): Observable<any> {
    const token = this.authService.getStoredToken(); 
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    return this.http.get(apiUrl+"?page="+pageNo, { headers });
  }
}