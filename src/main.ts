import { app, BrowserWindow, ipcMain, globalShortcut, IpcMainInvokeEvent } from 'electron';
import * as path from 'path';
import * as robot from '@jitsi/robotjs';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as os from 'os';
import { AutoClickOptions, MouseMoveOptions, SwipeOptions, ScrollOptions, KeyboardShortcutOptions, RandomTypingOptions, ApiResponse, MousePositionResponse, AICommandOptions, AICommandResponse, CommandSequence } from './types';

const execPromise = promisify(exec);

// API Key storage path
const API_KEY_PATH = path.join(os.homedir(), '.automouse-api-key');

let mainWindow: BrowserWindow | null = null;
let autoClickInterval: NodeJS.Timeout | null = null;
let mouseMoveInterval: NodeJS.Timeout | null = null;
let keyboardShortcutInterval: NodeJS.Timeout | null = null;
let randomTypingInterval: NodeJS.Timeout | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 1100,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: true,
    title: 'Auto Mouse'
  });

  mainWindow.loadFile('index.html');

  // Register global shortcuts
  
  // Emergency stop - Stop all automation (Cmd+Shift+X)
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    stopAllAutomation();
    mainWindow?.webContents.send('automation-stopped');
  });

  // Toggle Auto Clicker (Cmd+Shift+C)
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (autoClickInterval) {
      clearInterval(autoClickInterval);
      autoClickInterval = null;
      mainWindow?.webContents.send('clicker-toggled', false);
    } else {
      mainWindow?.webContents.send('start-clicker-from-hotkey');
    }
  });

  // Toggle Mouse Mover (Cmd+Shift+M)
  globalShortcut.register('CommandOrControl+Shift+M', () => {
    if (mouseMoveInterval) {
      clearInterval(mouseMoveInterval);
      mouseMoveInterval = null;
      mainWindow?.webContents.send('mover-toggled', false);
    } else {
      mainWindow?.webContents.send('start-mover-from-hotkey');
    }
  });

  // Toggle Keyboard Shortcuts (Cmd+Shift+K)
  globalShortcut.register('CommandOrControl+Shift+K', () => {
    if (keyboardShortcutInterval) {
      clearInterval(keyboardShortcutInterval);
      keyboardShortcutInterval = null;
      mainWindow?.webContents.send('keyboard-toggled', false);
    } else {
      mainWindow?.webContents.send('start-keyboard-from-hotkey');
    }
  });

  // Toggle Random Typing (Cmd+Shift+T)
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (randomTypingInterval) {
      clearTimeout(randomTypingInterval);
      randomTypingInterval = null;
      mainWindow?.webContents.send('typing-toggled', false);
    } else {
      mainWindow?.webContents.send('start-typing-from-hotkey');
    }
  });
}

function stopAllAutomation(): void {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
    autoClickInterval = null;
  }
  if (mouseMoveInterval) {
    clearInterval(mouseMoveInterval);
    mouseMoveInterval = null;
  }
  if (keyboardShortcutInterval) {
    clearInterval(keyboardShortcutInterval);
    keyboardShortcutInterval = null;
  }
  if (randomTypingInterval) {
    clearInterval(randomTypingInterval);
    randomTypingInterval = null;
  }
}

