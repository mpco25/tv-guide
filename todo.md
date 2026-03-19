# TODO

## Checklist

1. [ ] Azure Portal: Create the Static Web App and connect it to `mpco25/tv-guide` on `main`.
2. [ ] Deployment Token In Azure: Open the created Static Web App and copy the deployment token.
3. [ ] GitHub: Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to the repository Actions secrets.
4. [ ] First Deployment Trigger: Push a new commit to `main` and confirm the deploy workflow runs.
5. [ ] Post-Deploy Verification: Open the deployed site and verify the guide loads and works.
6. [ ] First Troubleshooting Checks: Verify the secret, workflow, repo/branch, and build paths if deployment fails.

## Detailed Click Path

### Azure Portal

1. Open the Azure portal.
2. Use the top search bar and search for `Static Web Apps`.
3. Open **Static Web Apps**.
4. Click **Create**.
5. In the create flow, fill in:
   - subscription
   - resource group
   - app name
   - hosting plan
   - region
6. In the deployment section, choose **GitHub**.
7. Authorize GitHub access if Azure prompts for it.
8. Select:
   - Organization: `mpco25`
   - Repository: `tv-guide`
   - Branch: `main`
9. In build details, enter exactly:
   - App location: `/`
   - API location: leave empty
   - Output location: `out`
10. Create the Static Web App resource.

### Deployment Token In Azure

1. Open the newly created Static Web App resource.
2. Open the area that shows the deployment token for the app.
3. Copy the deployment token.

### GitHub

1. Open the GitHub repository: `https://github.com/mpco25/tv-guide`
2. Click **Settings**.
3. Click **Secrets and variables**.
4. Click **Actions**.
5. Click **New repository secret**.
6. Add:
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: paste the deployment token from Azure
7. Save the secret.

### First Deployment Trigger

1. Push a new commit to `main`.
2. Open the repository **Actions** tab.
3. Open the workflow named `Azure Static Web Apps Deploy`.
4. Confirm the workflow starts and completes successfully.
5. Open the generated Static Web App URL from Azure.

### Post-Deploy Verification

1. Confirm the home page loads.
2. Confirm the guide shows channel rows.
3. Confirm the 2-hour slice navigation works.
4. Confirm user switching works.
5. Confirm no missing JSON files or broken asset paths appear in the browser.

### First Troubleshooting Checks

1. Confirm the repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` exists.
2. Confirm the workflow file exists at `.github/workflows/azure-static-web-apps.yml`.
3. Confirm Azure was connected to:
   - Organization: `mpco25`
   - Repository: `tv-guide`
   - Branch: `main`
4. Confirm the Azure build settings are:
   - App location: `/`
   - API location: empty
   - Output location: `out`
5. Check the latest GitHub Actions run for auth, build, or path errors.
