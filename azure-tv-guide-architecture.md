# Azure Architecture Options for the Teletext TV Guide App

## Scope

This note assumes the app stack is:

- Next.js App Router
- TypeScript
- CSS Modules
- TanStack Query
- MSW for local mocking
- Vitest and Playwright for tests

The app itself is a frontend-heavy schedule UI with:

- shared `channels.json`
- per-user personalization
- API-backed schedule data
- a 2-hour time-slice guide view

## Executive Recommendation

Use this path:

1. **V1**: Azure Static Web Apps with a static Next.js build and mocked or simple external API.
2. **V2**: Azure App Service for the Next.js app once you need more dynamic server behavior.
3. **Production / scale-out**: Azure Container Apps when you want containerized deployment, independent API evolution, background jobs, or service decomposition.

Reason:

- Azure Static Web Apps supports Next.js, including static Next.js and hybrid Next.js, but Azure documents hybrid/App Router support in Static Web Apps as preview and also lists unsupported features in that preview mode.
- Azure App Service is the safer general-purpose hosting option for a dynamic Node.js / Next.js app.
- Azure Container Apps is the better fit once you want a more service-oriented runtime with autoscaling, jobs, internal service discovery, and traffic splitting.

## Option Summary

| Stage | Azure service | Best when | Main advantages | Main drawbacks |
|---|---|---|---|---|
| V1 | Azure Static Web Apps | Frontend-first rollout, low ops overhead, mostly static delivery | Simple deployment, CDN-style frontend experience, good fit for static web delivery | Hybrid Next.js support is preview; some features are unsupported in preview mode |
| V2 | Azure App Service | You need stable dynamic Next.js hosting with minimal platform complexity | Straightforward Node.js hosting, lower platform risk than preview hybrid support | Less flexible than a container-first platform for future decomposition |
| Production | Azure Container Apps | You want containerized runtime, jobs, internal APIs, scale-to-zero, or service extraction later | Strong fit for APIs, background jobs, microservices, traffic splitting, internal ingress | More operational complexity than Static Web Apps or basic App Service |

## V1 Architecture

### Goal

Ship a working frontend quickly with:

- mock data or a thin external API
- per-user preferences
- 2-hour schedule slices
- low operational overhead

### Recommended Azure shape

- **Frontend**: Azure Static Web Apps
- **Data**:
  - start with checked-in mock JSON or MSW-backed mock API
  - optionally move to a lightweight external API later
- **CI/CD**: GitHub Actions or Azure Pipelines
- **Tests**:
  - Vitest in CI
  - Playwright in CI

### Suggested component view

```text
Browser
  -> Azure Static Web Apps
       -> static Next.js frontend
       -> calls mock/local API contract
```

### Why V1 fits

- Lowest operational overhead
- Fastest way to validate the UI and information architecture
- Good fit while the app is still mostly rendering schedule data and personalizing channel visibility/order

### V1 limitations

- If you need real server-side logic in Next.js, especially hybrid rendering features, Azure Static Web Apps supports those in preview for Next.js hybrid deployments.
- Azure documents unsupported features for hybrid Next.js in Static Web Apps preview, so this should not be your long-term architecture if you expect dynamic server behavior quickly.

## V2 Architecture

### Goal

Keep the app architecture simple while adding:

- real API integration
- authenticated users
- server-side personalization logic
- dynamic data fetching
- operational stability

### Recommended Azure shape

- **Frontend + Next runtime**: Azure App Service
- **API**:
  - either inside the same Next app initially
  - or as a separate Node API on App Service
- **Data**:
  - Azure SQL Database if you want relational personalization and schedule metadata
  - Azure Storage / Blob Storage only if schedule payloads or imports become file-based
- **Secrets**: Azure Key Vault
- **Identity**:
  - Microsoft Entra ID if enterprise sign-in matters
  - otherwise app-managed auth for early stages
- **Monitoring**: Azure Monitor / Application Insights

### Suggested component view

```text
Browser
  -> Azure App Service
       -> Next.js app
       -> internal API routes or Node backend
       -> Azure SQL Database
       -> Key Vault
       -> Application Insights
```

### Why V2 fits

- Keeps deployment simple
- Removes the preview-risk dependency of hybrid Next.js on Static Web Apps
- Gives you a stable home for authenticated and dynamic Next.js behavior

### When to move from V1 to V2

Move when one or more of these become true:

