import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  onClick?: () => void;
  children?: MenuItem[];
  tooltip?: string;
}

@Directive({
  selector: '[libMenuBar]',
  standalone: true
})
export class MenuBarDirective implements OnInit, OnChanges, OnDestroy {
  @Input('libMenuBar') config: ['left' | 'right', MenuItem[]] = ['left', []];
  currentUrl: string = '';
  private routerSub!: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.buildMenuBar();

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentUrl = e.urlAfterRedirects;
        this.buildMenuBar();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.buildMenuBar();
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private buildMenuBar(): void {
    const host = this.el.nativeElement;
    const [position, menuItems] = this.config;

    while (host.firstChild) {
      this.renderer.removeChild(host, host.firstChild);
    }

    const nav = this.renderer.createElement('nav');
    this.renderer.setStyle(nav, 'display', 'flex');
    this.renderer.setStyle(nav, 'align-items', 'center');
    this.renderer.setStyle(nav, 'justify-content', position === 'right' ? 'flex-end' : 'flex-start');
    this.renderer.setStyle(nav, 'padding', '0 20px');
    this.renderer.setStyle(nav, 'background', '#fff');
    this.renderer.setStyle(nav, 'border-bottom', '1px solid #e6e6e6');
    this.renderer.setStyle(nav, 'width', '100%');
    this.renderer.setStyle(nav, 'box-sizing', 'border-box');
    this.renderer.setStyle(nav, 'position', 'static');
    this.renderer.setAttribute(nav, 'class', 'menu-nav');

    const toggle = this.renderer.createElement('div');
    this.renderer.setStyle(toggle, 'display', 'none');
    this.renderer.setStyle(toggle, 'flex-direction', 'column');
    this.renderer.setStyle(toggle, 'cursor', 'pointer');
    this.renderer.setStyle(toggle, 'margin-left', 'auto');
    this.renderer.setAttribute(toggle, 'class', 'menu-toggle');

    for (let i = 0; i < 3; i++) {
      const bar = this.renderer.createElement('span');
      this.renderer.setStyle(bar, 'width', '25px');
      this.renderer.setStyle(bar, 'height', '3px');
      this.renderer.setStyle(bar, 'background', '#000');
      this.renderer.setStyle(bar, 'margin', '3px 0');
      this.renderer.appendChild(toggle, bar);
    }

    const menuContainer = this.renderer.createElement('div');
    this.renderer.setStyle(menuContainer, 'display', 'flex');
    this.renderer.setStyle(menuContainer, 'gap', '20px');
    this.renderer.setStyle(menuContainer, 'align-items', 'center');
    this.renderer.setStyle(menuContainer, 'flex-wrap', 'wrap');
    this.renderer.setAttribute(menuContainer, 'class', 'menu-container');

    menuItems.forEach(item => {
      this.createMenuItem(menuContainer, item);
    });

    const style = this.renderer.createElement('style');
    const styles = `
  @media (max-width: 768px) {
  .menu-nav{
  position: relative !important;
  }
    .menu-toggle {
      display: flex !important;
      margin-bottom: 10px;
    }
    .menu-container {
      display: none !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      ${position === 'right' ? 'right: 0;' : 'left: 0;'}
      background: #fff;
      width: max-content;
      min-width: 200px;
      z-index: 1000;
      max-height: 60vh;
      overflow-y: auto;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 10px 0;
      border-radius: 4px;
    }
    .menu-container.show {
      display: flex !important;
      gap: 6px !important;
    }
  }
`;

    this.renderer.appendChild(style, this.renderer.createText(styles));

    this.renderer.listen(toggle, 'click', () => {
      const isShown = menuContainer.classList.contains('show');
      if (isShown) {
        this.renderer.removeClass(menuContainer, 'show');
      } else {
        this.renderer.addClass(menuContainer, 'show');
      }
    });

    this.renderer.appendChild(nav, toggle);
    this.renderer.appendChild(nav, menuContainer);
    this.renderer.appendChild(host, nav);
    this.renderer.appendChild(host, style);
  }

