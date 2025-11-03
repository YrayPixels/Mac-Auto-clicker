# 🚀 Quick Start Guide

Get up and running with Standard Movements in 3 simple steps!

## Step 0: Prerequisites (macOS)

Make sure you have Xcode Command Line Tools installed (needed for robotjs):

```bash
xcode-select --install
```

## Step 1: Install Dependencies

```bash
npm install
```

This will install and compile:
- Electron (desktop framework)
- robotjs (native mouse automation - will compile for your system)
- TypeScript & type definitions

**Note**: The robotjs install may take a minute as it compiles native code.

## Step 2: Build TypeScript

```bash
npm run build
```

This compiles your TypeScript files from `src/` to `dist/`.

## Step 3: Run the App

```bash
npm start
```

The app window should open!

---

## ⚠️ Before First Use

### Enable macOS Accessibility Permissions

**The app won't work without these permissions!**

1. Go to **System Settings** → **Privacy & Security** → **Accessibility**
2. Click the 🔒 lock icon (enter your password)
3. Click **+** button and add "Electron" (or find it in the list)
4. Enable the checkbox ✅
5. Restart the app

---

## 🎮 Quick Feature Test

### Test Auto Clicker
1. Set interval to 1000ms
2. Click "Start Clicking"
3. Watch your mouse click automatically
4. Press `⌘ Shift X` or click "Stop"

### Test Mouse Mover
1. Select "Circular" pattern
2. Click "Start Moving"
3. Watch the mouse move in a circle
4. Press `⌘ Shift X` or click "Stop"

### Test Swipe
1. Set distance to 200
2. Click any arrow button (↑ ↓ ← →)
3. Watch the mouse drag in that direction

---

## 🆘 Troubleshooting

**Nothing happens when I click start:**
- Did you enable Accessibility permissions?
- Restart the app after granting permissions

**"Cannot find module" errors:**
- Run `npm install` again
- Make sure you're in the project directory

**TypeScript compilation fails:**
- Check Node.js version (needs v16+)
- Delete `node_modules/` and `package-lock.json`, then `npm install`

---

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize automation patterns to your needs
- Build and package for distribution

**Happy automating! 🎉**

