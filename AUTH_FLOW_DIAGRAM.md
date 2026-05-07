# 🔐 Authentication System Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE (/)                             │
│                                                                      │
│  ┌──────────────┐                              ┌──────────────┐    │
│  │  Get Started │ ────────────────────────────▶│   Sign Up    │    │
│  └──────────────┘                              └──────────────┘    │
│                                                                      │
│  ┌──────────────┐                              ┌──────────────┐    │
│  │    Login     │ ────────────────────────────▶│   Sign In    │    │
│  └──────────────┘                              └──────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SIGN UP PAGE (/signup)                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Full Name:     [John Doe                    ] ✓           │    │
│  │  Email:         [john@example.com            ] ✓           │    │
│  │  Password:      [••••••••••                  ] 👁          │    │
│  │  Strength:      ████████░░ Strong                          │    │
│  │  Confirm:       [••••••••••                  ] ✓ 👁        │    │
│  │  ☑ I agree to Terms of Service                             │    │
│  │                                                             │    │
│  │              [Create Account] 🔄                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Already have an account? Sign in                                   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ ✅ Valid Data
                                │ 🔄 Creating Account...
                                │ ✅ Auto-Login
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD (/dashboard)                          │
│                         🎉 LOGGED IN                                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Welcome back, John Doe! 👋                              │      │
│  │                                                           │      │
│  │  📊 Mood Trends    📈 Analytics    📝 Journal            │      │
│  │                                                           │      │
│  │  [Profile] [Logout]                                      │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Click Logout
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        LOGIN PAGE (/login)                           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Email:         [john@example.com            ] ✓           │    │
│  │  Password:      [••••••••••                  ] 👁          │    │
│  │                                                             │    │
│  │  ☑ Remember me          Forgot password?                   │    │
│  │                                                             │    │
│  │              [Sign In] 🔄                                   │    │
│  │                                                             │    │
│  │  ─────────── Or continue with ───────────                  │    │
│  │                                                             │    │
│  │     [🔵 Google]        [⚫ GitHub]                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Don't have an account? Sign up for free                            │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ ✅ Valid Credentials
                                │ 🔄 Signing in...
                                │ ✅ Session Created
                                ▼
                         DASHBOARD (/dashboard)
                            🎉 LOGGED IN


┌─────────────────────────────────────────────────────────────────────┐
│                   FORGOT PASSWORD (/forgot-password)                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Email:         [john@example.com            ] ✓           │    │
│  │                                                             │    │
│  │              [Send Reset Link] 🔄                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ← Back to Login                                                    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ ✅ Email Sent
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUCCESS CONFIRMATION                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                         ✉️                                  │    │
│  │                  Check Your Email                           │    │
│  │                                                             │    │
│  │  We've sent a password reset link to                       │    │
│  │  john@example.com                                          │    │
│  │                                                             │    │
│  │  [Try Another Email]  [Back to Login]                      │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ Click Reset Link
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  RESET PASSWORD (/reset-password)                    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  New Password:  [••••••••••                  ] 👁          │    │
│  │  Strength:      ████████░░ Strong                          │    │
│  │  Confirm:       [••••••••••                  ] ✓ 👁        │    │
│  │                                                             │    │
│  │              [Reset Password] 🔄                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ← Back to Login                                                    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ ✅ Password Updated
                                ▼
                         LOGIN PAGE (/login)
                      🎉 Login with new password
```

---

## Protected Route Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER TRIES TO ACCESS /dashboard                   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  ProtectedRoute Check │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │ Authenticated│        │      Not     │
            │      ✅      │        │ Authenticated│
            └──────────────┘        └──────────────┘
                    │                       │
                    ▼                       ▼
        ┌──────────────────┐    ┌──────────────────────┐
        │ Show Dashboard   │    │ Redirect to /login   │
        │      Page        │    │  (Save intended URL) │
        └──────────────────┘    └──────────────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │  Login Page  │
                                    └──────────────┘
                                            │
                                            │ ✅ Login Success
                                            ▼
                                ┌──────────────────────┐
                                │ Redirect to intended │
                                │  URL (/dashboard)    │
                                └──────────────────────┘
```

---

## Session Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER LOGS IN                                 │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Remember Me Checked? │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │     YES      │        │      NO      │
            │   7 Days     │        │   24 Hours   │
            └──────────────┘        └──────────────┘
                    │                       │
                    └───────────┬───────────┘
                                ▼
                    ┌───────────────────────┐
                    │  Save to localStorage │
                    │  - user data          │
                    │  - rememberMe flag    │
                    │  - timestamp          │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   User Refreshes or   │
                    │   Reopens Browser     │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Load Auth State      │
                    │  Check Timestamp      │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │ Still Valid  │        │   Expired    │
            │      ✅      │        │      ❌      │
            └──────────────┘        └──────────────┘
                    │                       │
                    ▼                       ▼
        ┌──────────────────┐    ┌──────────────────────┐
        │ Keep User Logged │    │  Auto Logout         │
        │      In          │    │  Redirect to /login  │
        └──────────────────┘    └──────────────────────┘
