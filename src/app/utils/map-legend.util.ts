const CONFIG = {
  size: 16,
  fill: 'none',
  stroke: 'var(--color-primary-dark)',
  background: 'var(--color-primary-dark)',
  hover: 'var(--color-stone-500)',
};

type Params = {
  icon: string;
  mountainCount: number;
  climbCount: number;
};

export class MapLegendUtil {
  constructor(private params: Params) {}

  private getStyledIcon(): string {
    return this.params.icon
      .replace(
        'fill="var(--icon-fill, currentColor)"',
        `fill="${CONFIG.fill}" class="marker-icon-fill"`
      )
      .replace('stroke="var(--icon-stroke, none)"', `stroke="${CONFIG.stroke}"`)
      .replace('width="24"', `width="${CONFIG.size}"`)
      .replace('height="24"', `height="${CONFIG.size}"`);
  }

  public getHtml(): string {
    return `
      <div class="legend-item">
        <span class="legend-dot"></span>
        <span class="legend-text">${this.params.mountainCount} hor</span>
      </div>
      <div class="legend-item">
        <span class="legend-icon">${this.getStyledIcon()}</span>
        <span class="legend-text">${this.params.climbCount} výstupů</span>
      </div>
    `;
  }
}
