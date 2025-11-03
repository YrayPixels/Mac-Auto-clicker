# 🖱️ Standard Movements

An Electron-based auto clicker and mouse automation tool for macOS, built with TypeScript and robotjs.

## ✨ Features

- **🤖 AI-Powered Automation** (NEW!)
  - **Natural Language Commands**: Describe automation tasks in plain English
  - **OpenAI Integration**: Uses GPT-4o-mini to convert text to commands
  - **JSON Command Sequences**: Paste and execute pre-defined command arrays
  - Supports clicks, typing, keyboard shortcuts, mouse movements, scrolling, and more
  - See [AI_AUTOMATION_GUIDE.md](./AI_AUTOMATION_GUIDE.md) for detailed documentation

- **Auto Clicker**: Automate mouse clicks with customizable intervals
  - Left or right click support
  - Multiple clicks per interval
  - Adjustable timing (10ms - unlimited)

- **Mouse Mover**: Keep your screen active with automated mouse movements
  - Multiple patterns: Circular, Random, Horizontal, Vertical
  - Customizable speed and range
  - Smooth, natural-looking movements

- **Keyboard Automation**: Automated keyboard shortcuts and typing
  - Record or manually enter keyboard shortcuts
  - Sequential shortcut execution
  - Random typing with natural timing
  - Support for complex key combinations

- **Swipe Simulation**: Simulate drag gestures
  - 4-directional swipes (up, down, left, right)
  - Adjustable distance
  - Smooth drag motion

- **Scroll Control**: Programmatic scrolling
  - Scroll up/down
  - Adjustable scroll amount

- **Safety Features**
  - Emergency stop hotkey: `⌘ Shift X`
  - Real-time mouse position display
  - Clear visual feedback

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- macOS (this version is optimized for macOS)
- **Xcode Command Line Tools** (for robotjs compilation):
  ```bash
  xcode-select --install
  ```

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build TypeScript**:
   ```bash
   npm run build
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

### Development Mode

To run in development with auto-rebuild:

```bash
# Terminal 1: Watch TypeScript changes
npm run watch

# Terminal 2: Run Electron
npm run dev
```

## 🔐 macOS Permissions

**IMPORTANT**: macOS requires Accessibility permissions for mouse/keyboard automation.

### Enabling Accessibility Permissions

1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **Privacy & Security** → **Accessibility**
3. Click the lock icon to make changes (you'll need admin password)
4. Find your Electron app in the list or click **+** to add it
   - For development, add "Electron" or the Electron Helper
   - For production, add your built app
5. Check the box to enable permissions

### If Automation Doesn't Work

If clicks or mouse movements aren't working:

1. Verify Accessibility permissions are enabled
2. Restart the app after granting permissions
3. Check Console for error messages
4. Try manually adding the app to Accessibility settings

For packaged apps, you'll need to code-sign and notarize your app for distribution.

## 📖 Usage

### 🤖 AI-Powered Automation

**See the complete guide: [AI_AUTOMATION_GUIDE.md](./AI_AUTOMATION_GUIDE.md)**

#### Quick Start

1. **Get an OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an API key (starts with `sk-`)

2. **Configure in App**:
   - Paste your API key in the AI Automation section
   - Click "Save Key"

3. **Use Natural Language**:
   ```
   Example: "Click 3 times, wait 1 second, type 'Hello', then press Enter"
   ```
   - Click "Generate Commands"
   - Review the generated commands
   - Click "Execute"

4. **Or Use JSON Commands**:
   ```json
   [
     {"type": "click", "params": {"button": "left", "count": 2}},
     {"type": "type", "params": {"text": "Hello World"}},
     {"type": "keypress", "params": {"key": "enter"}}
   ]
   ```
   - Paste JSON in the command area
   - Click "Execute JSON"

### Auto Clicker

1. Set the **Interval** (time between clicks in milliseconds)
2. Choose **Button** (left or right click)
3. Set **Clicks per Interval** (how many times to click)
4. Click **Start Clicking**
5. Click **Stop** or press `⌘ Shift X` to stop

### Mouse Mover

1. Choose a **Pattern**:
   - **Circular**: Moves in a circular motion
   - **Random**: Random movements
   - **Horizontal**: Side-to-side motion
   - **Vertical**: Up-and-down motion
2. Set **Speed** (interval between movements in ms)
3. Set **Range** (how far to move in pixels)
4. Click **Start Moving**
5. Click **Stop** or press `⌘ Shift X` to stop

### Swipe Simulation

1. Set the **Distance** (how far to drag)
2. Click any arrow button to simulate a swipe in that direction

### Scroll

1. Set the **Amount** (scroll distance)
2. Click **Scroll Up** or **Scroll Down**

## ⚠️ Important Notes

### Limitations

- **Cannot simulate native macOS gestures**: Trackpad gestures like Mission Control or desktop switching are protected by macOS
- **Security restrictions**: Apple restricts gesture simulation for security reasons
- **Accessibility required**: The app won't work without proper permissions

### Best Practices

- Always test in a safe environment first
- Use the emergency stop hotkey (`⌘ Shift X`) when needed
- Be careful with very fast click intervals
- Respect app terms of service when automating

### Legal & Ethical Use

This tool is for legitimate automation purposes only:
- Preventing screen savers during presentations
- Automating repetitive tasks in your own applications
- Testing and development

**Do NOT use this tool to**:
- Cheat in games
- Violate terms of service
- Automate unauthorized actions
- Bypass security measures

## 🛠️ Project Structure

```
standard-movements/
├── src/
│   ├── main.ts       # Main Electron process
│   ├── preload.ts    # Preload script (IPC bridge)
│   └── types.ts      # TypeScript type definitions
├── dist/             # Compiled JavaScript (generated)
├── index.html        # UI markup
├── styles.css        # UI styling
├── renderer.js       # Renderer process logic
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## 📦 Building for Production

