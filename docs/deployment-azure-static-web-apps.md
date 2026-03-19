# Deploying to Azure Static Web Apps

This project is set up as a **static Next.js export** and is a good fit for Azure Static Web Apps as a v1 deployment target.

## Why this fits Azure Static Web Apps

The app currently:

- builds to static files
- loads schedule and user data client-side
- does not require request-time server rendering
- does not require protected server APIs in v1

That matches the static Next.js deployment model well.

## Current project settings

This repository already includes the main static-export setting:

```js
// next.config.mjs
const nextConfig = {
  output: "export"
};
```

Build output is written to:

```text
out/
```

## Azure Static Web Apps setup

When creating the Azure Static Web App from GitHub, use:

- **Repository**: `mpco25/tv-guide`
- **Branch**: `main`
- **Build preset**: Custom or Next.js static export equivalent
- **App location**: `/`
- **API location**: leave empty
- **Output location**: `out`

## Required GitHub secret

The deployment workflow expects this repository secret:

```text
AZURE_STATIC_WEB_APPS_API_TOKEN
```

You can get the deployment token from the Azure Static Web App resource and store it in the repository secrets.

The workflow also sets `SKIP_DEPLOY_ON_MISSING_SECRETS=true`, which lets the workflow continue without deploying if the deployment secret has not been configured yet.

## Recommended first deployment flow

1. Create an Azure Static Web App in the Azure portal.
2. Connect it to this GitHub repository.
3. Use `main` as the deployment branch.
4. Set the build paths so Azure deploys the generated `out/` directory.
5. Let Azure generate its deployment workflow, or replace it later with a repo-owned workflow if you want stricter control.

This repository now includes a repo-owned workflow at:

```text
.github/workflows/azure-static-web-apps.yml
```

It uses the official `Azure/static-web-apps-deploy` GitHub Action to build and deploy the app.

## Local verification before deployment

Run these commands locally before relying on Azure deployment:

```bash
npm install
npm test
npm run build
```

All three already pass in the current scaffold.

## Important limitation

This deployment approach is right for the current app because the app is **static-hosted but browser-dynamic**.

That means:

- Azure serves prebuilt files
- the browser fetches the channel, user, and schedule data
- personalization and guide shaping happen in the client

If the app later needs server-side authentication, request-time personalization, protected APIs, or server-rendered data composition, Azure App Service or Azure Container Apps becomes a better long-term fit.

## Recommended evolution path

- **V1**: Azure Static Web Apps
- **V2**: Azure App Service for dynamic server behavior
- **Later**: Azure Container Apps if the app grows into APIs, jobs, or multiple services

## Notes for future API integration

The frontend already uses an adapter boundary in `lib/api`.

That means you can later replace the static JSON implementation with:

- a hosted REST API
- a serverless backend
- a service running on App Service or Container Apps

without rewriting the core guide rendering logic.
