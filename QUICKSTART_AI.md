# 🚀 Quick Start: AI-Powered Automation

Get started with AI automation in **3 minutes**!

## Step 1: Get Your OpenAI API Key (2 minutes)

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Give it a name like "Auto Mouse"
5. **Copy the key** (starts with `sk-...`)
   - ⚠️ You can only see it once!
   - Save it somewhere safe

## Step 2: Configure Auto Mouse (30 seconds)

1. **Open Auto Mouse**
2. **Scroll down** to the **🤖 AI-Powered Automation** section
3. **Paste your API key** in the input field
4. Click **💾 Save Key**
5. ✅ Done! You'll see "API key saved securely"

## Step 3: Try Your First Automation (30 seconds)

### Option A: Natural Language (Easiest)

1. In the **"Describe what you want to automate"** box, type:
   ```
   Click 3 times, wait 1 second, then type Hello World
   ```

2. Click **✨ Generate Commands**
3. Wait 2-3 seconds for AI to generate
4. Review the commands shown
5. **(Optional)** Select **Repeat Count** to run multiple times
6. Click **▶️ Execute**

### Option B: JSON Commands (Advanced)

1. Scroll to **"Paste JSON Command Array"**
2. Paste this example:
   ```json
   [
     {"type": "click", "params": {"button": "left", "count": 3}},
     {"type": "wait", "params": {"duration": 1000}},
     {"type": "type", "params": {"text": "Hello World"}}
   ]
   ```
3. **(Optional)** Select **Repeat Count** for loops
4. Click **▶️ Execute JSON**

## 🎯 More Example Prompts

Try these natural language prompts:

### Basic Actions
```
Click twice at current position
```

### Mouse + Typing
```
Move mouse to 500, 300 and double click, then type test@example.com
```

### Keyboard Shortcuts
```
Press Command+Space, wait 500 milliseconds, type Safari, then press Enter
```

### Form Filling
```
Type john@example.com, press Tab, type password123, press Tab, then press Enter
```

### Complex Workflow
```
Click, wait 1 second, scroll down 200 pixels, wait 500ms, then press Command+Tab
```

## 💡 Tips

1. **Be Specific**: Include timing ("wait 1 second") and exact actions
2. **Preview First**: Always review generated commands before executing
3. **Start Simple**: Test with 2-3 commands first
4. **Use Position Display**: Check current mouse position at bottom of app
5. **Emergency Stop**: Press **⌘ Shift X** to stop any automation
6. **Repeat/Loop**: Use the Repeat Count dropdown to run sequences multiple times
   - Perfect for repetitive tasks
   - Infinite Loop option for continuous automation
   - Can be stopped anytime with Stop button or **⌘ Shift X**

## 📖 Need More Help?

- **Full Guide**: See [AI_AUTOMATION_GUIDE.md](./AI_AUTOMATION_GUIDE.md)
- **Examples**: Check the [examples/](./examples/) folder
- **Main README**: See [README.md](./README.md)

## 💰 Costs

- AI command generation: **~$0.001 per prompt** (very cheap!)
- JSON execution: **100% FREE** (no API calls)
- You only pay for what you use through OpenAI

## ⚠️ Important

- **Accessibility Permissions**: macOS requires this for automation
  - Settings → Privacy & Security → Accessibility
  - Add Auto Mouse to the list
- **Test Safely**: Always test in safe environments first
- **API Key Security**: Stored locally, only sent to OpenAI

---

**That's it! You're ready to automate! 🎉**

Press **⌘ Shift X** anytime to stop automation.


