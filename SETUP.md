# Leads Master - Setup Guide

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/leads-master

# Admin Key for accessing leads (change this to a secure random string)
ADMIN_KEY=your-secure-admin-key-here

# Optional: API Base URL (leave empty for same-origin requests)
NEXT_PUBLIC_API_URL=
```

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the MONGO_URI in your .env.local file

3. **Generate a secure admin key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and set it as your ADMIN_KEY

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Main form: http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Features

- ✅ Lead collection form with validation
- ✅ MongoDB storage with Mongoose models
- ✅ Admin panel with lead management
- ✅ Excel export functionality
- ✅ Copy to clipboard features
- ✅ Responsive design
- ✅ Honeypot spam protection
- ✅ CORS support for embedded forms

## API Endpoints

- `POST /api/leads` - Create a new lead
- `GET /api/leads` - Get all leads (requires admin key)
- `OPTIONS /api/leads` - CORS preflight

## Security Features

- Admin key authentication for lead access
- Input validation and sanitization
- Honeypot field for bot protection
- CORS headers for cross-origin requests
