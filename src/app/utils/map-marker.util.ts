const CONFIG = {
  size: 18,
  fill: 'none',
  stroke: 'white',
};

export class MapMarkerUtil {
  constructor(private svgContent: string) {}

  public getStyledIcon(): string {
    const svgWithWhiteFill = this.svgContent
      .replace(
        'fill="var(--icon-fill, currentColor)"',
        `fill="${CONFIG.fill}" class="marker-icon-fill"`
      )
      .replace('stroke="var(--icon-stroke, none)"', `stroke="${CONFIG.stroke}"`)
      .replace('width="24"', `width="${CONFIG.size}"`)
      .replace('height="24"', `height="${CONFIG.size}"`);

    return `
      <div class="marker-circle" style="
        width: ${CONFIG.size * 2}px;
        height: ${CONFIG.size * 2}px;
        border-width: ${CONFIG.size / 4}px;
        border-style: solid;
      ">
        ${svgWithWhiteFill}
      </div>
    `;
  }
}
