export interface AutoClickOptions {
  interval: number;
  button: 'left' | 'right';
  clickCount: number;
}

export interface MouseMoveOptions {
  pattern: 'circular' | 'random' | 'horizontal' | 'vertical';
  interval: number;
  range: number;
}

export interface SwipeOptions {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
}

export interface ScrollOptions {
  direction: 'up' | 'down';
  amount: number;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}

export interface MousePositionResponse extends ApiResponse {
  x?: number;
  y?: number;
}

export interface KeyboardShortcutOptions {
  keys: string | string[];
  interval: number;
}

export interface RandomTypingOptions {
  text: string;
  minInterval: number;
  maxInterval: number;
}

export interface AICommandOptions {
  prompt: string;
  apiKey: string;
}

export interface CommandSequence {
  type: 'click' | 'move' | 'moveTo' | 'type' | 'keypress' | 'scroll' | 'swipe' | 'wait';
  params?: any;
  description?: string;
}

export interface AICommandResponse extends ApiResponse {
  commands?: CommandSequence[];
}

export interface ElectronAPI {
  startAutoClick: (options: AutoClickOptions) => Promise<ApiResponse>;
  stopAutoClick: () => Promise<ApiResponse>;
  startMouseMove: (options: MouseMoveOptions) => Promise<ApiResponse>;
  stopMouseMove: () => Promise<ApiResponse>;
  simulateSwipe: (options: SwipeOptions) => Promise<ApiResponse>;
  simulateScroll: (options: ScrollOptions) => Promise<ApiResponse>;
  getMousePosition: () => Promise<MousePositionResponse>;
  startKeyboardShortcut: (options: KeyboardShortcutOptions) => Promise<ApiResponse>;
  stopKeyboardShortcut: () => Promise<ApiResponse>;
  startRandomTyping: (options: RandomTypingOptions) => Promise<ApiResponse>;
  stopRandomTyping: () => Promise<ApiResponse>;
  executeAICommand: (options: AICommandOptions) => Promise<AICommandResponse>;
  executeCommandSequence: (commands: CommandSequence[], repeat?: boolean, loopCount?: number, commandDelay?: number) => Promise<ApiResponse>;
  stopCommandLoop: () => Promise<ApiResponse>;
  saveApiKey: (apiKey: string) => Promise<ApiResponse>;
  loadApiKey: () => Promise<{ success: boolean; apiKey?: string }>;
  onAutomationStopped: (callback: () => void) => void;
  onStartClickerFromHotkey: (callback: () => void) => void;
  onClickerToggled: (callback: (isActive: boolean) => void) => void;
  onStartMoverFromHotkey: (callback: () => void) => void;
  onMoverToggled: (callback: (isActive: boolean) => void) => void;
  onStartKeyboardFromHotkey: (callback: () => void) => void;
  onKeyboardToggled: (callback: (isActive: boolean) => void) => void;
  onStartTypingFromHotkey: (callback: () => void) => void;
  onTypingToggled: (callback: (isActive: boolean) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

