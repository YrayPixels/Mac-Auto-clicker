# 🤖 AI-Powered Automation Guide

## Overview

Auto Mouse now includes powerful AI-powered automation capabilities that allow you to:
1. **Natural Language Commands**: Describe what you want to automate in plain English, and AI will convert it to executable commands
2. **JSON Command Sequences**: Paste pre-defined JSON command arrays for direct execution

## Setup

### 1. Get an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key (starts with `sk-`)
5. Copy your API key

### 2. Configure Auto Mouse

1. Open Auto Mouse
2. Scroll to the **🤖 AI-Powered Automation** section
3. Paste your OpenAI API key in the input field
4. Click **💾 Save Key**
   - Your key is stored locally on your machine at `~/.automouse-api-key`
   - It's never sent anywhere except directly to OpenAI's API

## Using Natural Language Commands

### How It Works

Simply describe what you want to automate in plain English. The AI (powered by GPT-4o-mini) will convert your description into a sequence of automation commands.

### Examples

#### Example 1: Basic Clicking
```
Click 3 times, wait 1 second, then click again
```

#### Example 2: Mouse Movement + Typing
```
Move mouse to position 500, 300 and double click, then type "Hello World" and press Enter
```

#### Example 3: Keyboard Shortcuts
```
Press Command+Space, wait 500 milliseconds, type "Safari", then press Enter
```

#### Example 4: Form Filling
```
Type "john@example.com", press Tab, type "password123", press Tab, then press Enter
```

#### Example 5: Complex Workflow
```
Click at current position, wait 1 second, scroll down 200 pixels, wait 500ms, swipe left 300 pixels, then press Command+Tab
```

### Steps

1. Enter your description in the **"Describe what you want to automate"** textarea
2. Click **✨ Generate Commands**
3. Review the generated commands in the preview
4. **Optional**: Select **Repeat Count** to run commands multiple times
   - **Once**: Run one time (default)
   - **2-10 times**: Run a specific number of times
   - **Infinite Loop**: Keep running until stopped (press Stop button or ⌘ Shift X)
5. Click **▶️ Execute** to run the automation

## Using JSON Command Sequences

For advanced users or programmatic use, you can directly paste JSON command arrays.

### Command Types

#### 1. Click
```json
{
  "type": "click",
  "params": {
    "button": "left",  // or "right"
    "count": 2         // number of clicks
  },
  "description": "Double click"
}
```

#### 2. Move To (Absolute Position)
```json
{
  "type": "moveTo",
  "params": {
    "x": 500,
    "y": 300
  },
  "description": "Move to coordinates (500, 300)"
}
```

#### 3. Move (Relative)
```json
{
  "type": "move",
  "params": {
    "x": 100,  // move 100 pixels right
    "y": -50   // move 50 pixels up
  },
  "description": "Move cursor relative to current position"
}
```

#### 4. Type Text
```json
{
  "type": "type",
  "params": {
    "text": "Hello, World!"
  },
  "description": "Type a message"
}
```

#### 5. Keypress (with modifiers)
```json
{
  "type": "keypress",
  "params": {
    "key": "enter",
    "modifiers": ["command", "shift"]  // optional
  },
  "description": "Press Command+Shift+Enter"
}
```

**Available Keys:**
- Regular keys: `a-z`, `0-9`, etc.
- Special keys: `enter`, `escape`, `tab`, `space`, `backspace`, `delete`
- Arrow keys: `up`, `down`, `left`, `right`
- Function keys: `f1` - `f12`
- Others: `pageup`, `pagedown`, `home`, `end`

**Available Modifiers:**
- `command` (or `cmd`)
- `control` (or `ctrl`)
- `shift`
- `alt` (or `option`)

#### 6. Scroll
```json
{
  "type": "scroll",
  "params": {
    "direction": "down",  // or "up"
    "amount": 200         // pixels
  },
  "description": "Scroll down 200 pixels"
}
```

#### 7. Swipe (Drag)
```json
{
  "type": "swipe",
  "params": {
    "direction": "left",  // "left", "right", "up", or "down"
    "distance": 300       // pixels
  },
  "description": "Swipe left 300 pixels"
}
```

#### 8. Wait
```json
{
  "type": "wait",
  "params": {
    "duration": 1000  // milliseconds
  },
  "description": "Wait 1 second"
}
```

### Complete JSON Example

