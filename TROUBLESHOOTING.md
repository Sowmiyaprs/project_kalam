# 🔧 Troubleshooting Guide

## Can't Implement the Test? Let's Fix It!

### Tell me which step is failing:

## 🚫 Problem 1: Can't Access the App

### Symptom: Browser shows "Can't reach this site" or "Connection refused"

**Solution**:
1. Check if server is running:
   ```bash
   # Look for this in your terminal:
   ➜  Local:   http://localhost:3000/
   ```

2. If not running, start it:
   ```bash
   npm run dev
   ```

3. If port 3000 is busy, try:
   ```bash
   # Kill the process using port 3000
   npx kill-port 3000
   # Then restart
   npm run dev
   ```

4. Try different port:
   - Edit `vite.config.js` and change port to 3001
   - Or use: `npm run dev -- --port 3001`

---

## 🚫 Problem 2: Page Loads But Shows Errors

### Symptom: White screen or error messages

**Check Browser Console**:
1. Press `F12` to open DevTools
2. Click "Console" tab
3. Look for RED error messages

**Common Errors & Fixes**:

#### Error: "Cannot read properties of undefined (reading 'profile')"
**Fix**: You're trying to access profile before it loads
- Navigate to `/home` first
- Then go to other pages

#### Error: "useProfile must be used within ProfileProvider"
**Fix**: Component not wrapped in provider
- This shouldn't happen with our setup
- Try refreshing the page

#### Error: "Failed to fetch"
**Fix**: Network issue
- Check internet connection
- Disable ad blockers
- Try incognito mode

---

## 🚫 Problem 3: Analysis Not Working

### Symptom: Click "Analyze" but nothing happens

**Checklist**:
1. Did you type text in the input box?
2. Is the text at least 3 words long?
3. Check console for errors (F12)

**Try This**:
1. Clear the input
2. Type exactly: `I feel stressed`
3. Click Analyze
4. Wait 1-2 seconds

**Still Not Working?**
- Check if `AdvancedSentimentEngine.js` exists in `src/services/sentiment/`
- Check console for import errors

---

## 🚫 Problem 4: Metrics Still Show 50%

### Symptom: Stress/Motivation/Confidence always 50%

**This means the old sentiment engine is still running**

**Fix**:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache:
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"
3. Restart the dev server:
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

**Test with these exact phrases**:
- "I am very stressed and anxious" → Should show HIGH stress (70%+)
- "I feel extremely happy" → Should show LOW stress (20%-)
- "I'm so tired" → Should show LOW motivation (30%-)

**If still 50%**:
- Check if `src/hooks/useAnalysis.js` imports `AdvancedSentimentEngine`
- Look for this line: `import advancedSentimentEngine from '../services/sentiment/AdvancedSentimentEngine.js';`

---

## 🚫 Problem 5: Profile Changes Don't Save

### Symptom: Change name, refresh, old name returns

**Check localStorage**:
1. Press `F12`
2. Go to "Application" tab
3. Expand "Local Storage" → Click your localhost
4. Look for `mindmirror_user_profile`

**If key exists but data doesn't persist**:
- Browser might be in private/incognito mode
- localStorage might be disabled
- Try different browser

**If key doesn't exist**:
- ProfileContext not initialized
- Check console for errors
- Try clicking "Save Changes" again

**Manual Test**:
```javascript
// Paste in browser console (F12):
localStorage.setItem('test', 'hello');
console.log(localStorage.getItem('test'));
// Should print: hello
```

If this fails, localStorage is blocked.

---

## 🚫 Problem 6: Dashboard Shows No Data

### Symptom: Charts are empty, "No data available"

**This is normal if**:
- You haven't done any analyses yet
- You just started using the app

**Solution**:
1. Go to Analysis page (`/analysis`)
2. Do 3-5 analyses with different moods:
   - "I feel stressed"
   - "I'm happy and confident"
   - "I'm tired"
   - "I feel anxious"
   - "I'm excited"
3. Go back to Dashboard
4. Charts should now show data

**If still empty after analyses**:
- Check console for errors
- Check localStorage for `mindmirror_analyses` key
- Try refreshing the page

