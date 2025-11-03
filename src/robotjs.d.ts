// Type definitions for robotjs
declare module '@jitsi/robotjs' {
  export interface Point {
    x: number;
    y: number;
  }

  export interface Size {
    width: number;
    height: number;
  }

  // Mouse functions
  export function moveMouse(x: number, y: number): void;
  export function moveMouseSmooth(x: number, y: number): void;
  export function mouseClick(button?: string, double?: boolean): void;
  export function mouseToggle(down?: string, button?: string): void;
  export function getMousePos(): Point;
  export function scrollMouse(x: number, y: number): void;
  export function setMouseDelay(delay: number): void;

  // Keyboard functions
  export function keyTap(key: string, modifier?: string | string[]): void;
  export function keyToggle(key: string, down: string, modifier?: string | string[]): void;
  export function typeString(string: string): void;
  export function typeStringDelayed(string: string, cpm: number): void;

  // Screen functions
  export function getPixelColor(x: number, y: number): string;
  export function getScreenSize(): Size;
  export const screen: {
    capture(x?: number, y?: number, width?: number, height?: number): any;
  };
}

