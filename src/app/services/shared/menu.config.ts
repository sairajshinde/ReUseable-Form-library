
import { PopupService } from './popup.service';

export interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  tooltip?: string;
  onClick?: () => void;
  children?: MenuItem[];
}

let popupServiceRef: PopupService | null = null;
export function setPopupService(service: PopupService) {
  popupServiceRef = service;
}

export function getSharedMenu(): MenuItem[] {
  return [
    {
      label: 'NEW SCHOLARSHIP',
      route: '/new-scholarship'
    },
    {
      label: 'CHECK STATUS',
      route: '/check-status'
    },
    {
      label: '',
      icon: 'ℹ️',
      tooltip: 'Additional Info',
      onClick: () => popupServiceRef?.triggerPopup()
    }
  ];
}