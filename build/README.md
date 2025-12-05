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

### For Direct Distribution (macOS)

1. **icon.icns** (Required)
   - Same as above

2. **Developer ID Certificate** (Required)
   - Managed through Xcode/Keychain Access
   - Not stored in this directory

### For Windows Distribution

1. **icon.ico** (Required)
   - Windows icon file
   - Generate from a 256x256 PNG (or larger)
   - Should include multiple sizes: 16x16, 32x32, 48x48, 256x256

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

### From PNG to ICO (Windows)

#### Option 1: Using ImageMagick (Cross-platform)

```bash
# Install ImageMagick first: brew install imagemagick (macOS) or download from imagemagick.org

# Create ICO with multiple sizes
magick convert icon-256.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico
```

#### Option 2: Using Online Tools

- https://convertio.co/png-ico/
- https://icoconvert.com/
- https://www.icoconverter.com/

Upload your PNG (256x256 or larger) and download the .ico file, then save as `build/icon.ico`

#### Option 3: Using macOS sips (if you have a PNG)

```bash
# Create a temporary iconset
mkdir temp-icon.iconset

# Generate sizes
sips -z 16 16   icon-256.png --out temp-icon.iconset/icon_16x16.png
sips -z 32 32   icon-256.png --out temp-icon.iconset/icon_32x32.png
sips -z 48 48   icon-256.png --out temp-icon.iconset/icon_48x48.png
sips -z 128 128 icon-256.png --out temp-icon.iconset/icon_128x128.png
sips -z 256 256 icon-256.png --out temp-icon.iconset/icon_256x256.png

# Then use an online converter or ImageMagick to convert to .ico
# Or use: iconutil -c iconset temp-icon.iconset (but this creates .iconset, not .ico)
```

#### Option 4: Using Node.js script

See `scripts/create-windows-icon.js` for an automated solution.

### Alternative: Use Online Tools (macOS)

- https://cloudconvert.com/png-to-icns
- https://iconverticons.com/online/

## Security Note

**DO NOT commit** the following files to version control:
- `embedded.provisionprofile` (contains sensitive signing information)
- Any `.p12` or `.cer` certificate files

Add them to `.gitignore` if needed.

