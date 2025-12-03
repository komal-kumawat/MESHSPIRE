# Production Deployment Configuration

## Backend Environment Variables (Render/Production)

Make sure your production backend has these environment variables set correctly:

```bash
# Production URLs
CLIENT_URL=https://meshspire.vercel.app
CLIENT_ORIGIN=https://meshspire.vercel.app
CLIENT_ORIGINS=https://meshspire.vercel.app
FRONTEND_URL=https://meshspire.vercel.app

# These should already be set
PORT=8000
MONGO_URI=<your-mongo-uri>
STRIPE_SECRET_KEY=<your-stripe-key>
JWT_ACCESS_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-secret>
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-secret>
GOOGLE_CALLBACK_URL=<your-google-callback-url>
```

## Frontend Environment Variables (Vercel)

In Vercel project settings, add:

```bash
VITE_API_BASE_URL=https://meshspire-core-prod.onrender.com/api/v0
VITE_API_URL=https://meshspire-core-prod.onrender.com
```

## Files Changed for Production Fix

1. **vercel.json** - Simplified SPA routing configuration
2. **vite.config.ts** - Added base and build output configuration
3. **public/\_redirects** - Added Vercel SPA redirect rules
4. **.env.production** - Frontend production environment variables

## Deployment Steps

### Backend (Render)

1. Go to your Render dashboard
2. Navigate to your backend service environment variables
3. Update `CLIENT_URL`, `CLIENT_ORIGIN`, `CLIENT_ORIGINS`, and `FRONTEND_URL` to `https://meshspire.vercel.app`
4. Save and trigger a redeploy if needed

### Frontend (Vercel)

1. Commit and push these changes:
   ```bash
   git add .
   git commit -m "Fix production routing for payment success pages"
   git push origin main
   ```
2. Verify environment variables in Vercel dashboard
3. Vercel will auto-deploy on push

## Testing

After deployment:

1. Go to your production site
2. Create a lesson
3. Click "Pay & Confirm"
4. Complete Stripe checkout
5. You should be redirected to `/payment-success` (NOT 404)
6. Payment should verify and redirect to dashboard
7. Lesson should show as paid

## Troubleshooting

If you still see 404:

- Check browser console for errors
- Verify the Stripe redirect URL in network tab
- Ensure backend CLIENT_URL matches your frontend domain
- Clear browser cache
- Check Vercel deployment logs
