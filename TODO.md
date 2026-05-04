# Online Bank App - API Routing Fix TODO

## Current Status
✅ Backend mappings correct: POST /register, /login (no /api prefix needed)  
✅ Frontend calls correct: apiClient.post(\"/register\"), \"/login\" (no /api prefix)  
✅ Production baseURL correct  
❌ Production error: \"No mapping for POST /api/register\" → Stale build/cache/proxy issue  

## Step-by-Step Fix Plan (Production Ready)

### Step 1: [PENDING] Verify Current Local Behavior
```
# Backend (in /Backend)
mvn spring-boot:run
# Test endpoints
curl -X POST http://localhost:8080/register -H \"Content-Type: application/json\" -d '{\"first_name\":\"test\"}' # Ignore param error, check mapping exists
curl -X POST http://localhost:8080/login -H \"Content-Type: application/json\" -d '{\"email\":\"test\",\"password\":\"test\"}'
```
Expected: 200/400 responses (no \"No mapping\")

### Step 2: [PENDING] Frontend Local Test
```
cd Frontend/demo-bank-redux
npm start
```
Test register/login → Network tab shows calls to `http://localhost:3000/register`? No - to backend proxy or direct.
Update package.json proxy if needed: `"proxy": "http://localhost:8080"`

### Step 3: [PENDING] Clear & Rebuild Frontend (Fix Stale /api)
```
cd Frontend/demo-bank-redux
rm -rf node_modules package-lock.json build/
npm install
npm run build
```
Check `build/static/js/*.js` - search for \"api/register\" (should be 0)

### Step 4: [PENDING] Backend Clean Build
```
cd Backend
mvn clean package -DskipTests
```

### Step 5: [PENDING] Deploy with Cache Bust
**Frontend (Vercel):**
```
vercel --prod --force
# Or git push → auto-deploy with cache clear
```

**Backend (Render):**
```
# Redeploy via Render dashboard (Clear build cache)
# Or git push to trigger
```

### Step 6: [PENDING] Production Test
```
curl -X POST https://nova-bank-4ge0.onrender.com/register -H \"Content-Type: application/json\" -d '{...}'
```
Browser: Open incognito → Test register/login → Check Network tab for exact URLs called.

### Step 7: [COMPLETED] Monitor Logs
- Render backend logs for incoming requests
- Vercel functions/logs for frontend

## Quick Debug Commands
```
# Check if /api exists in frontend build
grep -r \"api/register\" Frontend/demo-bank-redux/build/ || echo \"Clean\"

# Backend endpoints list (local)
curl http://localhost:8080/actuator/mappings | grep register
```

## Completion Criteria
- [ ] Local register/login works  
- [ ] Production register/login works (no \"No mapping\")  
- [ ] Network tab shows POST /register (NO /api prefix)  
- [ ] All dashboard/payment/transaction endpoints work  

**Next: Run Step 1 commands via tools.**


