# Building Auto Mouse for Distribution

This guide explains how to build and distribute your Auto Mouse app for macOS and Windows.

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com

2. **Development Tools**
   - Xcode Command Line Tools (install with: `xcode-select --install`)
   - Node.js and npm (already installed)

## Distribution Options

You have two main distribution options:

### Option 1: Mac App Store Distribution (More Restrictive)
### Option 2: Direct Distribution via DMG (Recommended for automation apps)

---

## Option 1: Mac App Store Distribution

### Step 1: Set Up Code Signing

1. **Create Certificates** (via Xcode or Apple Developer Portal):
   - Mac App Distribution certificate
   - Mac Installer Distribution certificate

2. **Create App ID**:
   - Go to https://developer.apple.com/account/resources/identifiers
   - Create a new App ID: `com.automouse.app`
   - Note your Team ID (found in your Apple Developer account)

3. **Create Provisioning Profile**:
   - Go to https://developer.apple.com/account/resources/profiles
   - Create a "Mac App Store" provisioning profile for your App ID
   - Download and save it as: `build/embedded.provisionprofile`

4. **Update Entitlements**:
   - Open `build/entitlements.mas.plist`
   - Replace `YOUR_TEAM_ID` with your actual Apple Team ID

### Step 2: Create App Icon

1. Create a 1024x1024 PNG icon for your app
2. Use an icon converter or run:
   ```bash
   # Install iconutil if needed (comes with Xcode)
   # Create an iconset directory
   mkdir MyIcon.iconset
   
   # Generate required sizes (512x512, 256x256, etc.)
   # Then convert to .icns
   iconutil -c icns MyIcon.iconset -o build/icon.icns
   ```

### Step 3: Build for Mac App Store

```bash
# Make sure your code is compiled
npm run build

# Build the .pkg for Mac App Store
npm run dist:mas
```

This creates a `.pkg` file in `dist/mas/` directory.

### Step 4: Submit to App Store Connect

1. **Create App in App Store Connect**:
   - Go to https://appstoreconnect.apple.com
   - Create a new macOS app
   - Fill in metadata, screenshots, description

2. **Upload the .pkg**:
   
   Using Transporter app (Recommended):
   - Download Transporter from Mac App Store
   - Drag your .pkg file into Transporter
   - Click "Deliver"

   Or using command line:
   ```bash
   xcrun altool --upload-app --type osx \
     --file "dist/mas/Auto Mouse-1.0.0.pkg" \
     --username "your@apple.id" \
     --password "@keychain:AC_PASSWORD"
   ```

   To set up keychain password:
   ```bash
   xcrun altool --store-password-in-keychain-item "AC_PASSWORD" \
     -u "your@apple.id" \
     -p "your-app-specific-password"
   ```

3. **Submit for Review**:
   - Complete all metadata in App Store Connect
   - Submit for review

### ⚠️ Important Notes for Mac App Store

**Your app uses `@jitsi/robotjs` for automation, which may face rejection from Apple because:**
- Apps that control mouse/keyboard require special justification
- Apple is very strict about automation tools in the Mac App Store
- You need to clearly explain the purpose and use case in your App Review notes

**To improve chances of approval:**
1. Provide a detailed explanation of why the app needs these permissions
2. Create a demo video showing the app's functionality
3. Emphasize legitimate use cases (productivity, accessibility, etc.)
4. Be prepared for potential rejection and appeals

---

## Option 2: Direct Distribution (Recommended)

This is **much easier** for automation apps and doesn't have App Store restrictions.

### Step 1: Get Developer ID Certificate

1. **Create Certificates** (via Xcode or Apple Developer Portal):
   - Developer ID Application certificate
   - Developer ID Installer certificate (optional, for .pkg)

### Step 2: Update package.json for Developer ID

If distributing directly, update the mac configuration in `package.json`:

```json
"mac": {
  "category": "public.app-category.utilities",
  "target": ["dmg"],
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "build/entitlements.dmg.plist",
  "entitlementsInherit": "build/entitlements.dmg.plist"
}
```

### Step 3: Build DMG

```bash
# Build for direct distribution
npm run dist:dmg
```

This creates a `.dmg` file in `dist/` directory.

### Step 4: Notarize the App (Required for macOS 10.15+)

```bash
# Submit for notarization
xcrun notarytool submit "dist/Auto Mouse-1.0.0.dmg" \
  --apple-id "your@apple.id" \
  --team-id "YOUR_TEAM_ID" \
  --password "app-specific-password" \
  --wait

# Staple the notarization ticket
xcrun stapler staple "dist/Auto Mouse-1.0.0.dmg"
```

### Step 5: Distribute

Upload the `.dmg` to:
- Your website
- GitHub Releases
- Other download platforms

Users can download and drag the app to their Applications folder.

### Benefits of Direct Distribution:
- ✅ No App Store review process
- ✅ More permissive entitlements for automation
- ✅ Faster updates
- ✅ No 30% Apple commission
- ✅ More control over distribution

---

## Windows Distribution

Building for Windows is simpler than macOS as it doesn't require code signing certificates (though signing is recommended for better security).

### Prerequisites

1. **Windows Machine** (or Windows VM/CI)
   - Windows 10/11 recommended
   - Node.js and npm installed