---

## 🚫 Problem 7: Imports/Module Errors

### Symptom: "Failed to resolve import" or "Module not found"

**Common causes**:
1. File doesn't exist
2. Wrong file path
3. Missing `.jsx` or `.js` extension

**Check**:
```bash
# List files to verify they exist
ls src/services/sentiment/
ls src/contexts/
ls src/hooks/
```

**Should see**:
- `AdvancedSentimentEngine.js`
- `ProfileContext.jsx`
- `useAnalysis.js`

**If files are missing**:
- They weren't created properly
- Check if you're in the right directory
- Re-create the missing files

---

## 🚫 Problem 8: Styling Issues

### Symptom: App looks broken, no colors, weird layout

**Possible causes**:
1. Tailwind CSS not loading
2. CSS file missing
3. Browser cache

**Fix**:
1. Check if `src/styles/index.css` exists
2. Hard refresh: `Ctrl + Shift + R`
3. Restart dev server
4. Check console for CSS errors

---

## 🚫 Problem 9: Navigation Not Working

### Symptom: Click links but page doesn't change

**Check**:
1. Are you using the correct URLs?
   - `/home` ✅
   - `/dashboard` ✅
   - `/analysis` ✅
   - `/profile` ✅
   - `/login` ✅

2. Check browser console for routing errors

3. Try typing URL directly:
   - `http://localhost:3000/dashboard`

**If still not working**:
- React Router might not be set up correctly
- Check `src/App.jsx` for route definitions

---

## 🚫 Problem 10: Slow Performance

### Symptom: App is laggy, animations stuttering

**Solutions**:
1. Close other browser tabs
2. Disable browser extensions
3. Check CPU usage
4. Try different browser
5. Reduce motion in profile settings

---

## 🔍 Diagnostic Commands

### Check if files exist:
```bash
# Check sentiment engine
ls src/services/sentiment/AdvancedSentimentEngine.js

# Check profile context
ls src/contexts/ProfileContext.jsx

# Check storage service
ls src/services/storage/EnhancedStorageService.js
```

### Check localStorage in browser:
```javascript
// Paste in console (F12):
console.log('Profile:', localStorage.getItem('mindmirror_user_profile'));
console.log('Entries:', localStorage.getItem('mindmirror_entries'));
console.log('Analyses:', localStorage.getItem('mindmirror_analyses'));
```

### Clear all data and start fresh:
```javascript
// Paste in console (F12):
localStorage.clear();
location.reload();
```

---

## 📋 Quick Diagnostic Checklist

Run through this checklist:

- [ ] Server is running (`npm run dev`)
- [ ] Can access http://localhost:3000/
- [ ] No red errors in browser console (F12)
- [ ] Can navigate between pages
- [ ] Can type in analysis input
- [ ] "Analyze" button is clickable
- [ ] localStorage is enabled (test with manual command)
- [ ] Browser is up to date
- [ ] No ad blockers interfering

---

## 🆘 Still Stuck?

### Share This Information:

1. **What step are you on?**
   - "Step 2 of Quick Start"
   - "Testing sentiment analysis"
   - etc.

2. **What happens when you try?**
   - "Nothing happens"
   - "I see an error"
   - "Page is blank"

3. **Any error messages?**
   - Copy from browser console (F12)
   - Copy from terminal

4. **What do you see?**
   - Screenshot if possible
   - Describe what's on screen

5. **What did you expect?**
   - "Stress should be high"
   - "Profile should save"
   - etc.

### Example Good Report:
```
Problem: Sentiment analysis not working
Step: Quick Start Step 2
What I did: Typed "I feel stressed" and clicked Analyze
What happened: Nothing, no results shown
Expected: Should show stress metrics
Console error: [paste error here]
```

---

## 🎯 Most Common Issues (90% of problems)

1. **Browser cache** → Hard refresh (`Ctrl + Shift + R`)
2. **Server not running** → Run `npm run dev`
3. **Wrong URL** → Use `http://localhost:3000/`
4. **localStorage disabled** → Enable in browser settings
5. **Old code cached** → Clear cache and restart server

---

**Try these first before anything else!** ☝️
