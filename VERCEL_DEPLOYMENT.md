# Vercel Deployment Configuration

## Required Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

### 1. Database
```
DATABASE_URL=your_neon_db_connection_string
```

### 2. NextAuth (CRITICAL - This was missing!)
```
NEXTAUTH_SECRET=jgIBgWtVtLf17RJrgRBN/4VDCLErw+H4aAdD+3BY/Wg=
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 3. Environment
```
NODE_ENV=production
```

## Steps to Fix Your 401 Error:

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings > Environment Variables**
4. **Add these variables:**
   - `NEXTAUTH_SECRET` = `jgIBgWtVtLf17RJrgRBN/4VDCLErw+H4aAdD+3BY/Wg=`
   - `NEXTAUTH_URL` = `https://your-app-name.vercel.app`
   - `DATABASE_URL` = `your_neon_connection_string`
   - `NODE_ENV` = `production`

5. **Redeploy your app** (or it will auto-redeploy)

## Why This Fixes the 401 Error:

- **NEXTAUTH_SECRET**: Required for JWT token signing in production
- **NEXTAUTH_URL**: Required for proper callback URL generation
- **Missing these causes 401 errors** because NextAuth can't properly authenticate

## Additional Fix for "Credentials Callback Not Supported" Error:

If you get "Callback for provider type credentials not supported" error:

1. **The auth configuration has been updated** with proper credentials provider ID
2. **JWT configuration added** for better production support
3. **Event logging added** for debugging

## Vercel-Specific Requirements:

- Make sure your **build command** is: `npm run build`
- Ensure **Node.js version** is 18.x or higher
- **Environment variables** must be set before deployment

## Verification:

After setting these variables and redeploying:
1. Try logging in with `admin@unijos.edu` / `admin123`
2. Check Vercel function logs for any remaining errors
3. The authentication should work exactly like locally

## Common Issues:

- Make sure `NEXTAUTH_URL` matches your exact Vercel domain
- Ensure `DATABASE_URL` is the same as your local one
- Redeploy after adding environment variables