2. **Optional: Code Signing Certificate**
   - Not required, but recommended for distribution
   - Prevents Windows Defender warnings
   - Purchase from certificate authorities like DigiCert, Sectigo, etc.

### Step 1: Create Windows Icon

1. Create a 256x256 PNG icon for your app
2. Convert to `.ico` format:
   - Use online tools like https://convertio.co/png-ico/
   - Or use ImageMagick: `magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico`
   - Save as `build/icon.ico`

### Step 2: Build Windows Installer (NSIS)

```bash
# Make sure your code is compiled
npm run build

# Build the Windows installer
npm run dist:win
```

This creates:
- `dist/Auto Mouse Setup 1.0.0.exe` - NSIS installer (x64 and ia32)
- `dist/win-unpacked/` - Unpacked app directory

### Step 3: Build Portable Version (Optional)

```bash
# Build portable executable (no installer needed)
npm run dist:portable
```

This creates:
- `dist/Auto Mouse 1.0.0.exe` - Portable executable (x64)

### Step 4: Code Signing (Optional but Recommended)

If you have a code signing certificate:

```bash
# Sign the installer
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "dist/Auto Mouse Setup 1.0.0.exe"

# Sign the portable executable
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com "dist/Auto Mouse 1.0.0.exe"
```

Or set environment variables for automatic signing:

```bash
# Set certificate path and password
export CSC_LINK=/path/to/certificate.pfx
export CSC_KEY_PASSWORD=your_password

# Build will automatically sign
npm run dist:win
```

### Step 5: Distribute

Upload the installer/executable to:
- Your website
- GitHub Releases
- Other download platforms

**Note for Users**: Windows may show a "Windows protected your PC" warning for unsigned apps. Users need to click "More info" → "Run anyway" for the first launch.

### Windows-Specific Considerations

1. **Antivirus Warnings**: Unsigned automation apps may trigger antivirus warnings. Code signing helps reduce false positives.

2. **Permissions**: Windows doesn't require explicit accessibility permissions like macOS, but the app may need to run with appropriate privileges.

3. **Desktop Switching**: The macOS-specific Control+Arrow desktop switching feature won't work on Windows. Users can still use other keyboard shortcuts.

### Benefits of Windows Distribution:
- ✅ No code signing required (but recommended)
- ✅ Simple installer creation
- ✅ Portable executable option available
- ✅ No app store restrictions
- ✅ Wide user base

---

## Testing Before Distribution

### Test the Build Locally

```bash
# Build and test DMG
npm run pack:dmg

# The app will be in dist/ - mount the DMG and test
open dist/Auto\ Mouse-1.0.0.dmg
```

### Test on a Clean Mac

Before distributing, test on a Mac that doesn't have development tools:
1. Copy the .dmg to another Mac
2. Install the app
3. Verify all features work
4. Check that permissions dialogs appear correctly

### Test Windows Build

```bash
# Build and test Windows installer
npm run pack:win

# Test the installer on a clean Windows machine
# Install from dist/Auto Mouse Setup 1.0.0.exe
```

Before distributing Windows builds:
1. Test on a clean Windows machine (VM or separate computer)
2. Install the app
3. Verify all features work
4. Check that automation features function correctly
5. Test both NSIS installer and portable versions

---

## Common Issues

### Issue: "App is damaged and can't be opened"
**Solution**: The app needs to be code-signed and notarized.

### Issue: "robotjs" doesn't work in production
**Solution**: Make sure you ran `npm run rebuild` after installing dependencies.

### Issue: Accessibility permissions not working
**Solution**: Add a note in your app's first-run dialog explaining that users need to grant Accessibility permissions in System Preferences → Privacy & Security.

---

## App Store Review Guidelines

If submitting to Mac App Store, review these guidelines:
- https://developer.apple.com/app-store/review/guidelines/
- Section 2.5.2: Apps should be self-contained and not execute code outside the sandbox
- Section 5.1.1: Privacy - You must explain why you need accessibility permissions

---

## Environment Variables for CI/CD

For automated builds, you can set these environment variables:

### macOS

```bash
# For signing
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=certificate_password

# For notarization
export APPLE_ID=your@apple.id
export APPLE_ID_PASSWORD=app-specific-password
export APPLE_TEAM_ID=YOUR_TEAM_ID
```

### Windows

```bash
# For code signing (optional)
export CSC_LINK=/path/to/certificate.pfx
export CSC_KEY_PASSWORD=certificate_password

# For timestamp server
export CSC_TIMESTAMP_SERVER=http://timestamp.digicert.com
```

---

## Next Steps

### For macOS:
1. Choose your distribution method (App Store vs Direct)
2. Set up code signing certificates
3. Create an app icon (1024x1024 PNG → .icns)
4. Build and test locally
5. Notarize (for direct) or submit (for App Store)
6. Distribute to users

### For Windows:
1. Create Windows icon (256x256 PNG → .ico)
2. Build installer or portable executable
3. Optionally sign with code signing certificate
4. Test on clean Windows machine
5. Distribute to users

For questions or issues, refer to:
- electron-builder docs: https://www.electron.build
- Apple Developer docs: https://developer.apple.com/documentation
- Windows Code Signing: https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools

