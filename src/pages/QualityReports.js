import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, TrendingUp } from 'lucide-react';
import './QualityReports.css';

const QualityReports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  // Approval trend data
  const approvalTrendData = [
    { date: 'Nov 21', approved: 85, rejected: 15, pending: 10 },
    { date: 'Nov 22', approved: 88, rejected: 12, pending: 8 },
    { date: 'Nov 23', approved: 82, rejected: 18, pending: 12 },
    { date: 'Nov 24', approved: 90, rejected: 10, pending: 5 },
    { date: 'Nov 25', approved: 87, rejected: 13, pending: 7 },
    { date: 'Nov 26', approved: 92, rejected: 8, pending: 4 },
    { date: 'Nov 27', approved: 89, rejected: 11, pending: 6 },
    { date: 'Nov 28', approved: 85, rejected: 15, pending: 10 },
    { date: 'Nov 29', approved: 91, rejected: 9, pending: 5 },
    { date: 'Nov 30', approved: 88, rejected: 12, pending: 8 },
    { date: 'Dec 1', approved: 90, rejected: 10, pending: 4 },
    { date: 'Dec 2', approved: 86, rejected: 14, pending: 9 }
  ];

  // Client performance data
  const clientPerformanceData = [
    { name: 'Modenik', approved: 156, rejected: 22, rejectionRate: '12.3%' },
    { name: 'JG', approved: 142, rejected: 18, rejectionRate: '11.2%' },
    { name: 'LUX', approved: 98, rejected: 12, rejectionRate: '10.9%' },
    { name: 'Others', approved: 64, rejected: 8, rejectionRate: '11.1%' }
  ];

  // Status distribution
  const statusDistribution = [
    { name: 'Approved', value: 460, color: '#10b981' },
    { name: 'Rejected', value: 60, color: '#ef4444' },
    { name: 'Pending', value: 26, color: '#fbbf24' }
  ];

  // Quality metrics
  const qualityMetrics = [
    { label: 'Overall Approval Rate', value: '88.5%', trend: '+2.3%', status: 'up' },
    { label: 'Total Inspections', value: '546', trend: '+45', status: 'up' },
    { label: 'Rejection Rate', value: '11.5%', trend: '-1.2%', status: 'down' },
    { label: 'Avg Rating', value: '3.2', trend: '+0.3', status: 'up' }
  ];

  return (
    <div className="quality-reports">
      <div className="page-header">
        <div>
          <h1>Quality Reports</h1>
          <p className="page-subtitle">Approval rates, rejection trends, and client performance analysis</p>
        </div>
        <button className="export-button">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Quality Metrics */}
      <div className="metrics-grid">
        {qualityMetrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <h3 className="metric-value">{metric.value}</h3>
            <p className={`metric-trend ${metric.status}`}>
              <TrendingUp size={14} />
              {metric.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="reports-content">
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Approval Trends
          </button>
          <button 
            className={`tab ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            Client Performance
          </button>
          <button 
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="content-section">
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Status Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Client Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clientPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" fill="#10b981" />
                      <Bar dataKey="rejected" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="content-section">
              <div className="filter-section">
                <Filter size={18} />
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              <div className="chart-card full-width">
                <h3>Approval & Rejection Trends</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={approvalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="pending" stroke="#fbbf24" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="content-section">
              <div className="table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Approved</th>
                      <th>Rejected</th>
                      <th>Rejection Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientPerformanceData.map((client, idx) => (
                      <tr key={idx}>
                        <td className="client-name">{client.name}</td>
                        <td className="approved">{client.approved}</td>
                        <td className="rejected">{client.rejected}</td>
                        <td>
                          <span className={`rate-badge ${parseFloat(client.rejectionRate) > 12 ? 'high' : 'normal'}`}>
                            {client.rejectionRate}
                          </span>
                        </td>
                        <td className="total">{client.approved + client.rejected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="content-section">
              <div className="details-grid">
                <div className="detail-box">
                  <h4>Key Findings</h4>
                  <ul>
                    <li>✓ Approval rate improved to 88.5% this month</li>
                    <li>⚠ Rejection rate decreased from 13% to 11.5%</li>
                    <li>✓ Modenik maintains highest approval rate</li>
                    <li>→ Total inspections increased by 45 compared to last period</li>
                  </ul>
                </div>

                <div className="detail-box">
                  <h4>Recommendations</h4>
                  <ul>
                    <li>Continue current quality control process</li>
                    <li>Review rejections for pattern identification</li>
                    <li>Share best practices with lower-performing clients</li>
                    <li>Increase frequency of inspections for critical colors</li>
                  </ul>
                </div>

                <div className="detail-box">
                  <h4>By Color Group</h4>
                  <ul>
                    <li>Basic Colors: 92% approval rate</li>
                    <li>Fashion Colors: 86% approval rate</li>
                    <li>Special Colors: 81% approval rate</li>
                    <li>Pastel Colors: 89% approval rate</li>
                  </ul>
                </div>

                <div className="detail-box">
                  <h4>By Process Type</h4>
                  <ul>
                    <li>Reactive Dyes: 90% approval</li>
                    <li>Vat Dyes: 87% approval</li>
                    <li>Acid Dyes: 85% approval</li>
                    <li>Sulphur Dyes: 88% approval</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityReports;