  private createMenuItem(container: HTMLElement, item: MenuItem): void {
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'relative');
    this.renderer.setStyle(wrapper, 'display', 'flex');
    this.renderer.setStyle(wrapper, 'flex-direction', 'column');
    this.renderer.setStyle(wrapper, 'align-items', 'center');
    this.renderer.setStyle(wrapper, 'padding', '10px 10px 0');
    this.renderer.setStyle(wrapper, 'justify-content', 'center');
    this.renderer.setStyle(wrapper, 'cursor', 'pointer');
    if (item.tooltip) {
      this.renderer.setAttribute(wrapper, 'title', item.tooltip);
    }

    const span = this.renderer.createElement('span');
    this.renderer.setStyle(span, 'font-size', '13px');
    this.renderer.setStyle(span, 'font-weight', '500');
    this.renderer.setStyle(span, 'display', 'flex');
    this.renderer.setStyle(span, 'align-items', 'center');
    this.renderer.setStyle(span, 'gap', '6px');
    this.renderer.setStyle(span, 'transition', 'color 0.2s ease-in-out');

    const isActive = item.route && this.currentUrl === item.route;
    this.renderer.setStyle(span, 'color', isActive ? '#000' : '#999');

    if (item.icon) {
      const icon = this.renderer.createElement('span');
      if (item.icon.includes('fa')) {
        item.icon.split(' ').forEach(cls => this.renderer.addClass(icon, cls));
      } else {
        this.renderer.appendChild(icon, this.renderer.createText(item.icon));
      }
      this.renderer.setStyle(icon, 'font-size', '14px');
      this.renderer.setStyle(icon, 'line-height', '1');
      this.renderer.appendChild(span, icon);
    }

    if (item.label) {
      const text = this.renderer.createText(item.label);
      this.renderer.appendChild(span, text);
    }

    const underline = this.renderer.createElement('div');
    this.renderer.setStyle(underline, 'height', '4px');
    this.renderer.setStyle(underline, 'width', isActive ? '100%' : '0');
    this.renderer.setStyle(underline, 'background', '#2ec6ff');
    this.renderer.setStyle(underline, 'transition', 'width 0.3s ease');
    this.renderer.setStyle(underline, 'margin-top', '13px');

    this.renderer.appendChild(wrapper, span);
    this.renderer.appendChild(wrapper, underline);

    this.renderer.listen(wrapper, 'click', () => {
      if (item.onClick) {
        item.onClick();
      } else if (item.route) {
        this.router.navigateByUrl(item.route);
      }
    });

    this.renderer.listen(wrapper, 'mouseenter', () => {
      if (!isActive) this.renderer.setStyle(underline, 'width', '100%');
    });
    this.renderer.listen(wrapper, 'mouseleave', () => {
      if (!isActive) this.renderer.setStyle(underline, 'width', '0');
    });

    if (item.children && item.children.length > 0) {
      const submenu = this.renderer.createElement('div');
      this.renderer.setStyle(submenu, 'position', 'absolute');
      this.renderer.setStyle(submenu, 'top', '100%');
      this.renderer.setStyle(submenu, 'left', '0');
      this.renderer.setStyle(submenu, 'background', '#fff');
      this.renderer.setStyle(submenu, 'padding', '10px');
      this.renderer.setStyle(submenu, 'box-shadow', '0 2px 8px rgba(0,0,0,0.1)');
      this.renderer.setStyle(submenu, 'display', 'none');
      this.renderer.setStyle(submenu, 'flex-direction', 'column');
      this.renderer.setStyle(submenu, 'gap', '8px');
      this.renderer.setStyle(submenu, 'z-index', '10');

      item.children.forEach(child => this.createMenuItem(submenu, child));
      this.renderer.appendChild(wrapper, submenu);

      this.renderer.listen(wrapper, 'mouseenter', () => {
        this.renderer.setStyle(submenu, 'display', 'flex');
      });
      this.renderer.listen(wrapper, 'mouseleave', () => {
        this.renderer.setStyle(submenu, 'display', 'none');
      });
    }

    this.renderer.appendChild(container, wrapper);
  }
}
