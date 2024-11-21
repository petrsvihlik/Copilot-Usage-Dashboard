import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { combineLatest, map, mergeMap, Observable, of } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationLevelService {

  private copilotUsageDataUrl = 'assets/copilot_usage_data.json'; // URL to JSON data
  private copilotSeatsDataUrl = 'assets/copilot_seats_data.json'; // URL to JSON data

  constructor(private http: HttpClient) { }

  getCopilotUsageData(): Observable<any>  {
    // sample dta loaded from local file
    //return this.http.get(this.copilotUsageDataUrl);
    // uncomment below line to invoke API
    // modify the environment file to add your token
    // modify the organization name to your organization
    return this.invokeCopilotUsageApi();
  }

  getCopilotSeatsData(): Observable<any>  {
    // sample dta loaded from local file
    //return this.http.get(this.copilotSeatsDataUrl);
    // uncomment below line to invoke API
    // modify the environment file to add your token
    // modify the organization name to your organization
    return this.invokeCopilotSeatApi();
  }

  invokeCopilotUsageApi(): Observable<any> {
    const orgName = environment.orgName; 
    const apiUrl = `${environment.ghBaseUrl}/${orgName}/${environment.copilotUsageApiUrl}`;
    const token = environment.token; 
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    return this.http.get(apiUrl, { headers });
  }

  invokeCopilotSeatApi(): Observable<any> {
    const orgName = environment.orgName; 
    const apiUrl = `${environment.ghBaseUrl}/${orgName}/${environment.copilotSeatApiUrl}`;
  
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
    const token = environment.token; 
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    return this.http.get(apiUrl+"?page="+pageNo, { headers });

  }

}