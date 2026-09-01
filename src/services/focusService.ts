export class FocusService {
  private focusableSelector = 'button, [role="button"], a, input, textarea, select, [tabindex]:not([tabindex="-1"])';
  private focusRing = document.createElement('div');
  private currentFocus: HTMLElement | null = null;

  constructor() {
    this.focusRing.className = 'focus-ring';
    this.focusRing.style.cssText = `
      position: fixed;
      border: 3px solid var(--color-accent, #00b4ff);
      border-radius: 4px;
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.15s ease;
    `;
    document.body.appendChild(this.focusRing);
  }

  registerFocusable(element: HTMLElement): void {
    element.addEventListener('focus', () => this.updateFocusRing(element));
    element.addEventListener('blur', () => this.hideFocusRing());
  }

  private updateFocusRing(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    this.focusRing.style.cssText = `
      position: fixed;
      top: ${rect.top - 3}px;
      left: ${rect.left - 3}px;
      width: ${rect.width + 6}px;
      height: ${rect.height + 6}px;
      border: 3px solid var(--color-accent, #00b4ff);
      border-radius: 4px;
      pointer-events: none;
      z-index: 10000;
      opacity: 1;
      transition: opacity 0.15s ease;
    `;
    this.currentFocus = element;
  }

  private hideFocusRing(): void {
    this.focusRing.style.opacity = '0';
    this.currentFocus = null;
  }

  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(this.focusableSelector)
    );
  }

  getCurrentFocus(): HTMLElement | null {
    return this.currentFocus || document.activeElement as HTMLElement;
  }

  setFocus(element: HTMLElement | null): void {
    if (element) {
      element.focus();
    }
  }

  focusNext(container: HTMLElement = document.body): void {
    const focusables = this.getFocusableElements(container);
    if (focusables.length === 0) return;

    const current = this.getCurrentFocus();
    const currentIndex = focusables.indexOf(current as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusables.length;

    this.setFocus(focusables[nextIndex]);
  }

  focusPrevious(container: HTMLElement = document.body): void {
    const focusables = this.getFocusableElements(container);
    if (focusables.length === 0) return;

    const current = this.getCurrentFocus();
    const currentIndex = focusables.indexOf(current as HTMLElement);
    const prevIndex = (currentIndex - 1 + focusables.length) % focusables.length;

    this.setFocus(focusables[prevIndex]);
  }

  restoreFocus(key: string): void {
    try {
      const element = document.querySelector(`[data-focus-key="${key}"]`) as HTMLElement;
      if (element) {
        this.setFocus(element);
      }
    } catch (error) {
      console.error('Failed to restore focus:', error);
    }
  }

  saveFocus(element: HTMLElement, key: string): void {
    element.setAttribute('data-focus-key', key);
  }
}

export const focusService = new FocusService();
