# 📱 Mobile App Deployment Guide

This guide will help you deploy the Cleaning Rota app to both iOS App Store and Google Play Store.

## Prerequisites

### For iOS Development
- **Mac computer** (required for iOS development)
- **Xcode** (latest version from Mac App Store)
- **Apple Developer Account** ($99/year)
- **CocoaPods** (install with: `sudo gem install cocoapods`)

### For Android Development
- **Android Studio** (download from android.com/studio)
- **Java Development Kit (JDK)** 11 or higher
- **Google Play Developer Account** ($25 one-time fee)

---

## 🚀 Quick Start Commands

```bash
# Build and sync web assets to native platforms
npm run cap:sync

# Open in Xcode (iOS) - Mac only
npm run cap:ios

# Open in Android Studio
npm run cap:android

# Run on connected iOS device - Mac only
npm run cap:run:ios

# Run on connected Android device/emulator
npm run cap:run:android
```

---

## 📱 iOS Deployment

### Step 1: Install CocoaPods (if not already installed)
```bash
sudo gem install cocoapods
cd ios/App
pod install
cd ../..
```

### Step 2: Configure App in Xcode

1. **Open the project:**
   ```bash
   npm run cap:ios
   ```

2. **In Xcode, configure:**
   - **Bundle Identifier**: Change `com.cleaningrota.app` to your unique identifier (e.g., `com.yourcompany.cleaningrota`)
   - **Team**: Select your Apple Developer Team
   - **Version**: Set to `1.0.0`
   - **Build**: Set to `1`

3. **Configure Signing:**
   - Go to "Signing & Capabilities"
   - Enable "Automatically manage signing"
   - Select your development team

### Step 3: Add App Icons

1. Prepare app icons in these sizes:
   - 1024x1024 (App Store)
   - 180x180, 120x120, 87x87 (iPhone)
   - 167x167, 152x152 (iPad)

2. In Xcode:
   - Navigate to `App > Assets.xcassets > AppIcon`
   - Drag and drop your icons into the appropriate slots

### Step 4: Test on Device

1. Connect your iPhone
2. Select your device in Xcode
3. Click "Run" (▶️) or `npm run cap:run:ios`

### Step 5: Build for Release

1. **Archive the app:**
   - Product → Archive (in Xcode)
   - Wait for the archive to complete

2. **Upload to App Store:**
   - Window → Organizer → Archives
   - Select your archive
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow the prompts to upload

3. **Submit for Review:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Complete app information (screenshots, description, etc.)
   - Submit for review

---

## 🤖 Android Deployment

### Step 1: Configure App in Android Studio

1. **Open the project:**
   ```bash
   npm run cap:android
   ```

2. **Update app configuration:**
   - Open `android/app/build.gradle`
   - Update `applicationId` to your unique package name
   - Update `versionCode` and `versionName`

3. **Change app name (optional):**
   - Edit `android/app/src/main/res/values/strings.xml`
   - Update `<string name="app_name">Cleaning Rota</string>`

### Step 2: Create App Icons

1. **Use Android Studio's Asset Studio:**
   - Right-click `res` → New → Image Asset
   - Select "Launcher Icons"
   - Upload your icon (512x512 PNG recommended)
   - Generate icons for all densities

### Step 3: Generate Signing Key

```bash
# Generate a keystore (one-time setup)
keytool -genkey -v -keystore cleaning-rota.keystore -alias cleaningrota -keyalg RSA -keysize 2048 -validity 10000

# Follow prompts to create password and enter your information
```

**IMPORTANT:** Store this keystore file and passwords securely! You'll need them for all future updates.

### Step 4: Configure Signing

1. **Create `android/key.properties`:**
   ```properties
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=cleaningrota
   storeFile=../cleaning-rota.keystore
   ```

2. **Update `android/app/build.gradle`:**

   Add before `android {`:
   ```gradle
   def keystorePropertiesFile = rootProject.file("key.properties")
   def keystoreProperties = new Properties()
   if (keystorePropertiesFile.exists()) {
       keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
   }
   ```

   Add inside `android { ... }`:
   ```gradle
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile file(keystoreProperties['storeFile'])
           storePassword keystoreProperties['storePassword']
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           minifyEnabled false
           proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
       }
   }
   ```

### Step 5: Build Release APK/AAB

```bash
cd android
./gradlew assembleRelease  # For APK
./gradlew bundleRelease    # For AAB (recommended for Play Store)
```

Your signed AAB will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

### Step 6: Upload to Google Play Console

1. **Create app in Play Console:**
   - Go to [Google Play Console](https://play.google.com/console)
   - Click "Create app"
   - Fill in app details

2. **Upload AAB:**
   - Go to "Production" → "Create new release"
   - Upload `app-release.aab`
   - Add release notes

3. **Complete Store Listing:**
   - App name, description, screenshots
   - Content rating
   - Privacy policy (required!)

4. **Submit for Review:**
   - Click "Submit for review"
   - Wait for approval (usually 1-3 days)

---

## 📸 Required Assets

### Screenshots (both platforms)
- **iPhone:** 6.7" display (1290x2796) and 5.5" display (1242x2208)
- **iPad:** 12.9" display (2048x2732)
- **Android:** At least 2 screenshots (phone and tablet recommended)

### App Icon
- **iOS:** 1024x1024 PNG (no transparency, no rounded corners)
- **Android:** 512x512 PNG (transparency OK, will be rounded automatically)

---

## 🔑 Important Configuration Changes

### Update App ID (Important!)

Before publishing, change the app ID in `capacitor.config.ts`:

```typescript
appId: 'com.yourcompany.cleaningrota',  // Change this!
```

Then sync:
```bash
npm run cap:sync
```

### Update App Name

**iOS:** In Xcode, select the project → General → Display Name

**Android:** Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

---

## 🐛 Troubleshooting

### iOS Build Errors
- **CocoaPods issues:** Run `cd ios/App && pod install --repo-update`
- **Signing errors:** Check your Apple Developer account status
- **Archive fails:** Clean build folder (Product → Clean Build Folder)

### Android Build Errors
- **Gradle errors:** Update Android Studio and Gradle
- **Signing errors:** Verify keystore path and passwords
- **Memory issues:** Add to `android/gradle.properties`:
  ```properties
  org.gradle.jvmargs=-Xmx4096m
  ```

---

## 🔄 Updating Your App

When you make changes:

1. Update version numbers:
   - iOS: Increment in Xcode (General → Version & Build)
   - Android: Update `versionCode` and `versionName` in `build.gradle`

2. Build and sync:
   ```bash
   npm run cap:sync
   ```

3. Follow the same release process for your platform

---

## 📚 Additional Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

---

## ✅ Pre-Launch Checklist

- [ ] Unique app ID configured
- [ ] App icons added (all sizes)
- [ ] Screenshots prepared
- [ ] App tested on real devices
- [ ] Privacy policy created (if collecting data)
- [ ] App description written
- [ ] Pricing/availability configured
- [ ] Content rating completed
- [ ] Keystore/certificates backed up securely

---

Good luck with your app launch! 🚀
