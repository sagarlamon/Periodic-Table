// HTML5 Canvas Animated Bohr Atom & Electron Shell Renderer
export class AtomVisualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.animationFrameId = null;
    this.element = null;
    this.speedMultiplier = 1.0;
    this.activeShellIndex = null;
    this.time = 0;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  setElement(element) {
    this.element = element;
    this.time = 0;
    this.startAnimation();
  }

  setSpeed(speed) {
    this.speedMultiplier = parseFloat(speed);
  }

  highlightShell(shellIndex) {
    this.activeShellIndex = shellIndex;
  }

  startAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const animate = () => {
      this.render();
      this.time += 0.015 * this.speedMultiplier;
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  render() {
    if (!this.ctx || !this.element) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const centerX = w / 2;
    const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);

    ctx.save();
    
    // Draw Nucleus
    const nucleusRadius = Math.min(w, h) * 0.075;
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, 2,
      centerX, centerY, nucleusRadius * 2
    );
    glowGradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    glowGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Nucleus Core
    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // Nucleus Label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${this.element.symbol}`, centerX, centerY - 4);
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Z=${this.element.number}`, centerX, centerY + 8);

    // Draw Shells & Revolving Electrons
    const shells = this.element.shells || [1];
    const maxRadius = Math.min(w, h) * 0.42;
    const minRadius = nucleusRadius * 1.8;
    const numShells = shells.length;
    const radiusStep = (maxRadius - minRadius) / Math.max(numShells, 1);

    const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

    shells.forEach((electronCount, sIdx) => {
      const shellRadius = minRadius + (sIdx + 1) * radiusStep;
      const isHighlighted = this.activeShellIndex === sIdx;

      // Orbit Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isHighlighted ? '#38bdf8' : 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = isHighlighted ? 2 : 1;
      if (!isHighlighted) {
        ctx.setLineDash([3, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Shell Label (K, L, M...)
      const labelAngle = -Math.PI / 4;
      const lx = centerX + Math.cos(labelAngle) * shellRadius;
      const ly = centerY + Math.sin(labelAngle) * shellRadius;
      ctx.fillStyle = isHighlighted ? '#38bdf8' : 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${shellNames[sIdx] || sIdx+1} (${electronCount}e⁻)`, lx + 12, ly);

      // Orbiting Electrons
      const shellSpeed = (1 / (sIdx + 1)) * 0.8;
      const baseAngle = this.time * shellSpeed;

      for (let e = 0; e < electronCount; e++) {
        const electronAngle = baseAngle + (e * (2 * Math.PI / electronCount));
        const ex = centerX + Math.cos(electronAngle) * shellRadius;
        const ey = centerY + Math.sin(electronAngle) * shellRadius;

        // Electron Sphere
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }
}
