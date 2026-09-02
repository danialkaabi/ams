/**
 * Professional GIS Layer Control for GO Intelligence Map
 * Allows independent toggling of all offshore infrastructure layers
 */

import { useState } from 'react';
import type { GISLayerVisibility } from '@/data/gis-types';

interface GISLayerControlProps {
  visibility: GISLayerVisibility;
  onChange: (visibility: GISLayerVisibility) => void;
}

type LayerSection = 'live_assets' | 'oil_gas' | 'licensing' | 'renewables' | 'maritime';

export default function GISLayerControl({ visibility, onChange }: GISLayerControlProps) {
  const [expandedSections, setExpandedSections] = useState<Set<LayerSection>>(
    new Set<LayerSection>(['live_assets', 'oil_gas'])
  );

  const toggleSection = (section: LayerSection) => {
    const next = new Set(expandedSections);
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    setExpandedSections(next);
  };

  const handleToggle = (key: keyof GISLayerVisibility) => {
    onChange({
      ...visibility,
      [key]: !visibility[key],
    });
  };

  const isExpanded = (section: LayerSection) => expandedSections.has(section);

  return (
    <div className="gis-layer-control">
      <div className="gis-layer-header">
        <h3>GIS LAYERS</h3>
        <button
          className="gis-layer-reset"
          onClick={() => {
            onChange({
              fields: true,
              installations: true,
              pipelines: true,
              licences: false,
              ports: true,
              wind_farms: false,
              installations_by_type: {},
              fields_by_status: {},
              fields_by_type: {},
            });
            setExpandedSections(new Set<LayerSection>(['live_assets', 'oil_gas']));
          }}
        >
          Reset
        </button>
      </div>

      {/* LIVE ASSETS */}
      <div className="gis-layer-section">
        <button
          className="gis-layer-section-title"
          onClick={() => toggleSection('live_assets')}
          aria-expanded={isExpanded('live_assets')}
        >
          <span className="gis-layer-toggle">
            {isExpanded('live_assets') ? '▼' : '▶'}
          </span>
          LIVE ASSETS
        </button>

        {isExpanded('live_assets') && (
          <div className="gis-layer-items">
            <label className="gis-layer-item">
              <input
                type="checkbox"
                checked={visibility.fields}
                onChange={() => handleToggle('fields')}
              />
              <span>Offshore Vessels</span>
            </label>
            <label className="gis-layer-item">
              <input type="checkbox" disabled checked={false} />
              <span>Rigs / MODUs</span>
            </label>
          </div>
        )}
      </div>

      {/* OIL & GAS */}
      <div className="gis-layer-section">
        <button
          className="gis-layer-section-title"
          onClick={() => toggleSection('oil_gas')}
          aria-expanded={isExpanded('oil_gas')}
        >
          <span className="gis-layer-toggle">
            {isExpanded('oil_gas') ? '▼' : '▶'}
          </span>
          OIL & GAS
        </button>

        {isExpanded('oil_gas') && (
          <div className="gis-layer-items">
            <div className="gis-layer-item-group">
              <label className="gis-layer-item">
                <input
                  type="checkbox"
                  checked={visibility.fields}
                  onChange={() => handleToggle('fields')}
                />
                <span>Fields</span>
              </label>

              {visibility.fields && (
                <div className="gis-layer-subgroup">
                  <label className="gis-layer-subitem">
                    <input
                      type="checkbox"
                      checked={visibility.fields_by_status['Producing'] !== false}
                      onChange={() => {
                        onChange({
                          ...visibility,
                          fields_by_status: {
                            ...visibility.fields_by_status,
                            'Producing':
                              visibility.fields_by_status['Producing'] === false ? true : false,
                          },
                        });
                      }}
                    />
                    <span>Producing</span>
                    <span className="gis-layer-status producing" />
                  </label>
                  <label className="gis-layer-subitem">
                    <input
                      type="checkbox"
                      checked={visibility.fields_by_status['Development'] !== false}
                      onChange={() => {
                        onChange({
                          ...visibility,
                          fields_by_status: {
                            ...visibility.fields_by_status,
                            'Development':
                              visibility.fields_by_status['Development'] === false ? true : false,
                          },
                        });
                      }}
                    />
                    <span>Development</span>
                    <span className="gis-layer-status development" />
                  </label>
                  <label className="gis-layer-subitem">
                    <input
                      type="checkbox"
                      checked={visibility.fields_by_status['Appraisal'] !== false}
                      onChange={() => {
                        onChange({
                          ...visibility,
                          fields_by_status: {
                            ...visibility.fields_by_status,
                            'Appraisal':
                              visibility.fields_by_status['Appraisal'] === false ? true : false,
                          },
                        });
                      }}
                    />
                    <span>Appraisal</span>
                    <span className="gis-layer-status appraisal" />
                  </label>
                  <label className="gis-layer-subitem">
                    <input
                      type="checkbox"
                      checked={visibility.fields_by_status['Discovery'] !== false}
                      onChange={() => {
                        onChange({
                          ...visibility,
                          fields_by_status: {
                            ...visibility.fields_by_status,
                            'Discovery':
                              visibility.fields_by_status['Discovery'] === false ? true : false,
                          },
                        });
                      }}
                    />
                    <span>Discovery</span>
                    <span className="gis-layer-status discovery" />
                  </label>
                  <label className="gis-layer-subitem">
                    <input
                      type="checkbox"
                      checked={
                        visibility.fields_by_status['Decommissioned'] !== false ||
                        visibility.fields_by_status['Abandoned'] !== false
                      }
                      onChange={() => {
                        const newValue =
                          visibility.fields_by_status['Decommissioned'] === false ? true : false;
                        onChange({
                          ...visibility,
                          fields_by_status: {
                            ...visibility.fields_by_status,
                            'Decommissioned': newValue,
                            'Abandoned': newValue,
                          },
                        });
                      }}
                    />
                    <span>Decommissioned</span>
                    <span className="gis-layer-status decommissioned" />
                  </label>
                </div>
              )}
            </div>

            <label className="gis-layer-item">
              <input
                type="checkbox"
                checked={visibility.installations}
                onChange={() => handleToggle('installations')}
              />
              <span>Platforms & Installations</span>
            </label>

            <label className="gis-layer-item">
              <input
                type="checkbox"
                checked={visibility.pipelines}
                onChange={() => handleToggle('pipelines')}
              />
              <span>Pipelines</span>
            </label>
          </div>
        )}
      </div>

      {/* LICENSING */}
      <div className="gis-layer-section">
        <button
          className="gis-layer-section-title"
          onClick={() => toggleSection('licensing')}
          aria-expanded={isExpanded('licensing')}
        >
          <span className="gis-layer-toggle">
            {isExpanded('licensing') ? '▼' : '▶'}
          </span>
          LICENSING
        </button>

        {isExpanded('licensing') && (
          <div className="gis-layer-items">
            <label className="gis-layer-item">
              <input
                type="checkbox"
                checked={visibility.licences}
                onChange={() => handleToggle('licences')}
              />
              <span>Licence Blocks</span>
            </label>
          </div>
        )}
      </div>

      {/* RENEWABLES */}
      <div className="gis-layer-section">
        <button
          className="gis-layer-section-title"
          onClick={() => toggleSection('renewables')}
          aria-expanded={isExpanded('renewables')}
        >
          <span className="gis-layer-toggle">
            {isExpanded('renewables') ? '▼' : '▶'}
          </span>
          RENEWABLES
        </button>

        {isExpanded('renewables') && (
          <div className="gis-layer-items">
            <label className="gis-layer-item">
              <input
                type="checkbox"
                checked={visibility.wind_farms}
                onChange={() => handleToggle('wind_farms')}
              />
              <span>Offshore Wind Farms</span>
            </label>
          </div>
        )}
      </div>

      {/* MARITIME */}
      <div className="gis-layer-section">
        <button
          className="gis-layer-section-title"
          onClick={() => toggleSection('maritime')}
          aria-expanded={isExpanded('maritime')}
        >
          <span className="gis-layer-toggle">
            {isExpanded('maritime') ? '▼' : '▶'}
          </span>
          MARITIME
        </button>

        {isExpanded('maritime') && (
          <div className="gis-layer-items">
            <label className="gis-layer-item">
              <input
                type="checkbox"
                checked={visibility.ports}
                onChange={() => handleToggle('ports')}
              />
              <span>Ports & Terminals</span>
            </label>
          </div>
        )}
      </div>

      <style jsx>{`
        .gis-layer-control {
          background: var(--panel-bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-size: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .gis-layer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid var(--border);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .gis-layer-header h3 {
          margin: 0;
          color: var(--text);
        }

        .gis-layer-reset {
          background: none;
          border: none;
          color: var(--text-2);
          font-size: 11px;
          padding: 0;
          cursor: pointer;
          text-decoration: underline;
        }

        .gis-layer-reset:hover {
          color: var(--acc);
        }

        .gis-layer-section {
          border-bottom: 1px solid var(--border);
        }

        .gis-layer-section:last-child {
          border-bottom: none;
        }

        .gis-layer-section-title {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 12px;
          background: var(--panel-2);
          border: none;
          color: var(--text-2);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          text-align: left;
        }

        .gis-layer-section-title:hover {
          background: var(--panel-3);
        }

        .gis-layer-toggle {
          display: inline-block;
          width: 16px;
          margin-right: 6px;
          font-size: 10px;
        }

        .gis-layer-items {
          padding: 6px 0;
          background: var(--panel);
        }

        .gis-layer-item {
          display: flex;
          align-items: center;
          padding: 6px 16px;
          cursor: pointer;
          color: var(--text-2);
          font-size: 12px;
        }

        .gis-layer-item:hover {
          background: var(--panel-2);
          color: var(--text);
        }

        .gis-layer-item input[type='checkbox'] {
          width: 14px;
          height: 14px;
          margin-right: 8px;
          cursor: pointer;
          accent-color: var(--acc);
        }

        .gis-layer-item input[type='checkbox']:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .gis-layer-item-group {
          padding: 0;
        }

        .gis-layer-subgroup {
          background: var(--panel-2);
          margin: 0;
          padding: 4px 0;
        }

        .gis-layer-subitem {
          display: flex;
          align-items: center;
          padding: 4px 32px 4px 24px;
          cursor: pointer;
          color: var(--text-3);
          font-size: 11px;
        }

        .gis-layer-subitem:hover {
          background: var(--panel-3);
        }

        .gis-layer-subitem input[type='checkbox'] {
          width: 12px;
          height: 12px;
          margin-right: 6px;
          accent-color: var(--acc);
        }

        .gis-layer-status {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-left: auto;
          margin-right: 6px;
        }

        .gis-layer-status.producing {
          background: #2ecc71;
        }

        .gis-layer-status.development {
          background: #f39c12;
        }

        .gis-layer-status.appraisal {
          background: #9b59b6;
        }

        .gis-layer-status.discovery {
          background: #3498db;
        }

        .gis-layer-status.decommissioned {
          background: #7f8c8d;
        }
      `}</style>
    </div>
  );
}
