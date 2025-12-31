# FireCMS Deployment Plan

## Overview

This plan outlines the extension of the existing CI/CD workflows to deploy both the website and CMS applications to Firebase Hosting. The current setup only deploys the Next.js website, but we need to add deployment for the FireCMS application as well.

## Current Setup Analysis

### Project Structure
- **Monorepo** with pnpm workspaces
- **Website**: Next.js app in `apps/website/`
- **CMS**: FireCMS app in `apps/cms/` (Vite-based SPA)
- **Shared**: Common code in `packages/shared/`

### Current Deployment
- Only the website is deployed to Firebase Hosting
- Uses single hosting site configuration in `firebase.json`
- CI workflow (`ci.yml`) builds and previews the website
- Deploy workflow (`deploy.yml`) builds and deploys the website to production

### FireCMS Deployment Requirements
- FireCMS is a **single-page application** that can be deployed to static hosting
- Requires Firebase Hosting with SPA redirects (all routes → `/index.html`)
- Can be deployed alongside the website using Firebase's multi-site hosting
- Build output goes to `dist` directory (configured in Vite)

## Proposed Changes

### 1. Firebase Configuration (`firebase.json`)

**Current:**
```json
{
  "hosting": {
    "public": "apps/website/out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true
  }
}
```

**Proposed:**
```json
{
  "hosting": [
    {
      "site": "bytes-and-nibbles",
      "public": "apps/website/out",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "cleanUrls": true
    },
    {
      "site": "bytes-and-nibbles-cms",
      "public": "apps/cms/dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

**Rationale:**
- Convert to multi-site hosting array
- Website keeps existing configuration
- CMS gets dedicated hosting site with SPA rewrites
- CMS build output is `apps/cms/dist` (Vite default)

### 2. CI Workflow Extensions (`ci.yml`)

**Changes needed:**
- Add CMS build step to the `build_and_preview` job
- Deploy both website and CMS to preview channels
- Update job dependencies and conditions

**Proposed additions:**
- Add `cms` output to the `changes` job
- Add CMS build and preview deployment steps
- Ensure both builds run in parallel where possible

### 3. Deploy Workflow Extensions (`deploy.yml`)

**Changes needed:**
- Add CMS build step before deployment
- Deploy both website and CMS to live channels
- Maintain current permissions and environment setup

**Proposed additions:**
- Add `build_cms` step after `build` step
- Add `deploy_cms` step after `deploy_website` step
- Use appropriate Firebase hosting targets

### 4. Build Process Updates

**Current build scripts:**
- Website: `pnpm build:website` → outputs to `apps/website/out`
- CMS: `pnpm build:cms` → outputs to `apps/cms/dist`

**No changes needed** - existing build scripts work correctly.

### 5. Deployment URLs


#### Custom Domain Options

Firebase Hosting supports custom domains for both sites:

**Selected Configuration: Subdomain**
- **Website**: `https://bytes-and-nibbles.com/`
- **CMS**: `https://cms.bytes-and-nibbles.com/`

**Setup Requirements:**
- Domain ownership verification
- DNS configuration (CNAME or A records)
- SSL certificate provisioning (automatic)
- Multiple domains can point to the same Firebase project

**Firebase Custom Domain Setup:**
1. Go to Firebase Console → Hosting
2. Click "Add custom domain" for each site
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning (can take up to 24 hours)

## Implementation Steps

### Phase 1: Firebase Configuration
1. Update `firebase.json` to support multi-site hosting
2. Test Firebase configuration locally
3. Verify hosting sites are properly configured in Firebase console

### Phase 2: CI Workflow Updates
1. Update `ci.yml` to detect CMS changes
2. Add CMS build and preview deployment steps
3. Test CI workflow with both apps

### Phase 3: Deploy Workflow Updates
1. Update `deploy.yml` to build and deploy CMS
2. Add separate deployment step for CMS
3. Test production deployment

### Phase 4: Testing and Validation
1. Test both applications deploy correctly
2. Verify CMS routing works with SPA redirects
3. Test both preview and production deployments
4. Update any documentation as needed

## Risk Assessment

### Low Risk
- Firebase multi-site hosting is well-supported
- CMS deployment follows same pattern as website
- Changes are additive, don't break existing functionality

### Medium Risk
- Potential conflicts between hosting configurations
- Build time increases (both apps build in parallel)
- Need to ensure proper Firebase project permissions

### Mitigation Strategies
- Test all changes in preview environments first
- Use feature branches for testing
- Monitor build times and adjust parallelism if needed
- Ensure proper error handling in workflows

## Dependencies

- Firebase CLI with multi-site support
- Appropriate Firebase project permissions for multiple sites
- No changes to existing build scripts required
- All existing tooling (pnpm, Node.js) remains compatible

## Success Criteria

- [ ] Both website and CMS deploy successfully in CI
- [ ] Both applications accessible at their respective URLs
- [ ] CMS routing works correctly (SPA redirects)
- [ ] No regression in website deployment
- [ ] Build times remain acceptable
- [ ] All existing workflows continue to function
