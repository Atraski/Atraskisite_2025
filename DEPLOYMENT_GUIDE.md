# Deployment Guide - Atraski Site

Yeh guide hosting ke liye zaroori steps aur environment variables ke baare mein hai.

## 🚀 Quick Setup

### 1. Backend Deployment

#### Required Environment Variables:

Backend mein `.env` file banao with yeh variables:

```env
# MongoDB Connection (Important!)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atraski

# Server Port (hosting platform automatically set karega, but default)
PORT=5000
NODE_ENV=production

# JWT Secret (IMPORTANT: Strong random string use karo)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# CORS Origins (comma-separated)
CORS_ORIGINS=https://atraski.com,https://www.atraski.com,https://your-frontend-url.com

# Head User Seed (optional, only if you want to auto-create)
SEED_HEAD_EMAIL=head@atraski.in
SEED_HEAD_PASSWORD=ChangeMe#Head

# Access Token TTL (optional)
ACCESS_TOKEN_TTL=30m
```

#### Common Hosting Issues:

1. **MongoDB Connection Error**
   - Ensure `MONGODB_URI` sahi hai
   - MongoDB Atlas mein IP whitelist karo (0.0.0.0/0 for all, ya specific IPs)
   - Database user permissions check karo

2. **Port Error**
   - Most hosting platforms automatically `PORT` environment variable set karte hain
   - Ensure server.js mein `process.env.PORT` use ho raha hai (already done)

3. **CORS Errors** ⚠️ COMMON ISSUE
   - Frontend URL ko `CORS_ORIGINS` mein add karo
   - Multiple origins ke liye comma-separated list use karo
   - **Important:** Trailing slashes automatically handle ho jayengi
   - Backend logs mein CORS requests dikhenge - check karo ki origin match kar raha hai
   - Example: `CORS_ORIGINS=https://atraski.com,https://www.atraski.com`
   - Agar error aa raha hai, backend logs check karo - wahan exact origin dikhega

### 2. Frontend Deployment

#### Required Environment Variables:

Frontend mein `.env` file banao (root folder mein):

```env
# Backend API URL
VITE_API_BASE=https://your-backend-url.ondigitalocean.app/
```

**Note:** Vite ke liye environment variables `VITE_` prefix se start hone chahiye.

#### Build Command:
```bash
cd frontend
npm install
npm run build
```

Build files `frontend/dist` folder mein generate honge. Ye files hosting platform pe deploy karo.

### 3. Admin Panel Deployment

#### Required Environment Variables:

Admin folder mein `.env` file banao:

```env
# Backend API URL  
REACT_APP_API_BASE=https://your-backend-url.ondigitalocean.app/
```

**Note:** React (Create React App) ke liye environment variables `REACT_APP_` prefix se start hone chahiye.

#### Build Command:
```bash
cd admin
npm install
npm run build
```

Build files `admin/build` folder mein generate honge.

## 🔧 Common Hosting Platforms

### Digital Ocean / Railway / Render

1. **Backend:**
   - Repository connect karo
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables add karo (upar dekh sakte ho)

2. **Frontend:**
   - Repository connect karo
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Output directory: `dist`
   - Environment variables add karo

3. **Admin:**
   - Repository connect karo
   - Root directory: `admin`
   - Build command: `npm install && npm run build`
   - Output directory: `build`
   - Environment variables add karo

### Vercel / Netlify

1. **Frontend:**
   - Vite project ke liye Vercel automatically detect kar leta hai
   - Root directory: `frontend` set karo
   - Environment variables add karo
   - Build command automatically set ho jayega

2. **Backend:**
   - Serverless functions ya separate Node.js deployment use karo
   - Root directory: `backend`
   - Build/Start commands set karo

## ⚠️ Important Notes

1. **Never commit `.env` files** - Always use `.env.example` as template
2. **JWT_SECRET** production mein strong random string honi chahiye
3. **MongoDB URI** mein credentials check karo
4. **CORS Origins** mein sahi frontend URLs honi chahiye
5. **API URLs** frontend aur admin mein backend URL se match hone chahiye

## 🐛 Troubleshooting

### Backend se connection nahi ho raha?
- Backend URL check karo (frontend/admin .env mein)
- CORS_ORIGINS check karo (backend .env mein)
- Network tab mein actual error check karo
- **CORS Error specifically:**
  - Backend server logs check karo - wahan exact origin dikhega
  - `CORS_ORIGINS` environment variable mein exact frontend URL add karo
  - Example: Agar frontend `https://atraski.com` se chal raha hai, to `CORS_ORIGINS=https://atraski.com,https://www.atraski.com`
  - Backend restart karo after environment variable change
  - Browser console mein exact origin check karo (Network tab → Request Headers → Origin)

### MongoDB connection fail?
- `MONGODB_URI` check karo
- MongoDB Atlas mein IP whitelist check karo
- Database credentials verify karo

### Port already in use?
- Hosting platform automatically PORT set kar deta hai
- Agar local test kar rahe ho, different port use karo

### Environment variables kaam nahi kar rahe?
- Vite ke liye `VITE_` prefix zaroori hai
- React ke liye `REACT_APP_` prefix zaroori hai
- Build ke baad environment variables change karo to rebuild karna padega

## 📝 Checklist Before Deployment

- [ ] Backend `.env` file bana aur saare variables set kiye
- [ ] Frontend `.env` file bana aur `VITE_API_BASE` set kiya
- [ ] Admin `.env` file bana aur `REACT_APP_API_BASE` set kiya
- [ ] MongoDB connection test kiya
- [ ] CORS origins sahi set kiye
- [ ] JWT_SECRET strong random string hai
- [ ] All builds successful hain
- [ ] Tested locally before deploying

## 🆘 Need Help?

Agar koi specific error aa raha hai, toh:
1. Error message share karo
2. Console logs check karo
3. Network tab mein API calls check karo
4. Environment variables verify karo
