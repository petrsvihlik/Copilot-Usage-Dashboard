# Copilot Usage Dashboard
This Angular application is designed to provide insights into GitHub Copilot usage within an organization. It utilizes the Copilot Usage Metrics API (private Beta) and Copilot Seat Management API to fetch and display relevant data.

> **Note:** This solution was developed to demonstrate potential use cases and is not intended for production use. If you plan to deploy it in a production environment, please customize it to meet your non-functional requirements (NFRs). This repository is not regularly maintained or updated.

## Features
1. **Home/Organization Tab:** Displays Copilot usage data for the organization.
2. **Impact Tab:** Planned feature to showcase GitHub-specific metrics indicating the impact of Copilot, such as lines of code committed per day, overall issue counts, etc. (Pending implementation)
3. **Sample Response Tab:** Provides a sample API response schema for reference.
4. **Org Seats Tab:** Shows seat assignment details for the organization.
5. **Enterprise Tab:** Planned feature to capture Copilot usage at the enterprise level. (Pending implementation)

## Getting Started

### Setting up GitHub OAuth
1. Register a new OAuth App on GitHub:
   - Go to GitHub Developer Settings > OAuth Apps > New OAuth App
   - Set Homepage URL to `http://localhost:4200`
   - Set Authorization callback URL to `http://localhost:4200/callback`
   - Note the Client ID and Client Secret

2. Configure the application:
   - Update the GitHub client ID in `src/environments/environment.ts` 
   - Create a `.env` file in the `server` directory using the `.env.example` template
   - Add your GitHub client ID and client secret to the `.env` file

3. Start the OAuth proxy server:
   ```bash
   cd server
   npm install
   npm start
   ```

4. In a new terminal, start the Angular application:
   ```bash
   npm install
   npm start
   ```

5. Access the application in your browser at http://localhost:4200
   - You'll be prompted to login with GitHub
   - After authenticating, you'll have access to your organization's Copilot usage data

### Using Sample Data
If you want to use sample data without GitHub OAuth:
1. Comment out the GitHub OAuth code in the services and components
2. Enable the sample data loading code in `src/app/services/organization-level.service.ts`
3. Run the app using `npm start`

## References
1. [GitHub Copilot Usage Metrics API](#) - Yet to be published (Private Beta)
2. [GitHub Copilot Seat Management API](https://docs.github.com/en/rest/copilot?apiVersion=2022-11-28)
3. [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

### Status: 15-Jan 



https://github.com/octodemo/Copilot-Usage-Dashboard/assets/10282550/20db62a2-b020-4318-9ed8-f2ef488d7dc2

