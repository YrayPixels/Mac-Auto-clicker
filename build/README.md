# Build Assets Directory

This directory contains assets needed for building and distributing Auto Mouse.

## Required Files

### For Mac App Store Distribution

1. **embedded.provisionprofile** (Required)
   - Download from Apple Developer Portal
   - Must match your App ID: `com.automouse.app`

2. **icon.icns** (Required)
   - macOS icon file
   - Generate from a 1024x1024 PNG using `iconutil`

### For Direct Distribution

1. **icon.icns** (Required)
   - Same as above

2. **Developer ID Certificate** (Required)
   - Managed through Xcode/Keychain Access
   - Not stored in this directory

## Files Already Included

- `entitlements.mas.plist` - Entitlements for Mac App Store builds
- `entitlements.mas.inherit.plist` - Inherited entitlements for child processes
- `entitlements.dmg.plist` - Entitlements for direct distribution

## Creating an Icon

### From PNG to ICNS

1. Start with a 1024x1024 PNG image
2. Create an iconset:

```bash
mkdir MyIcon.iconset

# Generate all required sizes
sips -z 16 16     icon-1024.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     icon-1024.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     icon-1024.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     icon-1024.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   icon-1024.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   icon-1024.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   icon-1024.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   icon-1024.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   icon-1024.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 icon-1024.png --out MyIcon.iconset/icon_512x512@2x.png

# Convert to .icns
iconutil -c icns MyIcon.iconset -o icon.icns

# Move to build directory
mv icon.icns ./build/
```

### Alternative: Use Online Tools

- https://cloudconvert.com/png-to-icns
- https://iconverticons.com/online/

## Security Note

**DO NOT commit** the following files to version control:
- `embedded.provisionprofile` (contains sensitive signing information)
- Any `.p12` or `.cer` certificate files

Add them to `.gitignore` if needed.

