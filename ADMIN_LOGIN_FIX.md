# Admin Login Issue - Fix Guide

## 🔍 Problem
Admin login credentials kaam nahi kar rahe production mein, jabki same credentials seed kiye the.

## 🎯 Possible Causes

1. **`isActive` field false hai** - Production mein `isActive: true` required hai
2. **Password hash mismatch** - Password hash sahi nahi hai database mein
3. **Email case issue** - Email exact match nahi kar raha

## ✅ Kya Fix Kiya

### 1. Improved Login Route (`backend/routes/auth.route.js`)
- Better error messages
- Clear logging for debugging
- Specific error if user is inactive in production

### 2. Improved Seed Logic (`backend/server.js`)
- Automatically ensures Head user is `isActive: true` on server start
- Won't reset password automatically (safety)

### 3. Diagnostic Scripts Created

#### `backend/scripts/checkUser.js`
User status check karne ke liye:
```bash
cd backend
npm run check-user [email] [password]
# Example:
npm run check-user head@atraski.in ChangeMe#Head
```

#### `backend/scripts/resetHeadPassword.js`
Head user ka password reset karne ke liye:
```bash
cd backend
npm run reset-head [new-password]
# Example:
npm run reset-head ChangeMe#Head
```

## 🚀 How to Fix (Production Server)

### Option 1: Server Restart (Recommended)
1. Backend server restart karo
2. Server start hote hi automatically Head user ko `isActive: true` kar dega
3. Agar password issue hai, to Option 2 use karo

### Option 2: Manual Reset Script
Production server par SSH karke:

```bash
cd backend
npm run reset-head ChangeMe#Head
```

Yeh script:
- User ko `isActive: true` kar dega
- Password reset kar dega
- Login credentials print karega

### Option 3: Check User Status
Pehle check karo ki user kya status hai:

```bash
cd backend
npm run check-user head@atraski.in ChangeMe#Head
```

Yeh dikhayega:
- User exists ya nahi
- `isActive` status
- Password match ho raha hai ya nahi
- Login kar sakta hai ya nahi

## 📋 Default Credentials

Agar `.env` mein `SEED_HEAD_EMAIL` aur `SEED_HEAD_PASSWORD` set nahi hai:

- **Email:** `head@atraski.in`
- **Password:** `ChangeMe#Head`

## 🔧 Environment Variables

Backend `.env` file mein yeh optional variables set kar sakte ho:

```env
SEED_HEAD_EMAIL=head@atraski.in
SEED_HEAD_PASSWORD=ChangeMe#Head
```

## 🐛 Debugging

### Backend Logs Check Karo
Login attempt ke time backend logs mein yeh dikhega:

```
[LOGIN] email: head@atraski.in
[LOGIN] userFound? true
[LOGIN] User found: { email: 'head@atraski.in', isActive: true, role: 'Head' }
[LOGIN passwordMatch?] true/false
```

### Common Issues:

1. **"Invalid credentials"** 
   - Check: `isActive` true hai?
   - Check: Password hash match kar raha hai?
   - Solution: `npm run reset-head` run karo

2. **"Account is inactive"**
   - Check: User `isActive: false` hai
   - Solution: Server restart karo (auto-fix) ya manually `isActive: true` karo

3. **User not found**
   - Check: Email exact match kar raha hai?
   - Solution: `npm run seed-head` run karo

## ✅ Testing

1. Backend restart karo
2. Admin panel se login try karo
3. Agar nahi ho raha, to `npm run check-user` se diagnose karo
4. Agar password issue hai, to `npm run reset-head` se reset karo

## 📝 Notes

- Production mein `NODE_ENV=production` set hona chahiye
- `isActive: true` required hai production mein login ke liye
- Password must meet requirements: 8+ chars, upper/lower/number/symbol
- All email comparisons are case-insensitive (lowercase)