// Auto Clicker
ipcMain.handle('start-auto-click', async (_event: IpcMainInvokeEvent, options: AutoClickOptions): Promise<ApiResponse> => {
  try {
    stopAllAutomation();
    
    const { interval, button } = options;
    
    autoClickInterval = setInterval(() => {
      try {
        // Generate random number of clicks between 1-5 for each interval
        const randomClickCount = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < randomClickCount; i++) {
          robot.mouseClick(button);
          if (randomClickCount > 1) {
            robot.setMouseDelay(50);
          }
        }
      } catch (err) {
        console.error('Click error:', err);
      }
    }, interval);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('stop-auto-click', async (): Promise<ApiResponse> => {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
    autoClickInterval = null;
  }
  return { success: true };
});

// Mouse Mover
ipcMain.handle('start-mouse-move', async (_event: IpcMainInvokeEvent, options: MouseMoveOptions): Promise<ApiResponse> => {
  try {
    stopAllAutomation();
    
    const { pattern, interval, range } = options;
    
    mouseMoveInterval = setInterval(() => {
      try {
        const currentPos = robot.getMousePos();
        let newX: number;
        let newY: number;
        
        switch (pattern) {
          case 'circular':
            const angle = Math.random() * 2 * Math.PI;
            newX = currentPos.x + Math.cos(angle) * range;
            newY = currentPos.y + Math.sin(angle) * range;
            break;
            
          case 'random':
            newX = currentPos.x + (Math.random() - 0.5) * range * 2;
            newY = currentPos.y + (Math.random() - 0.5) * range * 2;
            break;
            
          case 'horizontal':
            const hOffset = (Math.random() - 0.5) * range * 2;
            newX = currentPos.x + hOffset;
            newY = currentPos.y;
            break;
            
          case 'vertical':
            const vOffset = (Math.random() - 0.5) * range * 2;
            newX = currentPos.x;
            newY = currentPos.y + vOffset;
            break;
            
          default:
            return;
        }
        
        robot.moveMouse(Math.round(newX), Math.round(newY));
      } catch (err) {
        console.error('Move error:', err);
      }
    }, interval);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('stop-mouse-move', async (): Promise<ApiResponse> => {
  if (mouseMoveInterval) {
    clearInterval(mouseMoveInterval);
    mouseMoveInterval = null;
  }
  return { success: true };
});

// Swipe Simulation (Fixed to properly drag)
ipcMain.handle('simulate-swipe', async (_event: IpcMainInvokeEvent, options: SwipeOptions): Promise<ApiResponse> => {
  try {
    const { direction, distance } = options;
    const currentPos = robot.getMousePos();
    let targetX: number;
    let targetY: number;
    
    switch (direction) {
      case 'left':
        targetX = currentPos.x - distance;
        targetY = currentPos.y;
        break;
      case 'right':
        targetX = currentPos.x + distance;
        targetY = currentPos.y;
        break;
      case 'up':
        targetX = currentPos.x;
        targetY = currentPos.y - distance;
        break;
      case 'down':
        targetX = currentPos.x;
        targetY = currentPos.y + distance;
        break;
      default:
        return { success: false, error: 'Invalid direction' };
    }
    
    // Press mouse button down
    robot.mouseToggle('down', 'left');
    
    // Smooth drag motion with delays between each step
    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      const intermediateX = currentPos.x + (targetX - currentPos.x) * (i / steps);
      const intermediateY = currentPos.y + (targetY - currentPos.y) * (i / steps);
      robot.moveMouse(Math.round(intermediateX), Math.round(intermediateY));
      
      // Small delay between movements for smooth drag
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    
    // Release mouse button
    robot.mouseToggle('up', 'left');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Scroll Simulation
ipcMain.handle('simulate-scroll', async (_event: IpcMainInvokeEvent, options: ScrollOptions): Promise<ApiResponse> => {
  try {
    const { direction, amount } = options;
    
    // robotjs scrollMouse: positive for down, negative for up
    const scrollAmount = Math.floor(amount / 10);
    
    if (direction === 'up') {
      robot.scrollMouse(0, scrollAmount);
    } else {
      robot.scrollMouse(0, -scrollAmount);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Get current mouse position
ipcMain.handle('get-mouse-position', async (): Promise<MousePositionResponse> => {
  try {
    const pos = robot.getMousePos();
    return { success: true, x: pos.x, y: pos.y };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Keyboard Shortcut Automation
let shortcutIndex = 0;
ipcMain.handle('start-keyboard-shortcut', async (_event: IpcMainInvokeEvent, options: KeyboardShortcutOptions): Promise<ApiResponse> => {
  try {
    stopAllAutomation();
    
    const { keys, interval } = options;
    const shortcutsList = Array.isArray(keys) ? keys : [keys];
    shortcutIndex = 0;
    
    keyboardShortcutInterval = setInterval(async () => {
      try {
        const currentKeys = shortcutsList[shortcutIndex];
        
        // Parse the keys string (e.g., "command+shift+r" or "control+c")
        const keyParts = currentKeys.toLowerCase().split('+').map(k => k.trim());
        
        if (keyParts.length === 1) {
          // Single key
          robot.keyTap(keyParts[0]);
        } else {
          // Key combination (modifiers + key)
          let key = keyParts[keyParts.length - 1];
          let modifiers = keyParts.slice(0, -1);
          
          // Map common key names to robotjs format
          const keyMap: { [key: string]: string } = {
            'arrowright': 'right',
            'arrowleft': 'left',
            'arrowup': 'up',
            'arrowdown': 'down',
            'pageup': 'pageup',
            'pagedown': 'pagedown',
            'delete': 'delete',
            'backspace': 'backspace',
            'enter': 'enter',
            'return': 'enter',
            'tab': 'tab',
            'escape': 'escape',
            'esc': 'escape'
          };
          
          // Map modifiers to robotjs format (macOS specific)
          const modifierMap: { [key: string]: string } = {
            'control': 'control',
            'ctrl': 'control',
            'command': 'command',
            'cmd': 'command',
            'shift': 'shift',
            'option': 'alt',
            'alt': 'alt'
          };
          
          // Apply key mapping
          if (keyMap[key]) {
            key = keyMap[key];
          }
          
          // Apply modifier mapping
          modifiers = modifiers.map(mod => modifierMap[mod] || mod);
          
          // Special handling for desktop switching (Control+Arrow doesn't work via robotjs on macOS)
          const isDesktopSwitch = modifiers.includes('control') && ['left', 'right'].includes(key);
          
          if (isDesktopSwitch && process.platform === 'darwin') {
            // macOS-specific: Use AppleScript for Control+Arrow desktop switching
            const direction = key === 'left' ? 'previous' : 'next';
            const appleScript = `
              tell application "System Events"
                key code ${key === 'left' ? '123' : '124'} using control down
              end tell
            `;
            
            try {
              await execPromise(`osascript -e '${appleScript}'`);
            } catch (err) {
              process.stderr.write(`AppleScript error: ${err}\n`);
              // Fallback to robotjs
              robot.keyTap(key, modifiers);
            }
          } else {
            robot.keyTap(key, modifiers);
          }
        }
        
        // Move to next shortcut in sequence
        shortcutIndex = (shortcutIndex + 1) % shortcutsList.length;
      } catch (err) {
        process.stderr.write(`Keyboard shortcut error: ${err}\n`);
      }
    }, interval);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('stop-keyboard-shortcut', async (): Promise<ApiResponse> => {
  if (keyboardShortcutInterval) {
    clearInterval(keyboardShortcutInterval);
    keyboardShortcutInterval = null;
  }
  return { success: true };
});

// Random Typing
let typingIndex = 0;
ipcMain.handle('start-random-typing', async (_event: IpcMainInvokeEvent, options: RandomTypingOptions): Promise<ApiResponse> => {
  try {
    stopAllAutomation();
    
    const { text, minInterval, maxInterval } = options;
    typingIndex = 0;
    
    const typeNextCharacter = () => {
      if (typingIndex >= text.length) {
        typingIndex = 0; // Loop back to start
      }
      
      try {
        const char = text[typingIndex];
        robot.typeString(char);
        typingIndex++;
        
        // Schedule next character with random interval
        const nextInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        randomTypingInterval = setTimeout(typeNextCharacter, nextInterval);
      } catch (err) {
        console.error('Random typing error:', err);
      }
    };
    
    // Start typing
    typeNextCharacter();
    
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('stop-random-typing', async (): Promise<ApiResponse> => {
  if (randomTypingInterval) {
    clearTimeout(randomTypingInterval);
    randomTypingInterval = null;
  }
  typingIndex = 0;
  return { success: true };
});

// AI Command Execution
ipcMain.handle('execute-ai-command', async (_event: IpcMainInvokeEvent, options: AICommandOptions): Promise<AICommandResponse> => {
  try {
    const { prompt, apiKey } = options;
    
    // Call OpenAI API to convert natural language to commands
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an automation command parser. Convert natural language instructions into a JSON array of automation commands. 

Available command types:
- click: { type: "click", params: { button: "left"|"right", count: number }, description: "..." }
- moveTo: { type: "moveTo", params: { x: number, y: number }, description: "..." }
- move: { type: "move", params: { x: number, y: number }, description: "..." } // relative movement
- type: { type: "type", params: { text: string }, description: "..." }
- keypress: { type: "keypress", params: { key: string, modifiers?: string[] }, description: "..." }
- scroll: { type: "scroll", params: { direction: "up"|"down", amount: number }, description: "..." }
- swipe: { type: "swipe", params: { direction: "left"|"right"|"up"|"down", distance: number }, description: "..." }
- wait: { type: "wait", params: { duration: number }, description: "..." }

For keypresses, modifiers can be: "control", "command", "shift", "alt"
Common keys: "enter", "escape", "tab", "space", "backspace", "delete", arrow keys like "right", "left", "up", "down"

Return ONLY a valid JSON array of commands with no additional text or formatting. Each command must have a description field explaining what it does.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data: any = await response.json();
    const commandsText = data.choices[0].message.content.trim();
    
    // Parse the JSON response
    let commands: CommandSequence[];
    try {
      // Remove markdown code blocks if present
      const cleanedText = commandsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      commands = JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response: ${parseError}`);
    }

    return { success: true, commands };
  } catch (error) {
    console.error('AI Command Error:', error);
    return { success: false, error: (error as Error).message };
  }
});

// Execute Command Sequence
let isLooping = false;
let loopInterval: NodeJS.Timeout | null = null;

ipcMain.handle('execute-command-sequence', async (_event: IpcMainInvokeEvent, commands: CommandSequence[], repeat: boolean = false, loopCount: number = 1, commandDelay: number = 100): Promise<ApiResponse> => {
  try {
    const executeOnce = async () => {
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (!isLooping && repeat) break; // Stop if loop was cancelled
        
        // Wait before executing command (except first command)
        if (i > 0 && commandDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, commandDelay));
        }
        
        // Use process.stdout.write instead of console.log to avoid EPIPE errors
        if (command.description || command.type) {
          process.stdout.write(`Executing: ${command.description || command.type}\n`);
        }
      
      switch (command.type) {
        case 'click':
          const { button = 'left', count = 1 } = command.params || {};
          for (let i = 0; i < count; i++) {
            robot.mouseClick(button);
            if (count > 1) await new Promise(resolve => setTimeout(resolve, 50));
          }
          break;

        case 'moveTo':
          const { x: absX, y: absY } = command.params || {};
          if (absX !== undefined && absY !== undefined) {
            robot.moveMouse(Math.round(absX), Math.round(absY));
          }
          break;

        case 'move':
          const { x: relX, y: relY } = command.params || {};
          if (relX !== undefined && relY !== undefined) {
            const currentPos = robot.getMousePos();
            robot.moveMouse(
              Math.round(currentPos.x + relX),
              Math.round(currentPos.y + relY)
            );
          }
          break;

        case 'type':
          const { text } = command.params || {};
          if (text) {
            robot.typeString(text);
          }
          break;

        case 'keypress':
          const { key, modifiers = [] } = command.params || {};
          if (key) {
            // Map common key names
            const keyMap: { [key: string]: string } = {
              'arrowright': 'right',
              'arrowleft': 'left',
              'arrowup': 'up',
              'arrowdown': 'down',
              'return': 'enter',
              'esc': 'escape'
            };
            
            const modifierMap: { [key: string]: string } = {
              'ctrl': 'control',
              'cmd': 'command',
              'option': 'alt'
            };

            const mappedKey = keyMap[key.toLowerCase()] || key.toLowerCase();
            const mappedModifiers = modifiers.map((mod: string) => 
              modifierMap[mod.toLowerCase()] || mod.toLowerCase()
            );

            // Special handling for Control+Arrow (desktop switching on macOS)
            const isDesktopSwitch = mappedModifiers.includes('control') && ['left', 'right'].includes(mappedKey);
            
            if (isDesktopSwitch && process.platform === 'darwin') {
              // macOS-specific: Use AppleScript for Control+Arrow which robotjs can't handle properly
              const direction = mappedKey === 'left' ? 'previous' : 'next';
              const appleScript = `
                tell application "System Events"
                  key code ${mappedKey === 'left' ? '123' : '124'} using control down
                end tell
              `;
              
              try {
                await execPromise(`osascript -e '${appleScript}'`);
              } catch (err) {
                process.stderr.write(`AppleScript error: ${err}\n`);
                // Fallback to robotjs
                robot.keyTap(mappedKey, mappedModifiers);
              }
            } else {
              robot.keyTap(mappedKey, mappedModifiers);
            }
          }
          break;

        case 'scroll':
          const { direction, amount } = command.params || {};
          if (direction && amount) {
            const scrollAmount = Math.floor(amount / 10);
            if (direction === 'up') {
              robot.scrollMouse(0, scrollAmount);
            } else {
              robot.scrollMouse(0, -scrollAmount);
            }
          }
          break;

        case 'swipe':
          const { direction: swipeDir, distance } = command.params || {};
          if (swipeDir && distance) {
            const currentPos = robot.getMousePos();
            let targetX: number;
            let targetY: number;
            
            switch (swipeDir) {
              case 'left':
                targetX = currentPos.x - distance;
                targetY = currentPos.y;
                break;
              case 'right':
                targetX = currentPos.x + distance;
                targetY = currentPos.y;
                break;
              case 'up':
                targetX = currentPos.x;
                targetY = currentPos.y - distance;
                break;
              case 'down':
                targetX = currentPos.x;
                targetY = currentPos.y + distance;
                break;
              default:
                continue;
            }
            
            robot.mouseToggle('down', 'left');
            const steps = 30;
            for (let i = 1; i <= steps; i++) {
              const intermediateX = currentPos.x + (targetX - currentPos.x) * (i / steps);
              const intermediateY = currentPos.y + (targetY - currentPos.y) * (i / steps);
              robot.moveMouse(Math.round(intermediateX), Math.round(intermediateY));
              await new Promise(resolve => setTimeout(resolve, 5));
            }
            robot.mouseToggle('up', 'left');
          }
          break;

        case 'wait':
          const { duration } = command.params || {};
          if (duration) {
            await new Promise(resolve => setTimeout(resolve, duration));
          }
          break;

        default:
          process.stderr.write(`Unknown command type: ${command.type}\n`);
      }
    }
    };

    if (repeat && loopCount > 1) {
      // Execute multiple times
      for (let i = 0; i < loopCount; i++) {
        await executeOnce();
        if (i < loopCount - 1) {
          // Small delay between loop iterations
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } else if (repeat && loopCount === -1) {
      // Infinite loop
      isLooping = true;
      await executeOnce();
      
      // Continue looping in the background
      const loopCommands = async () => {
        if (!isLooping) return;
        await executeOnce();
        loopInterval = setTimeout(loopCommands, 500);
      };
      loopInterval = setTimeout(loopCommands, 500);
    } else {
      // Single execution
      await executeOnce();
    }

    return { success: true };
  } catch (error) {
    process.stderr.write(`Command Execution Error: ${error}\n`);
    return { success: false, error: (error as Error).message };
  }
});

// Stop Command Loop
ipcMain.handle('stop-command-loop', async (): Promise<ApiResponse> => {
  isLooping = false;
  if (loopInterval) {
    clearTimeout(loopInterval);
    loopInterval = null;
  }
  return { success: true };
});

// Save API Key
ipcMain.handle('save-api-key', async (_event: IpcMainInvokeEvent, apiKey: string): Promise<ApiResponse> => {
  try {
    await fs.writeFile(API_KEY_PATH, apiKey, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Load API Key
ipcMain.handle('load-api-key', async (): Promise<{ success: boolean; apiKey?: string }> => {
  try {
    const apiKey = await fs.readFile(API_KEY_PATH, 'utf-8');
    return { success: true, apiKey: apiKey.trim() };
  } catch (error) {
    // File doesn't exist or can't be read
    return { success: false };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  stopAllAutomation();
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  stopAllAutomation();
  globalShortcut.unregisterAll();
});

