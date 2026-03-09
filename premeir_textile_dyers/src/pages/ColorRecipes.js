import React, { useEffect, useMemo, useState } from 'react';
import { Search, Beaker } from 'lucide-react';
import { batchAPI } from '../services/api';
import './ColorRecipes.css';

const getBatchIdNumber = (batchId) => {
  const parsed = Number(String(batchId || '').replace(/[^\d]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const ColorRecipes = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await batchAPI.getAll();
        setBatches(response.data || []);
      } catch (err) {
        console.error('Error loading color recipes:', err);
        setError('Failed to load color recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colorRecipes = useMemo(() => {
    const grouped = (batches || []).reduce((acc, batch) => {
      const color = batch.color || 'Unknown';
      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push(batch);
      return acc;
    }, {});

    const rows = Object.entries(grouped).map(([color, group]) => {
      const latest = [...group].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return {
        color,
        usageCount: group.length,
        latestBatchId: latest.batchId,
        machine: latest.machine,
        party: latest.party,
        dyes: latest.recipe?.dyes || [],
        chemicals: latest.recipe?.chemicals || []
      };
    }).sort((left, right) => getBatchIdNumber(left.latestBatchId) - getBatchIdNumber(right.latestBatchId));

    const q = query.trim().toLowerCase();
    if (!q) {
      return rows;
    }

    return rows.filter((row) =>
      row.color.toLowerCase().includes(q) ||
      row.latestBatchId.toLowerCase().includes(q) ||
      row.party.toLowerCase().includes(q)
    ).sort((left, right) => getBatchIdNumber(left.latestBatchId) - getBatchIdNumber(right.latestBatchId));
  }, [batches, query]);

  if (loading) {
    return <div className="color-recipes-page"><h1>Loading color recipes...</h1></div>;
  }

  if (error) {
    return <div className="color-recipes-page"><h1>{error}</h1></div>;
  }

  return (
    <div className="color-recipes-page">
      <div className="recipes-header">
        <div>
          <h1>Color Recipes</h1>
          <p>Standard recipe references by color from production batches</p>
        </div>
      </div>

      <div className="recipes-search">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by color, batch, or party..."
        />
      </div>

      <div className="recipes-grid">
        {colorRecipes.map((recipe) => (
          <div key={recipe.color} className="recipe-card">
            <div className="recipe-card-head">
              <h3>{recipe.color}</h3>
              <span>{recipe.usageCount} batches</span>
            </div>
            <p className="recipe-meta">Latest: {recipe.latestBatchId} • {recipe.machine} • {recipe.party}</p>

            <div className="recipe-section">
              <h4><Beaker size={15} /> Dyes</h4>
              <ul>
                {recipe.dyes.map((dye, index) => (
                  <li key={`${recipe.color}-dye-${index}`}>
                    <span>{dye.name}</span>
                    <strong>{dye.qty}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="recipe-section">
              <h4><Beaker size={15} /> Chemicals</h4>
              <ul>
                {recipe.chemicals.map((chem, index) => (
                  <li key={`${recipe.color}-chem-${index}`}>
                    <span>{chem.name}</span>
                    <strong>{chem.qty}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorRecipes;
