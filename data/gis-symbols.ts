/**
 * Professional offshore GIS symbols (SVG-based)
 * Used by MapLibre as image layers for installation markers
 */

/**
 * Create SVG symbol for MapLibre image layer
 * Returns DataURL that can be used as icon-image
 */
function createSVGSymbol(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Fixed Platform — vertical structure with legs
 */
export const platformFixedSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Jacket legs -->
  <line x1="8" y1="16" x2="6" y2="28" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="16" x2="26" y2="28" stroke="#888" stroke-width="1.5"/>
  <!-- Platform deck -->
  <rect x="8" y="12" width="16" height="4" fill="#2ecc71" stroke="#fff" stroke-width="1"/>
  <!-- Drilling derrick -->
  <line x1="16" y1="12" x2="16" y2="2" stroke="#555" stroke-width="1.5"/>
  <polygon points="12,8 16,4 20,8" fill="none" stroke="#555" stroke-width="1"/>
</svg>
`;

/**
 * Production Platform — similar to fixed but with production equipment
 */
export const platformProductionSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Jacket legs -->
  <line x1="8" y1="16" x2="6" y2="28" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="16" x2="26" y2="28" stroke="#888" stroke-width="1.5"/>
  <!-- Platform deck -->
  <rect x="8" y="12" width="16" height="4" fill="#f39c12" stroke="#fff" stroke-width="1"/>
  <!-- Processing equipment (cylinders) -->
  <circle cx="14" cy="10" r="2" fill="#f39c12" stroke="#fff" stroke-width="0.5"/>
  <circle cx="18" cy="10" r="2" fill="#f39c12" stroke="#fff" stroke-width="0.5"/>
  <!-- Flare stack -->
  <line x1="16" y1="12" x2="16" y2="2" stroke="#ff6347" stroke-width="1.5"/>
  <line x1="15" y1="3" x2="17" y2="3" stroke="#ff6347" stroke-width="1"/>
</svg>
`;

/**
 * Drilling Platform — emphasizes drilling equipment
 */
export const platformDrillingJackupSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Derrick tower -->
  <rect x="14" y="6" width="4" height="20" fill="#8b4513" stroke="#fff" stroke-width="1"/>
  <!-- Derrick top -->
  <polygon points="16,6 12,2 20,2" fill="#8b4513" stroke="#fff" stroke-width="1"/>
  <!-- Sub-structure -->
  <rect x="8" y="22" width="16" height="2" fill="#666" stroke="#fff" stroke-width="0.5"/>
  <!-- Support legs -->
  <line x1="8" y1="24" x2="6" y2="30" stroke="#888" stroke-width="1"/>
  <line x1="24" y1="24" x2="26" y2="30" stroke="#888" stroke-width="1"/>
</svg>
`;

/**
 * Jack-up Rig — barge with legs extended
 */
export const jackupRigSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Hull -->
  <rect x="8" y="12" width="16" height="6" fill="#3498db" stroke="#fff" stroke-width="1" rx="1"/>
  <!-- Derrick -->
  <line x1="16" y1="12" x2="16" y2="2" stroke="#555" stroke-width="2"/>
  <polygon points="16,2 13,6 19,6" fill="#555" stroke="#fff" stroke-width="0.5"/>
  <!-- Legs extended down -->
  <line x1="10" y1="18" x2="10" y2="28" stroke="#888" stroke-width="1.5"/>
  <line x1="22" y1="18" x2="22" y2="28" stroke="#888" stroke-width="1.5"/>
  <circle cx="10" cy="28" r="1.5" fill="#888"/>
  <circle cx="22" cy="28" r="1.5" fill="#888"/>
</svg>
`;

/**
 * Semi-submersible — floating vessel with columns
 */
export const semisubmersibleSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Pontoons -->
  <ellipse cx="10" cy="18" rx="3" ry="2.5" fill="#3498db" stroke="#fff" stroke-width="0.5"/>
  <ellipse cx="22" cy="18" rx="3" ry="2.5" fill="#3498db" stroke="#fff" stroke-width="0.5"/>
  <!-- Deck -->
  <rect x="8" y="12" width="16" height="4" fill="#9b59b6" stroke="#fff" stroke-width="1"/>
  <!-- Columns connecting deck to pontoons -->
  <line x1="10" y1="16" x2="10" y2="20" stroke="#666" stroke-width="1"/>
  <line x1="22" y1="16" x2="22" y2="20" stroke="#666" stroke-width="1"/>
  <!-- Derrick -->
  <line x1="16" y1="12" x2="16" y2="2" stroke="#555" stroke-width="1.5"/>
</svg>
`;

/**
 * FPSO (Floating Production Storage Offloading) — ship-shaped vessel
 */
export const fpsoPSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Hull -->
  <ellipse cx="16" cy="18" rx="10" ry="5" fill="#e74c3c" stroke="#fff" stroke-width="1"/>
  <!-- Bow -->
  <polygon points="6,18 2,16 2,20" fill="#e74c3c" stroke="#fff" stroke-width="0.5"/>
  <!-- Superstructure -->
  <rect x="12" y="10" width="8" height="5" fill="#c0392b" stroke="#fff" stroke-width="1" rx="1"/>
  <!-- Chimney/Flare stack -->
  <line x1="14" y1="10" x2="14" y2="2" stroke="#ff6347" stroke-width="1.5"/>
  <circle cx="14" cy="2" r="1" fill="#ff6347"/>
</svg>
`;

/**
 * FSO (Floating Storage Offloading) — similar to FPSO, no production
 */
export const fsoSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Hull -->
  <ellipse cx="16" cy="18" rx="10" ry="5" fill="#1abc9c" stroke="#fff" stroke-width="1"/>
  <!-- Bow -->
  <polygon points="6,18 2,16 2,20" fill="#1abc9c" stroke="#fff" stroke-width="0.5"/>
  <!-- Superstructure (simpler than FPSO) -->
  <rect x="12" y="10" width="8" height="4" fill="#16a085" stroke="#fff" stroke-width="1" rx="1"/>
  <!-- Loading boom -->
  <line x1="18" y1="12" x2="26" y2="12" stroke="#888" stroke-width="1.5"/>
</svg>
`;

/**
 * FLNG (Floating Liquefied Natural Gas) — specialized LNG carrier
 */
export const flngSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Hull -->
  <ellipse cx="16" cy="18" rx="10" ry="5" fill="#2980b9" stroke="#fff" stroke-width="1"/>
  <!-- Bow -->
  <polygon points="6,18 2,16 2,20" fill="#2980b9" stroke="#fff" stroke-width="0.5"/>
  <!-- LNG cargo tanks (rectangular on deck) -->
  <rect x="10" y="8" width="3" height="5" fill="#3498db" stroke="#fff" stroke-width="0.5"/>
  <rect x="19" y="8" width="3" height="5" fill="#3498db" stroke="#fff" stroke-width="0.5"/>
  <!-- Chimney -->
  <line x1="16" y1="8" x2="16" y2="2" stroke="#555" stroke-width="1.5"/>
</svg>
`;

/**
 * Well marker — small dot with circle
 */
export const wellSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="16" cy="16" r="8" fill="none" stroke="#e74c3c" stroke-width="1.5"/>
  <circle cx="16" cy="16" r="4" fill="#e74c3c" stroke="#fff" stroke-width="1"/>
  <circle cx="16" cy="16" r="2" fill="#fff"/>
</svg>
`;

/**
 * Subsea Manifold — subsea equipment symbol
 */
export const subseaManifoldSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Manifold body -->
  <rect x="8" y="12" width="16" height="8" fill="#7f8c8d" stroke="#fff" stroke-width="1" rx="2"/>
  <!-- Connection ports -->
  <circle cx="10" cy="16" r="1.5" fill="#fff" stroke="#7f8c8d" stroke-width="0.5"/>
  <circle cx="22" cy="16" r="1.5" fill="#fff" stroke="#7f8c8d" stroke-width="0.5"/>
  <circle cx="16" cy="12" r="1.5" fill="#fff" stroke="#7f8c8d" stroke-width="0.5"/>
  <circle cx="16" cy="20" r="1.5" fill="#fff" stroke="#7f8c8d" stroke-width="0.5"/>
  <!-- Center connection -->
  <circle cx="16" cy="16" r="1" fill="#3498db"/>
</svg>
`;

/**
 * SPM (Single Point Mooring) — buoy symbol
 */
export const spmSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Buoy ball -->
  <circle cx="16" cy="16" r="7" fill="#f39c12" stroke="#fff" stroke-width="1.5"/>
  <!-- Mooring line down -->
  <line x1="16" y1="23" x2="16" y2="30" stroke="#888" stroke-width="1.5"/>
  <!-- Horizontal yoke -->
  <line x1="10" y1="16" x2="22" y2="16" stroke="#888" stroke-width="1"/>
  <!-- Equipment above -->
  <rect x="14" y="6" width="4" height="6" fill="#daa520" stroke="#fff" stroke-width="0.5"/>
</svg>
`;

/**
 * Wind Turbine — vertical tower with blades
 */
export const windTurbineSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Tower -->
  <rect x="14" y="14" width="4" height="14" fill="#95a5a6" stroke="#fff" stroke-width="0.5"/>
  <!-- Nacelle -->
  <ellipse cx="16" cy="14" rx="3" ry="2" fill="#34495e" stroke="#fff" stroke-width="0.5"/>
  <!-- Rotor (three blades) -->
  <line x1="16" y1="14" x2="16" y2="4" stroke="#7f8c8d" stroke-width="1.5"/>
  <line x1="16" y1="14" x2="22" y2="10" stroke="#7f8c8d" stroke-width="1.5"/>
  <line x1="16" y1="14" x2="10" y2="10" stroke="#7f8c8d" stroke-width="1.5"/>
  <!-- Blade tips -->
  <circle cx="16" cy="4" r="1" fill="#7f8c8d"/>
  <circle cx="22" cy="10" r="1" fill="#7f8c8d"/>
  <circle cx="10" cy="10" r="1" fill="#7f8c8d"/>
</svg>
`;

/**
 * Offshore Terminal — dock/pier symbol
 */
export const terminalSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Pier deck -->
  <rect x="6" y="14" width="20" height="4" fill="#d4a574" stroke="#fff" stroke-width="1"/>
  <!-- Support pilings -->
  <rect x="8" y="18" width="1.5" height="10" fill="#888"/>
  <rect x="16" y="18" width="1.5" height="10" fill="#888"/>
  <rect x="24" y="18" width="1.5" height="10" fill="#888"/>
  <!-- Cargo handling equipment -->
  <line x1="16" y1="14" x2="16" y2="4" stroke="#555" stroke-width="1"/>
  <line x1="12" y1="6" x2="20" y2="6" stroke="#555" stroke-width="1"/>
</svg>
`;

/**
 * Port anchor marker
 */
export const portSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Anchor shank -->
  <line x1="16" y1="4" x2="16" y2="20" stroke="#34495e" stroke-width="2"/>
  <!-- Anchor flukes -->
  <line x1="16" y1="20" x2="10" y2="26" stroke="#34495e" stroke-width="2"/>
  <line x1="16" y1="20" x2="22" y2="26" stroke="#34495e" stroke-width="2"/>
  <!-- Anchor ring -->
  <circle cx="16" cy="4" r="2" fill="#34495e" stroke="#fff" stroke-width="0.5"/>
</svg>
`;

/**
 * Offshore Substation — electrical equipment
 */
export const offshoreSubstationSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Platform deck -->
  <rect x="8" y="14" width="16" height="4" fill="#ffff00" stroke="#fff" stroke-width="1"/>
  <!-- Transformer/Equipment boxes -->
  <rect x="10" y="8" width="4" height="6" fill="#ff6347" stroke="#fff" stroke-width="0.5"/>
  <rect x="18" y="8" width="4" height="6" fill="#ff6347" stroke="#fff" stroke-width="0.5"/>
  <!-- Electrical tower -->
  <line x1="16" y1="14" x2="16" y2="2" stroke="#555" stroke-width="1.5"/>
  <line x1="12" y1="4" x2="20" y2="4" stroke="#ffff00" stroke-width="1"/>
</svg>
`;

/**
 * Generic Installation fallback
 */
export const genericInstallationSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <!-- Platform -->
  <rect x="8" y="16" width="16" height="3" fill="#9b59b6" stroke="#fff" stroke-width="1"/>
  <!-- Support structure -->
  <line x1="8" y1="19" x2="6" y2="28" stroke="#888" stroke-width="1.5"/>
  <line x1="24" y1="19" x2="26" y2="28" stroke="#888" stroke-width="1.5"/>
  <!-- Main tower -->
  <line x1="16" y1="16" x2="16" y2="6" stroke="#555" stroke-width="1.5"/>
  <circle cx="16" cy="16" r="2" fill="#9b59b6" stroke="#fff" stroke-width="0.5"/>
</svg>
`;

/**
 * Export all symbols with their MapLibre image IDs
 */
export const GIS_SYMBOLS = {
  'gis-platform-fixed': platformFixedSVG,
  'gis-platform-production': platformProductionSVG,
  'gis-platform-drilling': platformDrillingJackupSVG,
  'gis-jackup': jackupRigSVG,
  'gis-semisubmersible': semisubmersibleSVG,
  'gis-fpso': fpsoPSVG,
  'gis-fso': fsoSVG,
  'gis-flng': flngSVG,
  'gis-well': wellSVG,
  'gis-subsea-manifold': subseaManifoldSVG,
  'gis-spm': spmSVG,
  'gis-wind-turbine': windTurbineSVG,
  'gis-terminal': terminalSVG,
  'gis-port': portSVG,
  'gis-substation': offshoreSubstationSVG,
  'gis-installation': genericInstallationSVG,
};

/**
 * Load all symbols into a MapLibre map instance
 * Usage: loadGISSymbols(map)
 */
export function loadGISSymbols(map: any): void {
  for (const [imageId, svgString] of Object.entries(GIS_SYMBOLS)) {
    const img = new Image();
    img.src = createSVGSymbol(svgString);
    img.onload = () => {
      if (!map.hasImage(imageId)) {
        map.addImage(imageId, img);
      }
    };
  }
}