- you need authenticated per-user persistence
- the app depends on server-only data shaping
- you need predictable runtime behavior that should not rely on preview hosting support
- you want a single Azure-hosted Node runtime for the full app

## Production / Scale-Out Architecture

### Goal

Support growth without redesigning the product later:

- larger schedule imports
- personalization at scale
- background refresh or ingest jobs
- internal APIs
- possible future service extraction

### Recommended Azure shape

- **UI**:
  - either keep Next.js on Azure App Service
  - or run the web app container in Azure Container Apps too
- **API / backend**: Azure Container Apps
- **Background jobs**: Azure Container Apps Jobs
- **Container registry**: Azure Container Registry
- **Data**: Azure SQL Database
- **Cache**: Azure Cache for Redis if needed later
- **Secrets / identity**:
  - Managed Identity
  - Azure Key Vault
- **Observability**:
  - Azure Monitor
  - Log Analytics
  - Application Insights where applicable

### Suggested component view

```text
Browser
  -> Web App
       -> Next.js frontend
       -> TV Guide API
       -> Personalization service
       -> Schedule ingest / refresh jobs
       -> Azure SQL Database
       -> Redis (optional)
       -> Key Vault
       -> Log Analytics / Azure Monitor
```

### Why Container Apps fits production better

- Azure documents Container Apps as a fit for API endpoints, background processing jobs, event-driven processing, and microservices.
- It supports autoscaling, traffic splitting, internal ingress, service discovery, and scheduled/on-demand jobs.
- It gives you a cleaner path if you later split schedule ingestion, personalization, or recommendation features.

### When to choose Container Apps instead of App Service

Choose Container Apps if:

- you want container-based deployment as a standard
- you expect separate APIs or worker processes
- you need scheduled imports or background refresh jobs
- you want blue/green-style traffic splitting at the platform layer
- you expect future decomposition into multiple internal services

Keep App Service if:

- you want the simplest dynamic hosting model
- the app remains mostly one web runtime plus one database
- you do not want the extra operational surface of a container platform yet

## Recommended Path for This App

### Best near-term choice

For this TV guide app specifically:

- **Start on Azure Static Web Apps** if the first deliverable is mostly UI with mock data or a very thin external API.
- **Move to Azure App Service** as soon as authenticated personalization and dynamic server behavior become important.
- **Use Azure Container Apps later** only when the architecture actually needs jobs, independent APIs, or service-style deployment boundaries.

### Why this path is pragmatic

- It minimizes time-to-first-release.
- It avoids premature platform complexity.
- It still preserves a clean path to more advanced Azure hosting later.

## Testing on Azure

### CI baseline

Use either GitHub Actions or Azure Pipelines to run:

- linting
- Vitest
- Playwright

### Azure-specific note

Microsoft documents that the older Microsoft Playwright Testing offering is being retired on **March 8, 2026**, and directs users to create a new **Playwright Workspace in Azure App Testing**, which is generally available.

### Recommendation

- Use regular Playwright in CI first.
- If you later need large-scale managed browser execution in Azure, evaluate **Playwright Workspaces in Azure App Testing**, not the retiring Microsoft Playwright Testing preview.

## Decision Matrix

| Requirement | Best choice |
|---|---|
| Fastest frontend-first launch | Azure Static Web Apps |
| Stable dynamic Next.js hosting | Azure App Service |
| Internal APIs and background jobs | Azure Container Apps |
| Lowest ops overhead | Azure Static Web Apps |
| Easiest path for one Node app | Azure App Service |
| Best future microservice path | Azure Container Apps |

## Final Recommendation

If I were setting this up today:

1. Build the app with Next.js and the proposed frontend stack.
2. Deploy the first version to **Azure Static Web Apps** only if the app can stay mostly static.
3. Plan an intentional move to **Azure App Service** before introducing meaningful server-side logic.
4. Treat **Azure Container Apps** as the production evolution path only if the app grows into APIs, jobs, or multi-service deployment.

That gives you the simplest valid start without trapping the app in an inflexible hosting choice.

## Source Notes

- Azure Static Web Apps supports Next.js, including hybrid Next.js, but Microsoft documents hybrid/App Router support there as **preview** and lists unsupported features in that mode.
- Azure App Service supports Node.js web app deployment.
- Azure Container Apps is positioned by Microsoft for API endpoints, jobs, event-driven processing, and microservices, with autoscaling and traffic-splitting support.
- Microsoft documents that Microsoft Playwright Testing is retiring and points users to Playwright Workspaces in Azure App Testing.
