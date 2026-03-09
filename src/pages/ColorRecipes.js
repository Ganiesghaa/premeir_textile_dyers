import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy } from 'lucide-react';
import './ColorRecipes.css';

const ColorRecipes = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const colorRecipes = [
    {
      id: 1,
      name: 'Navy Blue',
      colorCode: '#001f3f',
      dyeComponents: [
        { dye: 'Indigo', quantity: 2.5, unit: 'kg' },
        { dye: 'Sulphur Black', quantity: 0.8, unit: 'kg' }
      ],
      chemicals: [
        { chemical: 'Sodium Hydroxide', quantity: 1.2, unit: 'L' },
        { chemical: 'Sodium Sulphide', quantity: 0.5, unit: 'kg' }
      ],
      processTemp: '60-80°C',
      processTime: '45 mins',
      client: 'Modenik',
      status: 'approved',
      lastUsed: '28/11/25'
    },
    {
      id: 2,
      name: 'Olive Green',
      colorCode: '#6b8e23',
      dyeComponents: [
        { dye: 'Yellow Dye', quantity: 1.8, unit: 'kg' },
        { dye: 'Blue Dye', quantity: 0.6, unit: 'kg' }
      ],
      chemicals: [
        { chemical: 'Acetic Acid', quantity: 0.8, unit: 'L' }
      ],
      processTemp: '50-70°C',
      processTime: '40 mins',
      client: 'Modenik',
      status: 'approved',
      lastUsed: '28/11/25'
    },
    {
      id: 3,
      name: 'Charcoal Gray',
      colorCode: '#36454f',
      dyeComponents: [
        { dye: 'Black Dye', quantity: 2.0, unit: 'kg' },
        { dye: 'Red Dye', quantity: 0.3, unit: 'kg' }
      ],
      chemicals: [
        { chemical: 'Sodium Chloride', quantity: 2.0, unit: 'kg' }
      ],
      processTemp: '80-95°C',
      processTime: '50 mins',
      client: 'JG',
      status: 'approved',
      lastUsed: '29/11/25'
    },
    {
      id: 4,
      name: 'Crimson Red',
      colorCode: '#dc143c',
      dyeComponents: [
        { dye: 'Red Dye', quantity: 3.2, unit: 'kg' }
      ],
      chemicals: [
        { chemical: 'Formic Acid', quantity: 1.5, unit: 'L' }
      ],
      processTemp: '60-75°C',
      processTime: '35 mins',
      client: 'LUX',
      status: 'testing',
      lastUsed: '1/12/25'
    }
  ];

  const filteredRecipes = colorRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    return recipe.status === activeFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'approved': return 'status-approved';
      case 'testing': return 'status-testing';
      case 'archived': return 'status-archived';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="color-recipes">
      <div className="page-header">
        <div>
          <h1>Color Recipes</h1>
          <p className="page-subtitle">Store, manage, and reuse color formulas & dye compositions</p>
        </div>
        <button className="new-recipe-button" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Recipe
        </button>
      </div>

      {/* Summary Stats */}
      <div className="recipe-stats">
        <div className="stat-card">
          <div className="stat-number">{colorRecipes.length}</div>
          <p className="stat-label">Total Recipes</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{colorRecipes.filter(r => r.status === 'approved').length}</div>
          <p className="stat-label">Approved</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{colorRecipes.filter(r => r.status === 'testing').length}</div>
          <p className="stat-label">Testing</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(colorRecipes.map(r => r.client)).size}</div>
          <p className="stat-label">Clients</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="recipes-content">
        <div className="recipes-header">
          <div className="filter-tabs">
            <button className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
            <button className={`filter-tab ${activeFilter === 'approved' ? 'active' : ''}`} onClick={() => setActiveFilter('approved')}>Approved</button>
            <button className={`filter-tab ${activeFilter === 'testing' ? 'active' : ''}`} onClick={() => setActiveFilter('testing')}>Testing</button>
            <button className={`filter-tab ${activeFilter === 'archived' ? 'active' : ''}`} onClick={() => setActiveFilter('archived')}>Archived</button>
          </div>
          <div className="search-input">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search recipes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="recipes-grid">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-header">
                <div className="color-preview" style={{ backgroundColor: recipe.colorCode }}></div>
                <div className="recipe-info">
                  <h3>{recipe.name}</h3>
                  <p className="color-code">{recipe.colorCode}</p>
                </div>
                <span className={`status-badge ${getStatusClass(recipe.status)}`}>
                  {getStatusText(recipe.status)}
                </span>
              </div>

              <div className="recipe-body">
                <div className="section">
                  <h4>Dye Components</h4>
                  <ul className="components-list">
                    {recipe.dyeComponents.map((comp, idx) => (
                      <li key={idx}>{comp.dye}: {comp.quantity} {comp.unit}</li>
                    ))}
                  </ul>
                </div>

                <div className="section">
                  <h4>Chemicals</h4>
                  <ul className="components-list">
                    {recipe.chemicals.map((chem, idx) => (
                      <li key={idx}>{chem.chemical}: {chem.quantity} {chem.unit}</li>
                    ))}
                  </ul>
                </div>

                <div className="process-info">
                  <div className="info-item">
                    <span className="label">Temperature:</span>
                    <span className="value">{recipe.processTemp}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Time:</span>
                    <span className="value">{recipe.processTime}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Client:</span>
                    <span className="value">{recipe.client}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Last Used:</span>
                    <span className="value">📅 {recipe.lastUsed}</span>
                  </div>
                </div>
              </div>

              <div className="recipe-actions">
                <button className="action-btn copy" title="Duplicate recipe">
                  <Copy size={16} />
                </button>
                <button className="action-btn edit" title="Edit recipe">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" title="Delete recipe">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="empty-state">
            <p>No color recipes found</p>
            <button className="btn-primary" onClick={() => setShowModal(true)}>Create First Recipe</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorRecipes;
