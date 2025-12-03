const CONFIG = {
  size: 16,
  fill: 'none',
  stroke: 'var(--color-primary-dark)',
  background: 'var(--color-primary-dark)',
  hover: 'var(--color-stone-500)',
};

export class MapLegendUtil {
  constructor(private trendingIcon: string) {}

  private getStyledIcon(): string {
    return this.trendingIcon
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
        <span class="legend-text">11 hor</span>
      </div>
      <div class="legend-item">
        <span class="legend-icon">${this.getStyledIcon()}</span>
        <span class="legend-text">24 výstupů</span>
      </div>
    `;
  }
}
