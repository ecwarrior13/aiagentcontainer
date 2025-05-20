export const publicRoutes = [
    '/',                    // Landing page
    '/sign-in',            // Sign in page
    '/sign-up',            // Sign up page
    '/auth',               // Auth related pages
    '/reset-password',     // Password reset
    '/forgot-password',    // Forgot password
]

// List of protected routes that require authentication
export const protectedRoutes = [
    '/dashboard',          // Dashboard
    '/account',            // Account management
    '/settings',           // User settings
    '/profile',             // User profile
    '/agent',              // Agent page
    '/agent/:id',          // Agent page with id
    '/interview',          // Interview page
    '/interview/:id',      // Interview page with id
]
