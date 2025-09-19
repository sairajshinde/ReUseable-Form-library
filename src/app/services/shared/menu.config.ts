
import { inject } from '@angular/core';
import { CommonService } from './common.service';
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
let isProcessor = false; // default
let cachedMenu: MenuItem[] = []; // keep last generated menu

export function setPopupService(service: PopupService) {
  popupServiceRef = service;
  cachedMenu = buildMenu();
}

export function setProcessorRole(value: boolean) {
  isProcessor = value;
  console.log('Processor role set to:', isProcessor);
  cachedMenu = buildMenu(); // rebuild menu when role changes
}

export function initMenu(common: CommonService) {
  isProcessor = !!common.getProcessorRole();
  cachedMenu = buildMenu();
}

export function getSharedMenu(): MenuItem[] {
  // if no cached menu, build it once
  if (!cachedMenu.length) {
    cachedMenu = buildMenu();
  }
  return cachedMenu;
}

function buildMenu(): MenuItem[] {
  
  const baseMenu: MenuItem[] = [
    {
      label: 'NEW SCHOLARSHIP',
      route: '/new-scholarship'
    },
    {
      label: 'CHECK STATUS',
      route: '/check-status'
    }
  ];

  if (isProcessor) {
    baseMenu.push(
      { label: 'PROCESS', route: '/process' },
      { label: 'VIEW SHORTLISTED', route: '/view-short-list' }
    );
  }

  // Always keep info at the end
  baseMenu.push({
    label: '',
    icon: 'ℹ️',
    tooltip: 'Additional Info',
    onClick: () => popupServiceRef?.triggerPopup()
  });

  return baseMenu;
}

