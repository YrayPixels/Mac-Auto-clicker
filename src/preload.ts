import { contextBridge, ipcRenderer } from 'electron';
import { AutoClickOptions, MouseMoveOptions, SwipeOptions, ScrollOptions, KeyboardShortcutOptions, RandomTypingOptions, ApiResponse, MousePositionResponse, AICommandOptions, AICommandResponse, CommandSequence } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
  startAutoClick: (options: AutoClickOptions): Promise<ApiResponse> => 
    ipcRenderer.invoke('start-auto-click', options),
  
  stopAutoClick: (): Promise<ApiResponse> => 
    ipcRenderer.invoke('stop-auto-click'),
  
  startMouseMove: (options: MouseMoveOptions): Promise<ApiResponse> => 
    ipcRenderer.invoke('start-mouse-move', options),
  
  stopMouseMove: (): Promise<ApiResponse> => 
    ipcRenderer.invoke('stop-mouse-move'),
  
  simulateSwipe: (options: SwipeOptions): Promise<ApiResponse> => 
    ipcRenderer.invoke('simulate-swipe', options),
  
  simulateScroll: (options: ScrollOptions): Promise<ApiResponse> => 
    ipcRenderer.invoke('simulate-scroll', options),
  
  getMousePosition: (): Promise<MousePositionResponse> => 
    ipcRenderer.invoke('get-mouse-position'),
  
  startKeyboardShortcut: (options: KeyboardShortcutOptions): Promise<ApiResponse> =>
    ipcRenderer.invoke('start-keyboard-shortcut', options),
  
  stopKeyboardShortcut: (): Promise<ApiResponse> =>
    ipcRenderer.invoke('stop-keyboard-shortcut'),
  
  startRandomTyping: (options: RandomTypingOptions): Promise<ApiResponse> =>
    ipcRenderer.invoke('start-random-typing', options),
  
  stopRandomTyping: (): Promise<ApiResponse> =>
    ipcRenderer.invoke('stop-random-typing'),
  
  executeAICommand: (options: AICommandOptions): Promise<AICommandResponse> =>
    ipcRenderer.invoke('execute-ai-command', options),
  
  executeCommandSequence: (commands: CommandSequence[], repeat?: boolean, loopCount?: number, commandDelay?: number): Promise<ApiResponse> =>
    ipcRenderer.invoke('execute-command-sequence', commands, repeat, loopCount, commandDelay),
  
  stopCommandLoop: (): Promise<ApiResponse> =>
    ipcRenderer.invoke('stop-command-loop'),
  
  saveApiKey: (apiKey: string): Promise<ApiResponse> =>
    ipcRenderer.invoke('save-api-key', apiKey),
  
  loadApiKey: (): Promise<{ success: boolean; apiKey?: string }> =>
    ipcRenderer.invoke('load-api-key'),
  
  onAutomationStopped: (callback: () => void): void => {
    ipcRenderer.on('automation-stopped', callback);
  },

  // Hotkey event listeners
  onStartClickerFromHotkey: (callback: () => void): void => {
    ipcRenderer.on('start-clicker-from-hotkey', callback);
  },
  
  onClickerToggled: (callback: (isActive: boolean) => void): void => {
    ipcRenderer.on('clicker-toggled', (_event, isActive) => callback(isActive));
  },

  onStartMoverFromHotkey: (callback: () => void): void => {
    ipcRenderer.on('start-mover-from-hotkey', callback);
  },
  
  onMoverToggled: (callback: (isActive: boolean) => void): void => {
    ipcRenderer.on('mover-toggled', (_event, isActive) => callback(isActive));
  },

  onStartKeyboardFromHotkey: (callback: () => void): void => {
    ipcRenderer.on('start-keyboard-from-hotkey', callback);
  },
  
  onKeyboardToggled: (callback: (isActive: boolean) => void): void => {
    ipcRenderer.on('keyboard-toggled', (_event, isActive) => callback(isActive));
  },

  onStartTypingFromHotkey: (callback: () => void): void => {
    ipcRenderer.on('start-typing-from-hotkey', callback);
  },
  
  onTypingToggled: (callback: (isActive: boolean) => void): void => {
    ipcRenderer.on('typing-toggled', (_event, isActive) => callback(isActive));
  }
});

