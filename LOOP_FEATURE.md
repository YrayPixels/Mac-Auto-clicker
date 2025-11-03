# 🔄 Loop/Repeat Feature Guide

## Overview

Auto Mouse now supports repeating command sequences! You can run any automation sequence multiple times or create infinite loops for continuous automation.

## How to Use

### For AI-Generated Commands

1. Generate your commands using natural language
2. Before clicking Execute, select **Repeat Count**:
   - **Once**: Single execution (default)
   - **2, 3, 5, 10 times**: Run a specific number of times
   - **Infinite Loop**: Run continuously until stopped
3. Click **Execute**
4. For infinite loops, click **Stop Loop** or press **⌘ Shift X** to stop

### For JSON Commands

1. Paste your JSON command array
2. Select **Repeat Count** from the dropdown
3. Click **Execute JSON**
4. For infinite loops, click **Stop Loop** or press **⌘ Shift X** to stop

## Loop Behavior

### Finite Loops (2-10 times)
- Executes the entire sequence once
- Waits 500ms (loop delay)
- Repeats for the specified count
- Button re-enables after completion

### Infinite Loops
- Executes the sequence continuously
- 500ms delay between iterations
- **Stop Loop** button appears
- Must be manually stopped
- Emergency stop: **⌘ Shift X**

## Use Cases

### Repetitive Data Entry
```
Scenario: Fill 5 identical forms
Solution: Create one form-filling sequence, set Repeat Count to 5
```

### Keep Screen Active
```
Scenario: Prevent screen saver during presentation
Solution: Simple mouse move or click with Infinite Loop
```

### Testing
```
Scenario: Test a button click 10 times
Solution: Single click command, set Repeat Count to 10
```

### Monitoring
```
Scenario: Check for changes every 2 seconds
Solution: Screenshot area with Infinite Loop, 2-second wait
```

## Example: Infinite Click Loop

**Natural Language Prompt:**
```
Click at current position, then wait 2 seconds
```

**JSON:**
```json
[
  {
    "type": "click",
    "params": {"button": "left", "count": 1},
    "description": "Click"
  },
  {
    "type": "wait",
    "params": {"duration": 2000},
    "description": "Wait 2 seconds"
  }
]
```

**Set Repeat Count to "Infinite Loop"** and execute!

## Example: Form Fill 3 Times

**Natural Language Prompt:**
```
Type john@example.com, press tab, type password123, press enter
```

**Set Repeat Count to "3 times"** - will fill the form 3 times in a row!

## Important Notes

### Safety
- ⚠️ Always test your sequence **once** before using loops
- ⚠️ Include adequate wait times between actions
- ⚠️ Remember you can always stop with **⌘ Shift X**

### Performance
- Longer sequences in tight loops may impact system performance
- Recommended: Keep sequences under 10 commands for smooth looping
- Always include wait commands to prevent overwhelming applications

### Loop Delay
- Default: 500ms between loop iterations
- This prevents rapid-fire execution
- Cannot be customized in UI (hardcoded for safety)

## Stopping Loops

### Three Ways to Stop:

1. **Stop Loop Button**: Appears during infinite loops
2. **Emergency Stop Hotkey**: **⌘ Shift X** (stops all automation)
3. **App Close**: Closing Auto Mouse stops all loops

### What Happens When Stopped:
- Current command completes
- No new iterations start
- Stop button disappears
- Execute button re-enables
- Status shows "Loop stopped"

## Tips

1. **Test First**: Run once before looping
2. **Include Waits**: Add delays between actions and iterations
3. **Monitor**: Watch the first few iterations to ensure proper behavior
4. **Start Small**: Begin with 2-3 loops before going infinite
5. **Save Sequences**: Keep useful loops as JSON files for reuse

## Common Patterns

### Pattern 1: Periodic Action
```json
[
  {"type": "ACTION", "params": {...}},
  {"type": "wait", "params": {"duration": 5000}}
]
```
Set to Infinite Loop for periodic execution every 5 seconds.

### Pattern 2: Batch Processing
```json
[
  {"type": "ACTION_1", ...},
  {"type": "ACTION_2", ...},
  {"type": "ACTION_3", ...}
]
```
Set to specific count (e.g., 10) to process 10 items.

### Pattern 3: Continuous Monitoring
```json
[
  {"type": "moveTo", "params": {"x": 100, "y": 100}},
  {"type": "click", "params": {"button": "left", "count": 1}},
  {"type": "wait", "params": {"duration": 1000}}
]
```
Infinite loop to keep clicking every second.

## Troubleshooting

### Loop Won't Stop
- Press **⌘ Shift X** (emergency stop)
- Force quit Auto Mouse if needed
- Always include wait commands to avoid overwhelming system

### Loop Too Fast
- Increase wait durations in your sequence
- 500ms loop delay is automatic but add your own waits too

### Commands Skip Steps
- Increase wait times between commands
- Some apps need more time to respond
- Test timing with single execution first

## Technical Details

- Loop iterations have 500ms delay between them
- Infinite loops run asynchronously in the background
- Emergency stop immediately cancels pending iterations
- Loop state is tracked per sequence (can't run multiple loops simultaneously)

---

**Happy Looping! 🔄**

Remember: Always test once before looping!

