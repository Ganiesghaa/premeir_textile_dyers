import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Eye,
  Download,
  Calendar,
  FlaskConical,
  Cpu,
  ChevronUp,
  ChevronDown,
  RefreshCcw,
  Filter,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Layers,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { batchAPI } from '../services/api';
import './BatchHistory.css';

const PAGE_SIZE = 10;

const getNumberFromText = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parsed = parseFloat(String(value).replace(/[^\d.]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getDurationMinutes = (duration) => {
  if (!duration) {
    return 0;
  }

  const hoursMatch = String(duration).match(/(\d+)\s*h/i);
  const minutesMatch = String(duration).match(/(\d+)\s*m/i);
  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
  return (hours * 60) + minutes;
};

const formatMinutes = (totalMinutes) => {
  if (!totalMinutes) {
    return '0m';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) {
    return `${minutes}m`;
  }

  if (!minutes) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

const parseBatchDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  const normalizedValue = String(dateValue).trim();

  const ddMmYyyyMatch = normalizedValue.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddMmYyyyMatch) {
    const [, day, month, year] = ddMmYyyyMatch;
    const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getBatchIdNumber = (batchId) => {
  const parsed = Number(String(batchId || '').replace(/[^\d]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getStatusSteps = (status) => {
  const normalized = status?.toLowerCase();
  const steps = [
    { key: 'created', label: 'Created', done: true },
    { key: 'progress', label: 'In Progress', done: normalized !== 'in-progress' },
    { key: 'quality', label: 'Quality Check', done: normalized !== 'in-progress' },
    {
      key: 'final',
      label: normalized === 'rejected' ? 'Rejected' : 'Completed',
      done: normalized === 'completed' || normalized === 'rejected'
    }
  ];

  return steps;
};

const BatchHistory = () => {
      // Restore: Print dialog PDF export
      const exportSummaryToPdf = () => {
        const popup = window.open('', '_blank', 'width=1000,height=700');
        if (!popup) return;
        const tableRows = sortedAndFilteredBatches.map(batch => `
          <tr>
            <td>${batch.batchId}</td>
            <td>${batch.date}</td>
            <td>${batch.machine}</td>
            <td>${batch.party}</td>
            <td>${batch.status}</td>
            <td>${batch.efficiency}</td>
          </tr>
        `).join('');
        const html = `
          <html>
          <head>
            <title>Batch History Summary</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { margin-bottom: 8px; }
              p { color: #555; }
              table { border-collapse: collapse; width: 100%; margin-top: 16px; }
              th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
              th { background: #f3f4f6; text-align: left; }
            </style>
          </head>
          <body>
            <h1>Batch History Summary</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Batch ID</th><th>Date</th><th>Machine</th><th>Party</th><th>Status</th><th>Efficiency</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </body>
          </html>
        `;
        popup.document.write(html);
        popup.document.close();
        popup.focus();
        popup.print();
      };
    // Download all batches as PDF from backend
    const downloadAllBatchesPDF = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/batches/report/pdf', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf'
          }
        });
        if (!response.ok) throw new Error('Failed to download PDF');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Batch_History_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        alert('Error downloading PDF: ' + err.message);
      }
    };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'batchId', direction: 'asc' });
  const [groupBy, setGroupBy] = useState('none');
  const [filters, setFilters] = useState({
    status: '',
    machine: '',
    party: '',
    operator: ''
  });

  const downloadBatchReport = (batch, format = 'txt') => {
    const reportContent = `
========================================
PREMIER TEXTILE DYERS
Batch Production Report
========================================

BATCH INFORMATION
-----------------
Batch ID:       ${batch.batchId}
Date:           ${batch.date}
Machine:        ${batch.machine}
Party:          ${batch.party}
Color:          ${batch.color}
Lot Number:     ${batch.lotNo}
Quantity:       ${batch.quantity}
Duration:       ${batch.duration}
Status:         ${batch.status.toUpperCase()}
Efficiency:     ${batch.efficiency}%
Rating:         ${batch.deltaE}
Operator:       ${batch.operator}

RECIPE - DYES
-------------
${batch.recipe.dyes.map(dye => `${dye.name.padEnd(40)} ${dye.qty}`).join('\n')}

RECIPE - CHEMICALS
------------------
${batch.recipe.chemicals.map(chem => `${chem.name.padEnd(40)} ${chem.qty}`).join('\n')}

PROCESS STAGES
--------------
${batch.stages.map((stage, i) => `${i + 1}. ${stage.name.padEnd(15)} Duration: ${stage.duration.padEnd(10)} Temperature: ${stage.temp}`).join('\n')}

========================================
Report Generated: ${new Date().toLocaleString()}
========================================
    `.trim();

    if (format === 'pdf') {
      const popup = window.open('', '_blank', 'width=900,height=700');
      if (!popup) {
        return;
      }

      popup.document.write(`<html><head><title>${batch.batchId} Report</title><style>body{font-family:Arial;padding:20px;white-space:pre-wrap;line-height:1.5}</style></head><body>${reportContent.replace(/\n/g, '<br/>')}</body></html>`);
      popup.document.close();
      popup.focus();
      popup.print();
      return;
    }

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${batch.batchId}_Report_${batch.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadAllBatchesCSV = () => {
    const headers = ['Batch ID', 'Date', 'Machine', 'Party', 'Color', 'Lot No', 'Quantity', 'Duration', 'Status', 'Efficiency %', 'Rating', 'Operator'];
    const csvContent = [
      headers.join(','),
      ...sortedAndFilteredBatches.map(batch => [
        batch.batchId,
        batch.date,
        batch.machine,
        batch.party,
        batch.color,
        batch.lotNo,
        batch.quantity,
        batch.duration,
        batch.status,
        batch.efficiency,
        batch.deltaE,
        batch.operator
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Batch_History_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadAllBatchesExcel = () => {
    const tableRows = sortedAndFilteredBatches.map((batch) => `
      <tr>
        <td>${batch.batchId}</td>
        <td>${batch.date}</td>
        <td>${batch.machine}</td>
        <td>${batch.party}</td>
        <td>${batch.color}</td>
        <td>${batch.lotNo}</td>
        <td>${batch.quantity}</td>
        <td>${batch.duration}</td>
        <td>${batch.status}</td>
        <td>${batch.efficiency}</td>
        <td>${batch.deltaE}</td>
        <td>${batch.operator}</td>
      </tr>
    `).join('');

    const html = `
      <table>
        <thead>
          <tr>
            <th>Batch ID</th><th>Date</th><th>Machine</th><th>Party</th><th>Color</th>
            <th>Lot No</th><th>Quantity</th><th>Duration</th><th>Status</th><th>Efficiency %</th><th>Rating</th><th>Operator</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Batch_History_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };



  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      fetchBatches(true);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortConfig, groupBy]);

  const fetchBatches = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const response = await batchAPI.getAll();
      setBatches(response.data);
      setLastUpdatedAt(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load batches');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const sortedAndFilteredBatches = useMemo(() => {
    const queryText = searchQuery.toLowerCase().trim();

    const filtered = batches.filter((batch) => {
      const batchDate = parseBatchDate(batch.date);
      const batchEfficiency = getNumberFromText(batch.efficiency);

      const queryMatch = !queryText || [
        batch.batchId,
        batch.color,
        batch.lotNo,
        batch.party,
        batch.machine,
        batch.operator,
        batch.status
      ].some((field) => String(field || '').toLowerCase().includes(queryText));

      const statusMatch = !filters.status || batch.status === filters.status;
      const machineMatch = !filters.machine || batch.machine === filters.machine;
      const partyMatch = !filters.party || batch.party === filters.party;
      const operatorMatch = !filters.operator || batch.operator === filters.operator;

      return queryMatch && statusMatch && machineMatch && partyMatch && operatorMatch;
    });

    const sorted = [...filtered].sort((left, right) => {
      const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1;

      if (sortConfig.key === 'batchId') {
        return (getBatchIdNumber(left.batchId) - getBatchIdNumber(right.batchId)) * directionMultiplier;
      }

      if (sortConfig.key === 'date') {
        const leftDate = parseBatchDate(left.date)?.getTime() || 0;
        const rightDate = parseBatchDate(right.date)?.getTime() || 0;
        return (leftDate - rightDate) * directionMultiplier;
      }

      if (sortConfig.key === 'efficiency') {
        return (getNumberFromText(left.efficiency) - getNumberFromText(right.efficiency)) * directionMultiplier;
      }

      if (sortConfig.key === 'status') {
        return String(left.status).localeCompare(String(right.status)) * directionMultiplier;
      }

      return String(left[sortConfig.key] || '').localeCompare(String(right[sortConfig.key] || '')) * directionMultiplier;
    });

    return sorted;
  }, [batches, filters, searchQuery, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredBatches.length / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedBatches = useMemo(() => {
    const start = (currentPageSafe - 1) * PAGE_SIZE;
    return sortedAndFilteredBatches.slice(start, start + PAGE_SIZE);
  }, [sortedAndFilteredBatches, currentPageSafe]);

  const groupedPaginatedBatches = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Batches': paginatedBatches };
    }

    return paginatedBatches.reduce((acc, batch) => {
      let groupKey = 'Ungrouped';
      if (groupBy === 'date') {
        groupKey = batch.date || 'Unknown Date';
      }
      if (groupBy === 'machine') {
        groupKey = batch.machine || 'Unknown Machine';
      }
      if (groupBy === 'party') {
        groupKey = batch.party || 'Unknown Party';
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(batch);
      return acc;
    }, {});
  }, [groupBy, paginatedBatches]);

  const machineOptions = useMemo(() => [...new Set(batches.map((batch) => batch.machine).filter(Boolean))], [batches]);
  const partyOptions = useMemo(() => [...new Set(batches.map((batch) => batch.party).filter(Boolean))], [batches]);
  const operatorOptions = useMemo(() => [...new Set(batches.map((batch) => batch.operator).filter(Boolean))], [batches]);

  const completedCount = sortedAndFilteredBatches.filter((batch) => batch.status === 'completed').length;
  const rejectedCount = sortedAndFilteredBatches.filter((batch) => batch.status === 'rejected').length;
  const passRate = sortedAndFilteredBatches.length ? Math.round((completedCount / sortedAndFilteredBatches.length) * 100) : 0;
  const failRate = sortedAndFilteredBatches.length ? Math.round((rejectedCount / sortedAndFilteredBatches.length) * 100) : 0;
  const totalQuantity = sortedAndFilteredBatches.reduce((sum, batch) => sum + getNumberFromText(batch.quantity), 0);
  const avgEfficiency = sortedAndFilteredBatches.length
    ? Math.round(sortedAndFilteredBatches.reduce((sum, batch) => sum + getNumberFromText(batch.efficiency), 0) / sortedAndFilteredBatches.length)
    : 0;
  const avgDurationMinutes = sortedAndFilteredBatches.length
    ? Math.round(sortedAndFilteredBatches.reduce((sum, batch) => sum + getDurationMinutes(batch.duration), 0) / sortedAndFilteredBatches.length)
    : 0;

  const efficiencyTrendData = useMemo(() => {
    const byDate = sortedAndFilteredBatches.reduce((acc, batch) => {
      const key = batch.date || 'Unknown';
      if (!acc[key]) {
        acc[key] = { date: key, efficiencyTotal: 0, count: 0 };
      }
      acc[key].efficiencyTotal += getNumberFromText(batch.efficiency);
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.values(byDate)
      .map((row) => ({
        date: row.date,
        avgEfficiency: Math.round(row.efficiencyTotal / row.count)
      }))
      .sort((left, right) => (parseBatchDate(left.date)?.getTime() || 0) - (parseBatchDate(right.date)?.getTime() || 0));
  }, [sortedAndFilteredBatches]);

  const onSortClick = (key) => {
    setSortConfig((previous) => {
      if (previous.key === key) {
        return {
          key,
          direction: previous.direction === 'asc' ? 'desc' : 'asc'
        };
      }

      return {
        key,
        direction: key === 'date' ? 'desc' : 'asc'
      };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown size={14} className="sort-icon muted" />;
    }

    return sortConfig.direction === 'asc'
      ? <ChevronUp size={14} className="sort-icon active" />
      : <ChevronDown size={14} className="sort-icon active" />;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      status: '',
      machine: '',
      party: '',
      operator: ''
    });
    setGroupBy('none');
    setCurrentPage(1);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getDeltaEClass = (deltaE) => {
    return deltaE >= 3 ? 'delta-good' : 'delta-bad';
  };

  if (loading) {
    return (
      <div className="batch-history">
        <div className="page-header">
          <h1>Loading batches...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batch-history">
        <div className="page-header">
          <h1>Error: {error}</h1>
          <button onClick={fetchBatches}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="batch-history">
      <div className="page-header">
        <div>
          <h1>Batch History</h1>
          <p className="page-subtitle">Complete production records with filters, analytics, timeline, and export</p>
        </div>
        <div className="header-actions-row">
          <button className={`toggle-btn ${autoRefresh ? 'enabled' : ''}`} onClick={() => setAutoRefresh((prev) => !prev)}>
            <RefreshCcw size={16} />
            Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button className="export-button" onClick={() => fetchBatches()}>
            <RefreshCcw size={18} />
            Refresh Now
          </button>
        </div>
      </div>
      <p className="last-updated">Last updated: {lastUpdatedAt ? lastUpdatedAt.toLocaleString() : 'Not updated yet'}</p>

      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Completed Batches</p>
            <h3 className="stat-value">{completedCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Cpu size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Efficiency</p>
            <h3 className="stat-value">{avgEfficiency}%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FlaskConical size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Produced</p>
            <h3 className="stat-value">{totalQuantity.toFixed(0)} kg</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Duration</p>
            <h3 className="stat-value">{formatMinutes(avgDurationMinutes)}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teal">
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Pass / Fail Rate</p>
            <h3 className="stat-value">{passRate}% / {failRate}%</h3>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-header">
          <h3><BarChart3 size={18} /> Efficiency Trend Over Time</h3>
        </div>
        <div className="analytics-chart">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={efficiencyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="avgEfficiency" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="filters-panel">
        <div className="panel-header">
          <h3><Filter size={18} /> Filters and Advanced Search</h3>
          <button className="clear-btn" onClick={clearFilters}>Reset</button>
        </div>

        <div className="filters-inline-row">
          <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
          </select>

          <select value={filters.machine} onChange={(event) => setFilters((prev) => ({ ...prev, machine: event.target.value }))}>
            <option value="">All Machines</option>
            {machineOptions.map((machine) => <option key={machine} value={machine}>{machine}</option>)}
          </select>

          <select value={filters.party} onChange={(event) => setFilters((prev) => ({ ...prev, party: event.target.value }))}>
            <option value="">All Parties</option>
            {partyOptions.map((party) => <option key={party} value={party}>{party}</option>)}
          </select>

          <select value={filters.operator} onChange={(event) => setFilters((prev) => ({ ...prev, operator: event.target.value }))}>
            <option value="">All Operators</option>
            {operatorOptions.map((operator) => <option key={operator} value={operator}>{operator}</option>)}
          </select>

          <div className="group-control">
            <Layers size={16} />
            <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)}>
              <option value="none">No Grouping</option>
              <option value="machine">Group by Machine</option>
              <option value="party">Group by Party</option>
              <option value="date">Group by Date</option>
            </select>
          </div>

          <div className="export-group">
            <button className="export-mini-btn" onClick={downloadAllBatchesCSV}><Download size={15} /> CSV</button>
            <button className="export-mini-btn" onClick={downloadAllBatchesExcel}><FileSpreadsheet size={15} /> Excel</button>
            <button className="export-mini-btn" onClick={exportSummaryToPdf}><FileText size={15} /> PDF</button>
          </div>
        </div>
      </div>

      <div className="batch-table-wrapper">
        <div className="table-head-row">
          <h3>Batch Records</h3>
          <span className="table-count">{sortedAndFilteredBatches.length} total records</span>
        </div>

        {Object.entries(groupedPaginatedBatches).map(([groupName, groupItems]) => (
          <div key={groupName} className="group-section">
            {groupBy !== 'none' && <h4 className="group-title">{groupName} ({groupItems.length})</h4>}

            <table className="batch-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>
                    <button className="sort-btn" onClick={() => onSortClick('date')}>
                      Date {renderSortIcon('date')}
                    </button>
                  </th>
                  <th>Machine</th>
                  <th>Party</th>
                  <th>Operator</th>
                  <th>
                    <button className="sort-btn" onClick={() => onSortClick('status')}>
                      Status {renderSortIcon('status')}
                    </button>
                  </th>
                  <th>
                    <button className="sort-btn" onClick={() => onSortClick('efficiency')}>
                      Efficiency {renderSortIcon('efficiency')}
                    </button>
                  </th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groupItems.map((batch) => (
                  <tr key={batch._id}>
                    <td>{batch.batchId}</td>
                    <td>{batch.date}</td>
                    <td>{batch.machine}</td>
                    <td>{batch.party}</td>
                    <td>{batch.operator}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(batch.status)}`}>
                        {batch.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{batch.efficiency}%</td>
                    <td><span className={getDeltaEClass(batch.deltaE)}>{batch.deltaE}</span></td>
                    <td>
                      <button className="view-btn small" onClick={() => setSelectedBatch(batch)}>
                        <Eye size={15} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div className="pagination-row">
          <button disabled={currentPageSafe === 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>Prev</button>
          <span>Page {currentPageSafe} of {totalPages}</span>
          <button disabled={currentPageSafe === totalPages} onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}>Next</button>
        </div>
      </div>

      {selectedBatch && (
        <div className="modal-overlay" onClick={() => setSelectedBatch(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedBatch.batchId} - {selectedBatch.color}</h2>
                <p className="modal-subtitle">Complete batch information and recipe</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedBatch(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Batch Information</h3>
                <div className="detail-grid">
                  <div><strong>Date:</strong> {selectedBatch.date}</div>
                  <div><strong>Machine:</strong> {selectedBatch.machine}</div>
                  <div><strong>Party:</strong> {selectedBatch.party}</div>
                  <div><strong>Lot No:</strong> {selectedBatch.lotNo}</div>
                  <div><strong>Quantity:</strong> {selectedBatch.quantity}</div>
                  <div><strong>Duration:</strong> {selectedBatch.duration}</div>
                  <div><strong>Efficiency:</strong> {selectedBatch.efficiency}%</div>
                  <div><strong>Rating:</strong> <span className={getDeltaEClass(selectedBatch.deltaE)}>{selectedBatch.deltaE}</span></div>
                  <div><strong>Operator:</strong> {selectedBatch.operator}</div>
                  <div><strong>Status:</strong> <span className={`status-badge ${getStatusClass(selectedBatch.status)}`}>{selectedBatch.status}</span></div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Recipe</h3>
                <div className="recipe-columns">
                  <div className="recipe-column">
                    <h4>Dyes</h4>
                    <ul className="recipe-list">
                      {selectedBatch.recipe.dyes.map((dye, index) => (
                        <li key={index}>
                          <span>{dye.name}</span>
                          <span className="qty-badge">{dye.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="recipe-column">
                    <h4>Chemicals</h4>
                    <ul className="recipe-list">
                      {selectedBatch.recipe.chemicals.map((chem, index) => (
                        <li key={index}>
                          <span>{chem.name}</span>
                          <span className="qty-badge">{chem.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Batch Status Timeline</h3>
                <div className="status-timeline-horizontal">
                  {getStatusSteps(selectedBatch.status).map((step, index) => (
                    <div key={step.key} className={`timeline-step ${step.done ? 'done' : ''}`}>
                      <div className="timeline-dot">{index + 1}</div>
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Process Stages</h3>
                <div className="stages-timeline">
                  {selectedBatch.stages.map((stage, index) => (
                    <div key={index} className="stage-item">
                      <div className="stage-marker">{index + 1}</div>
                      <div className="stage-content">
                        <h4>{stage.name}</h4>
                        <p>Duration: {stage.duration} | Temperature: {stage.temp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-download" onClick={() => downloadBatchReport(selectedBatch)}>
                <Download size={18} />
                Download TXT
              </button>
              <button className="btn-download secondary" onClick={() => downloadBatchReport(selectedBatch, 'pdf')}>
                <FileText size={18} />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchHistory;
