import { Menu } from '../structures';
export interface IContextMenuHandler {
  setContextMenu(obj: Menu | any[]): void;
  resetContextMenu(): void;
}
