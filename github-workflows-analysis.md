# GitHub Workflows Analysis for Personal Backup Repository

## Summary

This document analyzes all GitHub workflows in `.github/workflows/` and categorizes them based on whether they should be disabled for a personal backup repository.

## Categories

### ❌ DISABLE - Workflows requiring secrets or external services

These workflows require secrets, external services, or special permissions that won't work in a personal backup:

1. **a11y.yml** - Accessibility linting
   - Requires: `AXE_LINTER_API_KEY`
   - Purpose: Checks for accessibility issues
   - Action: DISABLE

2. **backend-review.yml** - Backend unit tests
   - Requires: Multiple secrets (`MONGO_URI`, `OPENAI_API_KEY`, `JWT_SECRET`, `CREDS_KEY`, `CREDS_IV`, `BAN_*`)
   - Purpose: Runs backend tests on PRs
   - Action: DISABLE

3. **build.yml** - Azure container workflow
   - Requires: `AZURE_CREDENTIALS`, `REGISTRY_LOGIN_SERVER`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`
   - Purpose: Builds GitHub Runner container for Azure
   - Action: DISABLE

4. **deploy-dev.yml** - Deploy to test server
   - Requires: `DO_SSH_PRIVATE_KEY`, `DO_KNOWN_HOSTS`, `DO_HOST`, `DO_USER`
   - Purpose: Deploys to DigitalOcean droplet
   - Action: DISABLE

5. **deploy.yml** - Deploy GitHub Runner to Azure
   - Requires: `AZURE_CREDENTIALS`, `REGISTRY_*`, `PAT_TOKEN`
   - Purpose: Deploys self-hosted runner to Azure Container Instances
   - Action: DISABLE

6. **dev-branch-images.yml** - Docker image builds for dev
   - Requires: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
   - Purpose: Builds and pushes Docker images to Docker Hub and GHCR
   - Action: DISABLE

7. **dev-images.yml** - Docker image builds for main
   - Requires: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
   - Purpose: Builds and pushes Docker images to Docker Hub and GHCR
   - Action: DISABLE

8. **generate_embeddings.yml** - Generate embeddings for docs
   - Requires: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_DOC_EMBEDDINGS_KEY`
   - Purpose: Generates embeddings for documentation search
   - Action: DISABLE

9. **main-image-workflow.yml** - Manual Docker build
   - Requires: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
   - Purpose: Manual trigger to build Docker images
   - Action: DISABLE

10. **tag-images.yml** - Docker builds on tags
    - Requires: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
    - Purpose: Builds Docker images when tags are pushed
    - Action: DISABLE

11. **helmcharts.yml** - Helm chart releases
    - Requires: GitHub Pages deployment permissions
    - Purpose: Publishes Helm charts on tag pushes
    - Action: DISABLE

### ✅ KEEP - Workflows that work without external dependencies

These workflows can run in a personal repository without modification:

1. **eslint-ci.yml** - ESLint code quality checks
   - Requires: No external secrets (uses `GITHUB_TOKEN` which is automatic)
   - Purpose: Runs ESLint on changed files in PRs
   - Action: KEEP

2. **frontend-review.yml** - Frontend unit tests
   - Requires: No external secrets
   - Purpose: Runs frontend tests on PRs
   - Action: KEEP

3. **i18n-unused-keys.yml** - Detect unused translations
   - Requires: No external secrets (uses `GITHUB_TOKEN`)
   - Purpose: Finds unused i18n keys
   - Action: KEEP

4. **unused-packages.yml** - Detect unused NPM packages
   - Requires: No external secrets (uses `GITHUB_TOKEN`)
   - Purpose: Finds unused dependencies
   - Action: KEEP

### ⚠️ MAYBE - Optional workflows

These workflows are optional but may need modification:

1. **generate-release-changelog-pr.yml** - Release changelog generation
   - Requires: No external secrets but expects specific repo structure
   - Purpose: Creates PR with changelog on releases
   - Action: MAYBE (only useful if you plan to create releases)

2. **generate-unreleased-changelog-pr.yml** - Unreleased changelog generation
   - Requires: No external secrets but runs on schedule
   - Purpose: Weekly PR with unreleased changes
   - Action: MAYBE (disable if you don't want weekly PRs)

## Recommendations

For a personal backup repository, you should:

1. **Disable all workflows in the DISABLE category** by either:
   - Deleting the workflow files
   - Adding `.disabled` to the filename (e.g., `deploy.yml.disabled`)
   - Adding a condition to skip: `if: false` at the job level

2. **Keep the workflows in the KEEP category** as they provide useful code quality checks

3. **Consider the MAYBE workflows** based on your needs:
   - If you won't be making releases, disable the changelog workflows
   - If you don't want automated weekly PRs, disable the unreleased changelog workflow

## Quick Disable Script

To quickly disable all workflows that require secrets:

```bash
cd .github/workflows/

# Disable workflows requiring secrets
for workflow in a11y.yml backend-review.yml build.yml deploy-dev.yml deploy.yml \
                dev-branch-images.yml dev-images.yml generate_embeddings.yml \
                main-image-workflow.yml tag-images.yml helmcharts.yml; do
  if [ -f "$workflow" ]; then
    mv "$workflow" "$workflow.disabled"
  fi
done
```

To re-enable a workflow later:
```bash
mv workflow-name.yml.disabled workflow-name.yml
```