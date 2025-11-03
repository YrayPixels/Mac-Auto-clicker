# Example Command Sequences

This folder contains example JSON command sequences that you can use with Auto Mouse's AI-Powered Automation feature.

## How to Use These Examples

1. Open Auto Mouse
2. Navigate to the **🤖 AI-Powered Automation** section
3. Scroll to **Paste Command Sequence (JSON)**
4. Copy the contents of any example file below
5. Paste into the JSON textarea
6. Click **✓ Validate JSON** to verify
7. Click **▶️ Execute JSON** to run

## Available Examples

### 1. `example-commands.json`
**Basic demonstration of all command types**
- Move cursor to specific coordinates
- Double click
- Wait/pause
- Type text
- Press Enter

**Use case**: Learning the command structure

---

### 2. `form-filling.json`
**Automated form filling workflow**
- Type email address
- Tab to next field
- Type password
- Tab to confirm password field
- Retype password
- Submit form

**Use case**: Filling repetitive registration forms, testing forms

---

### 3. `app-launcher.json`
**Launch applications using Spotlight**
- Open Spotlight (Command+Space)
- Type application name
- Launch app

**Use case**: Quick app launching, testing application startup

---

### 4. `scroll-and-click.json`
**Scroll and interact workflow**
- Scroll down page
- Move to button position
- Click button
- Wait for response
- Scroll back up

**Use case**: Navigating and interacting with long pages

---

## Customizing Examples

### Adjusting Coordinates
Find the right coordinates by:
1. Moving your mouse to the desired position
2. Check the "Current Position" display at bottom of Auto Mouse
3. Use those X,Y values in `moveTo` commands

### Adjusting Timing
Modify `wait` durations based on:
- Your system speed
- Application response time
- Network latency (for web apps)

### Modifying Text
Replace text in `type` commands with your own:
```json
{
  "type": "type",
  "params": {
    "text": "Your custom text here"
  },
  "description": "Type custom message"
}
```

## Creating Your Own Sequences

### Basic Template
```json
[
  {
    "type": "COMMAND_TYPE",
    "params": {
      // command-specific parameters
    },
    "description": "Human-readable description"
  }
]
```

### Available Command Types
- `click` - Mouse clicks
- `moveTo` - Absolute mouse positioning
- `move` - Relative mouse movement
- `type` - Type text
- `keypress` - Press keys with modifiers
- `scroll` - Scroll up/down
- `swipe` - Drag/swipe gestures
- `wait` - Pause execution

See [AI_AUTOMATION_GUIDE.md](../AI_AUTOMATION_GUIDE.md) for complete command reference.

## Tips

1. **Start Simple**: Begin with 2-3 commands to test timing
2. **Add Waits**: Always add wait commands between actions
3. **Save Your Work**: Keep useful sequences as JSON files
4. **Test First**: Run in safe environment before production use
5. **Use Descriptions**: Clear descriptions help maintain sequences

## Natural Language Alternative

Instead of writing JSON, you can describe what you want in plain English:

**Example prompts**:
- "Fill a form: type email, press tab, type password, press enter"
- "Open Safari: press command+space, type Safari, press enter"
- "Scroll down 300 pixels, click at position 640,400, wait 1 second"

The AI will generate the JSON for you!

---

**Need Help?** See the main [AI_AUTOMATION_GUIDE.md](../AI_AUTOMATION_GUIDE.md)