To package the app for distribution:

1. Install electron-builder:
   ```bash
   npm install --save-dev electron-builder
   ```

2. Add build configuration to `package.json`:
   ```json
   "build": {
     "appId": "com.yourcompany.standardmovements",
     "mac": {
       "category": "public.app-category.utilities"
     }
   }
   ```

3. Build:
   ```bash
   npm run build
   npx electron-builder
   ```

**Note**: For macOS distribution, you'll need:
- Apple Developer ID
- Code signing certificate
- Notarization (required for macOS 10.15+)

## 🔧 Dependencies

- **Electron**: Cross-platform desktop framework
- **robotjs**: Native mouse and keyboard automation library
- **TypeScript**: Type-safe JavaScript
- **OpenAI API**: Powers AI command generation (user provides API key)

## 📝 Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Build and run the app
- `npm run dev`: Run in development mode
- `npm run watch`: Watch TypeScript files for changes

## 🐛 Troubleshooting

### "Mouse automation not working"
- Ensure Accessibility permissions are granted
- Restart the app after granting permissions
- Check if robotjs is properly installed
- robotjs requires native compilation - ensure you have build tools

### "Permission denied" errors
- Grant Accessibility permissions in System Settings
- On Apple Silicon Macs, ensure Rosetta is installed if needed

### TypeScript compilation errors
- Run `npm run build` to see detailed errors
- Check that all dependencies are installed
- Verify `tsconfig.json` is correct

### Electron won't start
- Check that `dist/` folder exists with compiled JS
- Run `npm run build` first
- Check console for error messages

## 📄 License

MIT License - Feel free to use and modify as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## ⚡ Performance Tips

- Use reasonable intervals (>50ms) to avoid system strain
- Smaller ranges for mouse movement are less CPU-intensive
- Stop automation when not needed
- Monitor system resources if running for extended periods

## 🔮 Future Enhancements

Potential features for future versions:
- ✅ ~~AI-powered natural language automation~~ (Completed!)
- ✅ ~~Recording and playback of command sequences~~ (Completed!)
- Custom mouse patterns
- Hotkey customization
- Multiple automation profiles
- Scheduled automation tasks
- System tray integration
- Support for other AI providers (Anthropic, local models)

---

**Remember**: Always use automation tools responsibly and ethically! 🙏

