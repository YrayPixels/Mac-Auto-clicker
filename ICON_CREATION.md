# Creating Icons for Auto Mouse

This guide explains how to create icons for both macOS and Windows builds.

## Quick Start

### For Windows Icon

1. **Have a PNG file ready** (256x256 or larger, square image)

2. **Option A: Use the helper script** (requires ImageMagick)
   ```bash
   npm run create-win-icon path/to/your-icon.png
   ```

3. **Option B: Use online converter**
   - Go to https://convertio.co/png-ico/
   - Upload your PNG file
   - Download the .ico file
   - Save it as `build/icon.ico`

### For macOS Icon

1. **Have a PNG file ready** (1024x1024 recommended)

2. **Create .icns file**:
   ```bash
   # Create iconset directory
   mkdir MyIcon.iconset
   
   # Generate all required sizes (on macOS)
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
   iconutil -c icns MyIcon.iconset -o build/icon.icns
   ```

## Icon Requirements

### Windows (.ico)
- **Format**: ICO file
- **Sizes**: Should include 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- **Source**: Start with 256x256 PNG or larger
- **Location**: `build/icon.ico`

### macOS (.icns)
- **Format**: ICNS file
- **Sizes**: Multiple sizes from 16x16 to 1024x1024 (including @2x variants)
- **Source**: Start with 1024x1024 PNG
- **Location**: `build/icon.icns`

## Tools

### ImageMagick (Recommended for Windows icon)
Install: `brew install imagemagick` (macOS) or download from https://imagemagick.org

### Online Converters
- **PNG to ICO**: https://convertio.co/png-ico/
- **PNG to ICNS**: https://cloudconvert.com/png-to-icns
- **All formats**: https://iconverticons.com/online/

## Design Tips

1. **Keep it simple**: Icons should be recognizable at small sizes
2. **Use high contrast**: Ensure visibility at 16x16 pixels
3. **Square format**: Icons are displayed in square containers
4. **Avoid text**: Text becomes unreadable at small sizes
5. **Test at multiple sizes**: Check how it looks at 16x16, 32x32, and 256x256

## Verification

After creating icons, verify they exist:

```bash
# Check Windows icon
ls -lh build/icon.ico

# Check macOS icon
ls -lh build/icon.icns
```

Then test the build:

```bash
# Test Windows build (will show error if icon missing)
npm run pack:win

# Test macOS build (will show error if icon missing)
npm run pack:dmg
```

## Troubleshooting

### "Icon file not found" error
- Make sure the icon file is in the `build/` directory
- Check the filename matches exactly: `icon.ico` (Windows) or `icon.icns` (macOS)
- Verify the file exists: `ls build/icon.*`

### Icon looks blurry
- Use a higher resolution source image (1024x1024 or larger)
- Ensure your source PNG is high quality
- Re-generate the icon with a better source image

### Helper script fails
- Install ImageMagick: `brew install imagemagick`
- Or use an online converter instead
- Make sure the PNG file path is correct

