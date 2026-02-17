import React, { useState } from 'react';
import { Plus, Search, Eye, Check, X } from 'lucide-react';
import './StandardsTracking.css';

const StandardsTracking = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState(null);

  const standards = [
    {
      id: 1,
      name: 'Pantone 19-1557',
      displayName: 'Lava Orange',
      standardType: 'Pantone',
      colorCode: '#FF6B35',
      referenceValues: {
        L: 52.5,
        a: 54.2,
        b: 52.1
      },
      clients: ['Modenik', 'JG', 'LUX'],
      inspections: 24,
      approvalRate: '91.7%',
      lastUpdate: '28/11/25',
      status: 'active'
    },
    {
      id: 2,
      name: 'BS 2660-1:2008',
      displayName: 'Navy Blue',
      standardType: 'British Standard',
      colorCode: '#001f3f',
      referenceValues: {
        L: 18.5,
        a: 8.2,
        b: -15.3
      },
      clients: ['Modenik'],
      inspections: 18,
      approvalRate: '88.9%',
      lastUpdate: '29/11/25',
      status: 'active'
    },
    {
      id: 3,
      name: 'ISO 105-A02',
      displayName: 'Bright Red',
      standardType: 'ISO Standard',
      colorCode: '#FF0000',
      referenceValues: {
        L: 44.8,
        a: 67.5,
        b: 56.2
      },
      clients: ['JG', 'LUX'],
      inspections: 16,
      approvalRate: '87.5%',
      lastUpdate: '1/12/25',
      status: 'active'
    },
    {
      id: 4,
      name: 'Pantone 17-1546',
      displayName: 'Charcoal Gray',
      standardType: 'Pantone',
      colorCode: '#36454f',
      referenceValues: {
        L: 31.2,
        a: 2.5,
        b: -1.8
      },
      clients: ['JG'],
      inspections: 12,
      approvalRate: '91.7%',
      lastUpdate: '2/12/25',
      status: 'active'
    },
    {
      id: 5,
      name: 'ISO 105-A03',
      displayName: 'Forest Green',
      standardType: 'ISO Standard',
      colorCode: '#228B22',
      referenceValues: {
        L: 22.5,
        a: -35.8,
        b: 18.9
      },
      clients: ['Modenik'],
      inspections: 8,
      approvalRate: '100%',
      lastUpdate: '3/12/25',
      status: 'archived'
    }
  ];

  const filteredStandards = standards.filter(std => {
    const matchesSearch = std.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         std.standardType.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    return std.status === activeFilter && matchesSearch;
  });

  const getStandardBadgeColor = (type) => {
    switch(type) {
      case 'Pantone': return 'pantone';
      case 'British Standard': return 'bs';
      case 'ISO Standard': return 'iso';
      default: return '';
    }
  };

  const standardsCount = {
    total: standards.length,
    pantone: standards.filter(s => s.standardType === 'Pantone').length,
    bs: standards.filter(s => s.standardType === 'British Standard').length,
    iso: standards.filter(s => s.standardType === 'ISO Standard').length
  };

  return (
    <div className="standards-tracking">
      <div className="page-header">
        <div>
          <h1>Standards Tracking</h1>
          <p className="page-subtitle">Manage Pantone, BS, ISO, and other color standards</p>
        </div>
        <button className="new-standard-button">
          <Plus size={20} />
          Add Standard
        </button>
      </div>

      {/* Standards Stats */}
      <div className="standards-stats">
        <div className="stat-card">
          <div className="stat-number">{standardsCount.total}</div>
          <p className="stat-label">Total Standards</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{standardsCount.pantone}</div>
          <p className="stat-label">Pantone</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{standardsCount.bs}</div>
          <p className="stat-label">British Standard</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{standardsCount.iso}</div>
          <p className="stat-label">ISO Standards</p>
        </div>
      </div>

      {/* Standards Content */}
      <div className="standards-content">
        <div className="standards-header">
          <div className="filter-tabs">
            <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
            <button className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`} onClick={() => setActiveFilter('active')}>Active</button>
            <button className={`filter-tab ${activeFilter === 'archived' ? 'active' : ''}`} onClick={() => setActiveFilter('archived')}>Archived</button>
          </div>
          <div className="search-input">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search standards..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Standards List */}
        <div className="standards-list">
          {filteredStandards.map(std => (
            <div key={std.id} className="standard-card">
              <div className="standard-header">
                <div className="color-info">
                  <div className="color-circle" style={{ backgroundColor: std.colorCode }}></div>
                  <div className="text-info">
                    <h3>{std.name}</h3>
                    <p className="display-name">{std.displayName}</p>
                  </div>
                </div>
                <span className={`type-badge ${getStandardBadgeColor(std.standardType)}`}>
                  {std.standardType}
                </span>
              </div>

              <div className="standard-body">
                <div className="reference-values">
                  <h4>Lab Values</h4>
                  <div className="lab-grid">
                    <div className="lab-item">
                      <span className="label">L*</span>
                      <span className="value">{std.referenceValues.L}</span>
                    </div>
                    <div className="lab-item">
                      <span className="label">a*</span>
                      <span className="value">{std.referenceValues.a}</span>
                    </div>
                    <div className="lab-item">
                      <span className="label">b*</span>
                      <span className="value">{std.referenceValues.b}</span>
                    </div>
                  </div>
                </div>

                <div className="clients-info">
                  <h4>Used by Clients</h4>
                  <div className="clients-list">
                    {std.clients.map((client, idx) => (
                      <span key={idx} className="client-badge">{client}</span>
                    ))}
                  </div>
                </div>

                <div className="performance-info">
                  <div className="perf-item">
                    <span className="label">Inspections:</span>
                    <span className="value">{std.inspections}</span>
                  </div>
                  <div className="perf-item">
                    <span className="label">Approval Rate:</span>
                    <span className="value approval">{std.approvalRate}</span>
                  </div>
                  <div className="perf-item">
                    <span className="label">Last Updated:</span>
                    <span className="value">📅 {std.lastUpdate}</span>
                  </div>
                </div>
              </div>

              <div className="standard-footer">
                <button className="action-btn view" title="View details">
                  <Eye size={16} />
                  Details
                </button>
                <button className="action-btn edit" title="Edit">
                  ✎ Edit
                </button>
                <button className="action-btn delete" title="Delete">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStandards.length === 0 && (
          <div className="empty-state">
            <p>No standards found</p>
            <button className="btn-primary">Add Your First Standard</button>
          </div>
        )}
      </div>

      {/* Reference Guide */}
      <div className="reference-guide">
        <h3>Color Standards Reference</h3>
        <div className="guide-grid">
          <div className="guide-box">
            <h4>🎨 Pantone System</h4>
            <p>Fashion, color, home & interiors standards. Most used in textile industry.</p>
            <p className="example">Example: Pantone 19-1557 (Lava Orange)</p>
          </div>
          <div className="guide-box">
            <h4>🇬🇧 British Standard (BS)</h4>
            <p>UK color standards for textiles and dyes. ISO-based color specifications.</p>
            <p className="example">Example: BS 2660-1:2008 (Navy Blue)</p>
          </div>
          <div className="guide-box">
            <h4>🌍 ISO Standards</h4>
            <p>International standards for color measurement and fastness properties.</p>
            <p className="example">Example: ISO 105-A02 (Bright Red)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardsTracking;
