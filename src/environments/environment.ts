// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  orgName: "Kentico",
  token: "", // Will be obtained via OAuth
  ghBaseUrl:"https://api.github.com",
  copilotUsageApiUrl:"orgs/${orgName}/copilot/metrics",
  copilotSeatApiUrl:"orgs/${orgName}/copilot/billing/seats",
  github: {
    clientId: "Iv23liyQhIdjeRZXOOlR", // Replace with your GitHub OAuth App client ID
    redirectUri: "http://localhost:4200/callback",
    scope: "read:org admin:org" // Adjust scopes as needed
  }
};


// https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#get-a-summary-of-copilot-usage-for-organization-members



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
