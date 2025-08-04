import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

interface TableColumn {
  key: string;
  label: string;
  isAction?: boolean;
  isLink?: boolean; // ✅ NEW: supports link cell
  actions?: TableAction[];
}

interface TableAction {
  label?: string;
  icon?: string;
  callback: (row: any) => void;
  tooltip?: string;
  className?: string;
}

@Directive({
  selector: '[libCustomTable]',
  standalone: true
})
export class CustomTableDirective implements OnInit, OnChanges {
  @Input('libCustomTable') data: any[] = [];
  @Input() columns: TableColumn[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.buildTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      this.buildTable();
    }
  }

  private buildTable(): void {
    const host = this.el.nativeElement;
    while (host.firstChild) {
      this.renderer.removeChild(host, host.firstChild);
    }

    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'overflowX', 'auto');
    this.renderer.setStyle(wrapper, 'width', '100%');

    const table = this.renderer.createElement('table');
    this.renderer.setStyle(table, 'width', '100%');
    this.renderer.setStyle(table, 'borderCollapse', 'collapse');
    this.renderer.setStyle(table, 'fontFamily', 'Open Sans, sans-serif');
    this.renderer.setStyle(table, 'fontSize', '14px');
    this.renderer.setStyle(table, 'minWidth', '600px');

    const thead = this.renderer.createElement('thead');
    const tr = this.renderer.createElement('tr');

    this.columns.forEach(col => {
      const th = this.renderer.createElement('th');
      this.renderer.setStyle(th, 'padding', '10px');
      this.renderer.setStyle(th, 'borderBottom', '1px solid #ccc');
      this.renderer.setStyle(th, 'textAlign', 'left');
      this.renderer.setStyle(th, 'whiteSpace', 'nowrap');
      const text = this.renderer.createText(col.label);
      this.renderer.appendChild(th, text);
      this.renderer.appendChild(tr, th);
    });
    this.renderer.appendChild(thead, tr);
    this.renderer.appendChild(table, thead);

    const tbody = this.renderer.createElement('tbody');

    this.data.forEach(row => {
      const tr = this.renderer.createElement('tr');

      this.columns.forEach(col => {
        const td = this.renderer.createElement('td');
        this.renderer.setStyle(td, 'padding', '10px');
        this.renderer.setStyle(td, 'borderBottom', '1px solid #eee');
        this.renderer.setStyle(td, 'whiteSpace', 'nowrap');

        if (col.isAction) {
          const actionWrapper = this.renderer.createElement('div');
          this.renderer.setStyle(actionWrapper, 'display', 'flex');
          this.renderer.setStyle(actionWrapper, 'gap', '6px');

          const actions = row[col.key];

          if (Array.isArray(actions)) {
            actions.forEach(action => {
              const btn = this.renderer.createElement('button');
              this.renderer.setAttribute(btn, 'type', 'button');
              this.renderer.setStyle(btn, 'padding', '5px 10px');
              this.renderer.setStyle(btn, 'fontSize', '13px');
              this.renderer.setStyle(btn, 'border', 'none');
              this.renderer.setStyle(btn, 'borderRadius', '4px');
              this.renderer.setStyle(btn, 'cursor', 'pointer');
              this.renderer.setStyle(btn, 'color', '#fff');
              this.renderer.setStyle(btn, 'backgroundColor', '#00bfff');
              this.renderer.setStyle(btn, 'display', 'flex');
              this.renderer.setStyle(btn, 'alignItems', 'center');
              this.renderer.setStyle(btn, 'gap', '4px');

              if (action.className) {
                this.renderer.setAttribute(btn, 'class', action.className);
              }

              if (action.tooltip) {
                this.renderer.setAttribute(btn, 'title', action.tooltip);
              }

              if (action.icon) {
                const iconSpan = this.renderer.createElement('span');
                this.renderer.appendChild(iconSpan, this.renderer.createText(action.icon));
                this.renderer.appendChild(btn, iconSpan);
              }

              if (action.label) {
                const labelSpan = this.renderer.createElement('span');
                this.renderer.appendChild(labelSpan, this.renderer.createText(action.label));
                this.renderer.appendChild(btn, labelSpan);
              }

              this.renderer.listen(btn, 'click', () => action.callback(row));
              this.renderer.appendChild(actionWrapper, btn);
            });
          }

          this.renderer.appendChild(td, actionWrapper);
        } else if (col.isLink && row[col.key]?.label && typeof row[col.key]?.onClick === 'function') {
          const span = this.renderer.createElement('span');
          this.renderer.setStyle(span, 'color', '#0d6efd');
          this.renderer.setStyle(span, 'cursor', 'pointer');
          this.renderer.setStyle(span, 'textDecoration', 'underline');
          this.renderer.appendChild(span, this.renderer.createText(row[col.key].label));
          this.renderer.listen(span, 'click', () => row[col.key].onClick(row));
          this.renderer.appendChild(td, span);
        } else {
          if (col['isLink'] && row[col.key] && typeof row[col.key] === 'object') {
          const linkData = row[col.key];
          const linkEl = this.renderer.createElement('span');
          this.renderer.setStyle(linkEl, 'color', '#1976d2');
          this.renderer.setStyle(linkEl, 'cursor', 'pointer');
          this.renderer.setStyle(linkEl, 'textDecoration', 'underline');

          if (linkData.tooltip) {
          this.renderer.setAttribute(linkEl, 'title', linkData.tooltip);
          }

          const linkText = this.renderer.createText(linkData.label || '');
          this.renderer.appendChild(linkEl, linkText);

          if (typeof linkData.callback === 'function') {
          this.renderer.listen(linkEl, 'click', () => linkData.callback());
          }

          this.renderer.appendChild(td, linkEl);
          } else {
          const text = this.renderer.createText(row[col.key] ?? '');
          this.renderer.appendChild(td, text);
          }

        }

        this.renderer.appendChild(tr, td);
      });

      this.renderer.appendChild(tbody, tr);
    });

    this.renderer.appendChild(table, tbody);
    this.renderer.appendChild(wrapper, table);
    this.renderer.appendChild(host, wrapper);
  }
}
