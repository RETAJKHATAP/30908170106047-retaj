# ShopSphere — Rollback Plan

**Student ID:** 30908170106047

## 1. Detecting a Failed Release

The ShopSphere backend's `/api/health` endpoint is monitored by an UptimeRobot HTTP monitor (configured in Task 1), which checks the endpoint on a regular interval and expects a `200 OK` response with `"success": true`.

A failed release is detected when either of the following happens shortly after a deployment:

- **UptimeRobot alert:** the monitor reports the health check as **DOWN** (non-200 response, timeout, or connection failure) and sends an alert notification.
- **Manual check:** opening `/api/health` in a browser returns a `5xx` status or a `"success": false` response, or the frontend fails to load data from the API.

Either signal is treated as confirmation that the most recent release is broken in production.

## 2. Steps to Restore the Previous Working Version

Once a failed release is confirmed, the previous working deployment is restored via Vercel:

1. Open the affected project (backend or frontend) in the Vercel dashboard.
2. Go to the **Deployments** tab and locate the last deployment that was known to be working (the one before the current, broken one) — it should be marked as **Ready** with a passing status.
3. Click the **⋯** menu next to that deployment and select **Promote to Production** (or **Redeploy**, depending on the Vercel UI version).
4. Confirm the action. Vercel immediately points the production domain at that previous build — no rebuild is required, so this takes effect within seconds.
5. Re-check `/api/health` to confirm it now returns `"success": true`, and confirm the UptimeRobot monitor reports the service as **UP** again.
6. Separately, investigate and fix the underlying issue in a new commit/PR before attempting to deploy to production again — the pipeline's branch protection rule (main only accepts merges after the pipeline passes) prevents the broken change from reaching production a second time until it's fixed.

## 3. Notes

- This process restores both the backend and frontend independently, since each is a separate Vercel project — if only one of them is broken, only that one needs to be rolled back.
- No database migration rollback is included here, since ShopSphere's schema changes are additive and the current release does not require destructive migrations.
