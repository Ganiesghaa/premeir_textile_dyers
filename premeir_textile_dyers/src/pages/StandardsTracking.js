import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { batchAPI } from '../services/api';
import './StandardsTracking.css';

const StandardsTracking = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await batchAPI.getAll();
        setBatches(response.data || []);
      } catch (err) {
        console.error('Error loading standards tracking:', err);
        setError('Failed to load standards tracking');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const standardsRows = useMemo(() => {
    return batches.map((batch) => {
      const efficiency = Number(batch.efficiency || 0);
      const rawRating = Number(batch.deltaE || 0);
      const rating = rawRating <= 2.5
        ? Number((rawRating + 2.5).toFixed(1))
        : rawRating;
      const durationText = String(batch.duration || '0h 0m');
      const hours = Number((durationText.match(/(\d+)\s*h/i) || [0, 0])[1]);
      const durationMinutes = hours * 60;

      const efficiencyPass = efficiency >= 90;
      const deltaPass = rating >= 3;
      const timePass = durationMinutes <= 420;
      const compliance = [efficiencyPass, deltaPass, timePass].filter(Boolean).length;

      return {
        ...batch,
        rating,
        efficiencyPass,
        deltaPass,
        timePass,
        compliancePercent: Math.round((compliance / 3) * 100)
      };
    }).sort((left, right) => {
      const leftNumber = Number(String(left.batchId || '').replace(/[^\d]/g, ''));
      const rightNumber = Number(String(right.batchId || '').replace(/[^\d]/g, ''));

      if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) {
        return String(left.batchId || '').localeCompare(String(right.batchId || ''));
      }

      return leftNumber - rightNumber;
    });
  }, [batches]);

  const overallCompliance = standardsRows.length
    ? Math.round(standardsRows.reduce((sum, row) => sum + row.compliancePercent, 0) / standardsRows.length)
    : 0;

  if (loading) {
    return <div className="standards-page"><h1>Loading standards tracking...</h1></div>;
  }

  if (error) {
    return <div className="standards-page"><h1>{error}</h1></div>;
  }

  return (
    <div className="standards-page">
      <div className="standards-header">
        <div>
          <h1>Standards Tracking</h1>
          <p>Monitor compliance against internal production quality standards</p>
        </div>
        <div className="standards-kpi">
          <ShieldCheck size={16} /> Overall Compliance: <strong>{overallCompliance}%</strong>
        </div>
      </div>

      <div className="standards-rules">
        <span>Efficiency ≥ 90%</span>
        <span>Rating ≥ 3</span>
        <span>Duration ≤ 7h</span>
      </div>

      <div className="standards-table-wrap">
        <table className="standards-table">
          <thead>
            <tr>
              <th>Batch</th>
              <th>Color</th>
              <th>Efficiency</th>
              <th>Rating</th>
              <th>Duration</th>
              <th>Rating Std</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {standardsRows.map((row) => (
              <tr key={row._id}>
                <td>{row.batchId}</td>
                <td>{row.color}</td>
                <td>{row.efficiency}%</td>
                <td>{row.rating}</td>
                <td>{row.duration}</td>
                <td><span className={`std-badge ${row.deltaPass ? 'pass' : 'fail'}`}>{row.deltaPass ? 'Pass' : 'Fail'}</span></td>
                <td><strong>{row.compliancePercent}%</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandardsTracking;
