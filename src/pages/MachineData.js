import React, { useState } from 'react';
import { Activity, Clock, Plus, X } from 'lucide-react';
import './MachineData.css';

const MachineData = () => {
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newlyAddedMachine, setNewlyAddedMachine] = useState(null);
  const [formData, setFormData] = useState({
    machine: '',
    party: '',
    color: '',
    lotNo: '',
    quantity: '',
    stage: 'TD Load',
    expectedDuration: ''
  });

  const [machines, setMachines] = useState([
    {
      id: 'SF-01',
      name: 'Softflow 1',
      status: 'running',
      party: 'LUX',
      color: 'Navy',
      lotNo: '2384/2385',
      quantity: '331 kg',
      stage: 'Soap Run',
      efficiency: 94,
      runtime: '5h 32m'
    },
    {
      id: 'SF-02',
      name: 'Softflow 2',
      status: 'running',
      party: 'JG',
      color: 'Petrol Blue',
      lotNo: '002',
      quantity: '504 kg',
      stage: 'TD Load',
      efficiency: 88,
      runtime: '3h 15m'
    },
    {
      id: 'SF-03',
      name: 'Softflow 3',
      status: 'running',
      party: 'Modenik',
      color: 'Olive',
      lotNo: '13141/13142/13143',
      quantity: '505 kg',
      stage: 'Soap Steam',
      efficiency: 91,
      runtime: '6h 20m'
    },
    {
      id: 'SF-04',
      name: 'Softflow 4',
      status: 'running',
      party: 'Modenik',
      color: 'Poseidon',
      lotNo: '13141/5',
      quantity: '141 kg',
      stage: 'Soap Run',
      efficiency: 85,
      runtime: '7h 48m'
    },
    {
      id: 'SF-05',
      name: 'Softflow 5',
      status: 'running',
      party: 'Modenik',
      color: 'Olive',
      lotNo: '13414/5',
      quantity: '514 kg',
      stage: 'Unload',
      efficiency: 92,
      runtime: '2h 10m'
    },
    {
      id: 'SF-06',
      name: 'Softflow 6',
      status: 'idle',
      party: '',
      color: '',
      lotNo: '',
      quantity: '',
      stage: '',
      efficiency: 0,
      runtime: ''
    },
    {
      id: 'SF-07',
      name: 'Softflow 7',
      status: 'running',
      party: 'Modenik',
      color: 'C. Brown',
      lotNo: '112',
      quantity: '507 kg',
      stage: 'Soap Run',
      efficiency: 89,
      runtime: '4h 25m'
    },
    {
      id: 'SF-08',
      name: 'Softflow 8',
      status: 'maintenance',
      party: '',
      color: '',
      lotNo: '',
      quantity: '',
      stage: '',
      efficiency: 0,
      runtime: ''
    }
  ]);

  const runningMachines = machines.filter(m => m.status === 'running').length;
  const totalMachines = machines.length;
  const avgEfficiency = Math.round(
    machines.filter(m => m.status === 'running')
      .reduce((sum, m) => sum + m.efficiency, 0) / runningMachines
  );
  const totalProduction = machines.filter(m => m.status === 'running')
    .reduce((sum, m) => sum + parseInt(m.quantity), 0);

  const getStatusColor = (status) => {
    switch(status) {
      case 'running': return 'status-running';
      case 'idle': return 'status-idle';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'running': return 'Running';
      case 'idle': return 'Idle';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the machine with the new job
    setMachines(prevMachines => 
      prevMachines.map(machine => 
        machine.id === formData.machine
          ? {
              ...machine,
              status: 'running',
              party: formData.party,
              color: formData.color,
              lotNo: formData.lotNo,
              quantity: `${formData.quantity} kg`,
              stage: formData.stage,
              efficiency: 0, // Will be calculated as job progresses
              runtime: 'Just started'
            }
          : machine
      )
    );
    
    // Highlight the newly added machine
    setNewlyAddedMachine(formData.machine);
    setTimeout(() => setNewlyAddedMachine(null), 3000); // Remove highlight after 3 seconds
    
    alert(`Job added successfully to ${formData.machine}!\n\nThe machine card will now display:\n- Party: ${formData.party}\n- Color: ${formData.color}\n- Lot: ${formData.lotNo}\n- Quantity: ${formData.quantity} kg`);
    
    setShowAddJobModal(false);
    
    // Reset form
    setFormData({
      machine: '',
      party: '',
      color: '',
      lotNo: '',
      quantity: '',
      stage: 'TD Load',
      expectedDuration: ''
    });
  };

  const availableMachines = machines.filter(m => m.status === 'idle' || m.status === 'maintenance');

  return (
    <div className="machine-data">
      <div className="page-header">
        <div>
          <h1>Machine Running Data</h1>
          <p className="page-subtitle">Real-time production monitoring and machine status</p>
        </div>
        <button className="add-job-button" onClick={() => setShowAddJobModal(true)}>
          <Plus size={20} />
          Add Job
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Running</p>
            <h3 className="stat-value">{runningMachines}/{totalMachines}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Efficiency</p>
            <h3 className="stat-value">{avgEfficiency}.8%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Production</p>
            <h3 className="stat-value">{totalProduction.toLocaleString()} kg</h3>
          </div>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="machines-grid">
        {machines.map((machine) => (
          <div 
            key={machine.id} 
            className={`machine-card ${machine.status} ${newlyAddedMachine === machine.id ? 'newly-added' : ''}`}
          >
            <div className="machine-header">
              <div className="machine-id-badge">{machine.id}</div>
              <span className={`status-badge ${getStatusColor(machine.status)}`}>
                <span className="status-dot"></span>
                {getStatusLabel(machine.status)}
              </span>
            </div>

            <h3 className="machine-name">{machine.name}</h3>

            {machine.status === 'running' ? (
              <>
                <div className="machine-details">
                  <div className="detail-row">
                    <span className="detail-label">Party</span>
                    <span className="detail-value">{machine.party}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Colour</span>
                    <span className="detail-value">{machine.color}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lot No.</span>
                    <span className="detail-value">{machine.lotNo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{machine.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Stage</span>
                    <span className="stage-badge">{machine.stage}</span>
                  </div>
                </div>

                <div className="efficiency-section">
                  <div className="efficiency-header">
                    <span className="efficiency-label">Efficiency</span>
                    <span className="efficiency-value">{machine.efficiency}%</span>
                  </div>
                  <div className="efficiency-bar">
                    <div 
                      className="efficiency-fill"
                      style={{ width: `${machine.efficiency}%` }}
                    ></div>
                  </div>
                  <div className="runtime">Runtime: {machine.runtime}</div>
                </div>
              </>
            ) : (
              <div className="machine-status-message">
                {machine.status === 'idle' ? (
                  <p>No active job</p>
                ) : (
                  <p>Under maintenance</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="modal-overlay" onClick={() => setShowAddJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Job</h2>
              <button className="close-btn" onClick={() => setShowAddJobModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="machine">Select Machine *</label>
                  <select
                    id="machine"
                    name="machine"
                    value={formData.machine}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a machine</option>
                    {availableMachines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name} ({machine.id}) - {machine.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="party">Party Name *</label>
                  <input
                    type="text"
                    id="party"
                    name="party"
                    value={formData.party}
                    onChange={handleInputChange}
                    placeholder="e.g., LUX, Modenik, JG"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="color">Color *</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Navy Blue, Olive"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lotNo">Lot Number *</label>
                  <input
                    type="text"
                    id="lotNo"
                    name="lotNo"
                    value={formData.lotNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 2384/2385"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity (kg) *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 450"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stage">Starting Stage *</label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="TD Load">TD Load</option>
                    <option value="Dyeing">Dyeing</option>
                    <option value="Soap Run">Soap Run</option>
                    <option value="Soap Steam">Soap Steam</option>
                    <option value="Unload">Unload</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="expectedDuration">Expected Duration (hours) *</label>
                  <input
                    type="number"
                    id="expectedDuration"
                    name="expectedDuration"
                    value={formData.expectedDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 6"
                    min="1"
                    step="0.5"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddJobModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineData;