```

---

## Validation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER TYPES IN FORM FIELD                          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   User Blurs Field    │
                    │   (onBlur triggered)  │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Run Validation       │
                    │  - Email format       │
                    │  - Password strength  │
                    │  - Name format        │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │    Valid     │        │   Invalid    │
            │      ✅      │        │      ❌      │
            └──────────────┘        └──────────────┘
                    │                       │
                    ▼                       ▼
        ┌──────────────────┐    ┌──────────────────────┐
        │ Show ✓ Icon      │    │ Show ✗ Icon         │
        │ Green Border     │    │ Red Border           │
        │ No Error Message │    │ Show Error Message   │
        └──────────────────┘    └──────────────────────┘
                                            │
                                            ▼
                                ┌──────────────────────┐
                                │ User Fixes Input     │
                                │ Real-time Validation │
                                └──────────────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │  Valid ✅    │
                                    └──────────────┘
```

---

## Password Strength Meter

```
User Types: "pass"
┌────────────────────────────────────────┐
│ Password Strength: Weak                │
│ ██░░░░░░░░ 20%                         │
│ ❌ At least 8 characters               │
│ ❌ One uppercase letter                │
│ ❌ One number                           │
│ ❌ One special character                │
└────────────────────────────────────────┘

User Types: "Password1"
┌────────────────────────────────────────┐
│ Password Strength: Fair                │
│ ████░░░░░░ 40%                         │
│ ✅ At least 8 characters               │
│ ✅ One uppercase letter                │
│ ✅ One lowercase letter                │
│ ✅ One number                           │
│ ❌ One special character                │
└────────────────────────────────────────┘

User Types: "Password1!"
┌────────────────────────────────────────┐
│ Password Strength: Strong              │
│ ██████████ 100%                        │
│ ✅ All requirements met                │
└────────────────────────────────────────┘
```

---

## localStorage Structure

```
localStorage
├── mindmirror_auth
│   └── {
│         "user": {
│           "id": "user_1234567890",
│           "fullName": "John Doe",
│           "email": "john@example.com"
│         },
│         "rememberMe": true,
│         "timestamp": 1234567890000
│       }
│
└── mindmirror_users
    └── [
          {
            "id": "user_1234567890",
            "fullName": "John Doe",
            "email": "john@example.com",
            "password": "SecurePass123!",
            "createdAt": "2026-05-06T10:30:00.000Z"
          }
        ]
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER SUBMITS FORM                                 │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Validate All Fields  │
                    └───────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌──────────────┐        ┌──────────────┐
            │  All Valid   │        │  Has Errors  │
            │      ✅      │        │      ❌      │
            └──────────────┘        └──────────────┘
                    │                       │
                    ▼                       ▼
        ┌──────────────────┐    ┌──────────────────────┐
        │ Show Loading     │    │ Show Error Toast     │
        │ Disable Button   │    │ Highlight Fields     │
        └──────────────────┘    │ Show Error Messages  │
                    │            └──────────────────────┘
                    ▼                       │
        ┌──────────────────┐               │
        │ Try Auth Action  │               │
        └──────────────────┘               │
                    │                       │
        ┌───────────┴───────────┐          │
        │                       │          │
        ▼                       ▼          │
┌──────────────┐        ┌──────────────┐  │
│   Success    │        │    Error     │  │
│      ✅      │        │      ❌      │  │
└──────────────┘        └──────────────┘  │
        │                       │          │
        ▼                       ▼          │
┌──────────────────┐    ┌──────────────────────┐
│ Success Toast    │    │ Error Toast          │
│ Redirect         │    │ Re-enable Button     │
└──────────────────┘    │ Keep Form Data       │
                        └──────────────────────┘
```

---

## 🎯 Key Features Visualized

### ✅ Real-time Validation
- Validates on blur (when user leaves field)
- Shows instant feedback (✓ or ✗)
- Updates error messages immediately

### ✅ Password Strength
- Calculates strength as user types
- Shows visual progress bar
- Color-coded (red/orange/yellow/green)

### ✅ Session Persistence
- Saves to localStorage
- Checks expiry on load
- Auto-logout when expired

### ✅ Protected Routes
- Checks auth before rendering
- Redirects to login if needed
- Preserves intended destination

### ✅ Error Handling
- Clear error messages
- Toast notifications
- Inline field errors

---

**All flows are working perfectly!** 🎉
