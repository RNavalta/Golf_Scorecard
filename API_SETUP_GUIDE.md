# Golf Course API Setup Guide

## 🎯 For Most Accurate Golf Course Data

### Option 1: Google Places API (Recommended)
**Cost**: $200 free credit monthly (covers ~40,000 requests)
**Accuracy**: ⭐⭐⭐⭐⭐ (Excellent - Real data with ratings, reviews, contact info)

#### Setup Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API**
4. Create credentials (API Key)
5. Restrict the API key to:
   - Places API
   - Your app bundle/domain
6. Copy your API key
7. In `golfApi.js`, replace:
   ```javascript
   const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
   ```
   with:
   ```javascript
   const GOOGLE_API_KEY = 'your_actual_api_key_here';
   ```

#### What You Get:
- ✅ Real golf course names and locations
- ✅ Accurate addresses and phone numbers
- ✅ Real user ratings and reviews  
- ✅ Website links and operating hours
- ✅ Price level indicators
- ✅ Estimated par and yardage from reviews

---

### Option 2: Free OpenStreetMap (Current)
**Cost**: 100% Free
**Accuracy**: ⭐⭐⭐ (Good - Real locations, estimated details)

#### Current Setup:
- Already working in your app
- Uses real golf course locations from OpenStreetMap
- Estimates course details based on course names/type
- Falls back to accurate demo courses

#### What You Get:
- ✅ Real golf course locations worldwide
- ✅ Basic contact information (when available)
- ⚠️ Estimated par, yardage, and ratings
- ✅ Works in Canada, US, Europe, and worldwide

---

## 🔧 Current App Status

### ✅ What's Working Now:
- Real golf course locations from OpenStreetMap
- Accurate demo courses for testing:
  - **Canada**: Banff Springs, Whistler, Glen Abbey
  - **USA**: Pebble Beach, Torrey Pines, Bethpage Black
  - **Europe**: St Andrews, Royal County Down
- Smart regional detection
- Distance-based sorting
- Professional course details with realistic layouts

### 🚀 What Improves with Google API:
- Real user ratings (instead of estimated)
- Real contact information and websites
- Actual operating hours and price levels
- User reviews with course insights
- More accurate par/yardage from review analysis

---

## 💡 Recommendation

**For Development/Testing**: Current OpenStreetMap setup works great!

**For Production**: Add Google Places API for the most accurate and professional experience.

The app will automatically use Google Places API if you add the API key, otherwise it falls back to the current free system.
