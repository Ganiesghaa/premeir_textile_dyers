import React, { useEffect, useMemo, useState } from 'react';
import { Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { batchAPI } from '../services/api';
import './QualityReports.css';

const getBatchIdNumber = (batchId) => {
  const parsed = Number(String(batchId || '').replace(/[^\d]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const QualityReports = () => {
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
        console.error('Error loading quality reports:', err);
        setError('Failed to load quality reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const rows = useMemo(() => {
    const mapped = batches.map((batch) => {
      const efficiencyScore = Number(batch.efficiency || 0);
      const deltaScore = Number(batch.deltaE || 0);
      const qualityScore = Math.max(0, Math.min(100, Math.round((efficiencyScore * 0.7) + ((Math.min(deltaScore, 5) / 5) * 30))));

      return {
        ...batch,
        qualityScore,
        verdict: qualityScore >= 85 ? 'Excellent' : qualityScore >= 70 ? 'Acceptable' : 'Needs Review'
      };
    }).sort((left, right) => getBatchIdNumber(left.batchId) - getBatchIdNumber(right.batchId));

    const q = query.trim().toLowerCase();
    if (!q) {
      return mapped;
    }

    return mapped.filter((row) =>
      row.batchId?.toLowerCase().includes(q) ||
      row.color?.toLowerCase().includes(q) ||
      row.party?.toLowerCase().includes(q) ||
      row.verdict.toLowerCase().includes(q)
    ).sort((left, right) => getBatchIdNumber(left.batchId) - getBatchIdNumber(right.batchId));
  }, [batches, query]);

  const avgQuality = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.qualityScore, 0) / rows.length) : 0;

  if (loading) {
    return <div className="quality-page"><h1>Loading quality reports...</h1></div>;
  }

  if (error) {
    return <div className="quality-page"><h1>{error}</h1></div>;
  }

  return (
    <div className="quality-page">
      <div className="quality-header">
        <div>
          <h1>Quality Reports</h1>
          <p>Batch-wise quality scoring and decision support</p>
        </div>
        <div className="quality-kpi">Avg Quality Score: <strong>{avgQuality}%</strong></div>
      </div>

      <div className="quality-search">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by batch, color, party, or verdict..."
        />
      </div>

      <div className="quality-table-wrap">
        <table className="quality-table">
          <thead>
            <tr>
              <th>Batch</th>
              <th>Date</th>
              <th>Color</th>
              <th>Party</th>
              <th>Rating</th>
              <th>Efficiency</th>
              <th>Quality Score</th>
              <th>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row._id}>
                <td>{row.batchId}</td>
                <td>{row.date}</td>
                <td>{row.color}</td>
                <td>{row.party}</td>
                <td>{row.deltaE}</td>
                <td>{row.efficiency}%</td>
                <td>{row.qualityScore}%</td>
                <td>
                  <span className={`verdict-badge ${row.verdict === 'Excellent' ? 'good' : row.verdict === 'Acceptable' ? 'warn' : 'bad'}`}>
                    {row.verdict === 'Excellent' && <CheckCircle2 size={14} />}
                    {row.verdict === 'Needs Review' && <AlertTriangle size={14} />}
                    {row.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QualityReports;