```json
[
  {
    "type": "moveTo",
    "params": {"x": 500, "y": 300},
    "description": "Move to button position"
  },
  {
    "type": "click",
    "params": {"button": "left", "count": 2},
    "description": "Double click"
  },
  {
    "type": "wait",
    "params": {"duration": 500},
    "description": "Wait for response"
  },
  {
    "type": "type",
    "params": {"text": "test@example.com"},
    "description": "Enter email"
  },
  {
    "type": "keypress",
    "params": {"key": "tab"},
    "description": "Move to next field"
  },
  {
    "type": "type",
    "params": {"text": "password123"},
    "description": "Enter password"
  },
  {
    "type": "keypress",
    "params": {"key": "enter"},
    "description": "Submit form"
  }
]
```

### Steps

1. Paste your JSON command array into the **"Paste JSON Command Array"** textarea
2. Click **✓ Validate JSON** to check for errors (optional)
3. **Optional**: Select **Repeat Count** to loop the sequence
   - **Once**: Run one time (default)
   - **2-10 times**: Run a specific number of times
   - **Infinite Loop**: Keep running until stopped
4. Click **▶️ Execute JSON** to run the commands

## Tips & Best Practices

### 1. Use Waits Between Actions
Add wait commands between actions to give applications time to respond:
```json
{"type": "wait", "params": {"duration": 500}}
```

### 2. Test with Small Sequences First
Start with simple 2-3 command sequences to understand timing and behavior.

### 3. Get Current Mouse Position
Use the mouse position display at the bottom of Auto Mouse to get exact coordinates for `moveTo` commands.

### 4. Save Your Sequences
Copy your validated JSON sequences to a file for reuse. You can build a library of common automation tasks.

### 5. Emergency Stop
Press **⌘ Shift X** at any time to stop all running automation, including infinite loops.

### 6. Coordinate Detection
To find the right coordinates for clicking:
1. Move your mouse to the desired position
2. Check the "Current Position" display
3. Use those coordinates in a `moveTo` command

### 7. Using Loops/Repeats
**Great for**:
- Repetitive data entry
- Testing the same action multiple times
- Creating automated clicking patterns
- Continuous monitoring tasks (infinite loop)

**Example**: If you need to fill 10 forms with the same data, create one form-filling sequence and set Repeat Count to 10.

### 8. Infinite Loops
When using infinite loops:
- Always test your sequence once before looping
- Make sure to include wait commands to avoid overwhelming the system
- Remember you can stop with the Stop button or **⌘ Shift X**
- Useful for keeping your screen active or continuous monitoring

## Use Cases

### Web Automation
- Fill out repetitive forms
- Navigate through multi-step processes
- Perform repeated searches or data entry

### Application Testing
- Automate UI testing sequences
- Simulate user interactions
- Test keyboard shortcuts

### Gaming
- Automate repetitive game actions
- Execute complex macro sequences
- Timed button combinations

### Productivity
- Automate file organization workflows
- Batch process similar tasks
- Create custom shortcuts for complex actions

## Troubleshooting

### Commands Not Executing
- Ensure macOS Accessibility permissions are granted
- Check that the application you're automating is in focus
- Verify coordinates are within screen bounds

### AI Generation Fails
- Check your API key is correct and has credits
- Verify internet connection
- Try simplifying your prompt
- Check OpenAI API status

### Wrong Coordinates
- Use the mouse position display to verify coordinates
- Remember that (0,0) is the top-left corner
- Coordinates are in pixels

### Timing Issues
- Increase wait durations between commands
- Some applications need more time to respond
- Add waits after clicks or keypresses

## API Costs

Using the AI command generation features costs OpenAI API credits:
- Model used: **GPT-4o-mini** (very affordable)
- Approximate cost: **~$0.001-0.002 per generation**
- Pasting JSON commands is **completely free** (no API calls)

## Privacy & Security

- Your API key is stored locally at `~/.automouse-api-key`
- API key is only sent to OpenAI's servers
- No automation data is collected or stored
- All processing happens on your machine

## Command Format Reference

```typescript
interface CommandSequence {
  type: 'click' | 'move' | 'moveTo' | 'type' | 'keypress' | 'scroll' | 'swipe' | 'wait';
  params?: {
    // For click
    button?: 'left' | 'right';
    count?: number;
    
    // For move/moveTo
    x?: number;
    y?: number;
    
    // For type
    text?: string;
    
    // For keypress
    key?: string;
    modifiers?: string[];
    
    // For scroll
    direction?: 'up' | 'down';
    amount?: number;
    
    // For swipe
    direction?: 'left' | 'right' | 'up' | 'down';
    distance?: number;
    
    // For wait
    duration?: number;
  };
  description?: string;
}
```

## Need Help?

If you encounter issues:
1. Check this guide for examples
2. Verify your OpenAI API key is valid
3. Ensure macOS Accessibility permissions are granted
4. Try the JSON validation feature to check command syntax

---

**Happy Automating! 🚀**


