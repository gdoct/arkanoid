export class InputHandler {
  private keys: Set<string> = new Set();

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key);
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key);
    });
  }

  isLeftPressed(): boolean {
    return this.keys.has('ArrowLeft') || this.keys.has('a');
  }

  isRightPressed(): boolean {
    return this.keys.has('ArrowRight') || this.keys.has('d');
  }

  isLaunchPressed(): boolean {
    return this.keys.has(' ');
  }

  consumeLaunch(): void {
    this.keys.delete(' ');
  }
}
