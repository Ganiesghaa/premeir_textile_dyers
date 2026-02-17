import React, { useState } from 'react';
import { Search, Eye, Download, Calendar, FlaskConical, Cpu } from 'lucide-react';
import './BatchHistory.css';

const BatchHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMachine, setFilterMachine] = useState('all');
  const [filterParty, setFilterParty] = useState('all');
  const itemsPerPage = 8;

  // Download batch report as text file
  const downloadBatchReport = (batch) => {
    const reportContent = `
========================================
PREMIER TEXTILE DYERS
Batch Production Report
========================================

BATCH INFORMATION
-----------------
Batch ID:       ${batch.id}
Date:           ${batch.date}
Machine:        ${batch.machine}
Party:          ${batch.party}
Color:          ${batch.color}
Lot Number:     ${batch.lotNo}
Quantity:       ${batch.quantity}
Duration:       ${batch.duration}
Status:         ${batch.status.toUpperCase()}
Efficiency:     ${batch.efficiency}%
Delta E:        ${batch.deltaE}
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

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${batch.id}_Report_${batch.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Download all batches as CSV
  const downloadAllBatchesCSV = () => {
    const headers = ['Batch ID', 'Date', 'Machine', 'Party', 'Color', 'Lot No', 'Quantity', 'Duration', 'Status', 'Efficiency %', 'Delta E', 'Operator'];
    const csvContent = [
      headers.join(','),
      ...filteredBatches.map(batch => [
        batch.id,
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

  const batches = [
    {
      id: 'BTH-2501',
      date: '2025-12-10',
      machine: 'SF-01',
      party: 'LUX',
      color: 'Navy Blue',
      lotNo: '2384/2385',
      quantity: '331 kg',
      duration: '6h 45m',
      status: 'completed',
      efficiency: 94,
      deltaE: 0.8,
      operator: 'Amir Khan',
      recipe: {
        dyes: [
          { name: 'BLACK B (SF) Divine', qty: '3.2%' },
          { name: 'BLUE RR (Divine)', qty: '1.5%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '30 min', temp: '25°C' },
        { name: 'Dyeing', duration: '120 min', temp: '90°C' },
        { name: 'Soap Run', duration: '45 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '60 min', temp: '98°C' },
        { name: 'Unload', duration: '20 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2502',
      date: '2025-12-10',
      machine: 'SF-03',
      party: 'Modenik',
      color: 'Olive',
      lotNo: '13141/13142',
      quantity: '505 kg',
      duration: '7h 20m',
      status: 'completed',
      efficiency: 91,
      deltaE: 0.6,
      operator: 'Hassan Ali',
      recipe: {
        dyes: [
          { name: 'YELLOW ME49L (Divine)', qty: '2.8%' },
          { name: 'BLACK B (SF) Divine', qty: '1.2%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '35 min', temp: '25°C' },
        { name: 'Dyeing', duration: '135 min', temp: '90°C' },
        { name: 'Soap Run', duration: '50 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '65 min', temp: '98°C' },
        { name: 'Unload', duration: '25 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2503',
      date: '2025-12-09',
      machine: 'SF-02',
      party: 'JG',
      color: 'Charcoal',
      lotNo: '371',
      quantity: '504 kg',
      duration: '6h 30m',
      status: 'completed',
      efficiency: 88,
      deltaE: 0.7,
      operator: 'Bilal Ahmed',
      recipe: {
        dyes: [
          { name: 'BLACK B (SF) Divine', qty: '4.5%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '30 min', temp: '25°C' },
        { name: 'Dyeing', duration: '125 min', temp: '90°C' },
        { name: 'Soap Run', duration: '40 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '55 min', temp: '98°C' },
        { name: 'Unload', duration: '20 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2504',
      date: '2025-12-09',
      machine: 'SF-04',
      party: 'Modenik',
      color: 'Poseidon',
      lotNo: '109',
      quantity: '141 kg',
      duration: '8h 15m',
      status: 'rejected',
      efficiency: 82,
      deltaE: 2.1,
      operator: 'Zain Abbas',
      recipe: {
        dyes: [
          { name: 'BLUE RR (Divine)', qty: '3.5%' },
          { name: 'BLACK B (SF) Divine', qty: '0.8%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '25 min', temp: '25°C' },
        { name: 'Dyeing', duration: '145 min', temp: '90°C' },
        { name: 'Soap Run', duration: '55 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '70 min', temp: '98°C' },
        { name: 'Unload', duration: '20 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2505',
      date: '2025-12-08',
      machine: 'SF-07',
      party: 'Modenik',
      color: 'C. Brown',
      lotNo: '112',
      quantity: '507 kg',
      duration: '7h 10m',
      status: 'completed',
      efficiency: 89,
      deltaE: 0.9,
      operator: 'Amir Khan',
      recipe: {
        dyes: [
          { name: 'RED W3R (Divine)', qty: '2.5%' },
          { name: 'YELLOW ME49L (Divine)', qty: '1.8%' },
          { name: 'BLACK B (SF) Divine', qty: '1.2%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '32 min', temp: '25°C' },
        { name: 'Dyeing', duration: '130 min', temp: '90°C' },
        { name: 'Soap Run', duration: '48 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '62 min', temp: '98°C' },
        { name: 'Unload', duration: '23 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2506',
      date: '2025-12-07',
      machine: 'SF-05',
      party: 'LUX',
      color: 'Forest Green',
      lotNo: '2156/2157',
      quantity: '428 kg',
      duration: '7h 35m',
      status: 'completed',
      efficiency: 92,
      deltaE: 1.1,
      operator: 'Hassan Ali',
      recipe: {
        dyes: [
          { name: 'GREEN L (Divine)', qty: '2.2%' },
          { name: 'YELLOW ME49L (Divine)', qty: '0.8%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '2.5%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '33 min', temp: '25°C' },
        { name: 'Dyeing', duration: '128 min', temp: '90°C' },
        { name: 'Soap Run', duration: '52 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '68 min', temp: '98°C' },
        { name: 'Unload', duration: '24 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2507',
      date: '2025-12-07',
      machine: 'SF-06',
      party: 'Modenik',
      color: 'Maroon',
      lotNo: '114',
      quantity: '485 kg',
      duration: '7h 50m',
      status: 'completed',
      efficiency: 87,
      deltaE: 1.3,
      operator: 'Bilal Ahmed',
      recipe: {
        dyes: [
          { name: 'RED W3R (Divine)', qty: '3.2%' },
          { name: 'BLACK B (SF) Divine', qty: '1.8%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3.5%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '35 min', temp: '25°C' },
        { name: 'Dyeing', duration: '140 min', temp: '90°C' },
        { name: 'Soap Run', duration: '55 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '70 min', temp: '98°C' },
        { name: 'Unload', duration: '25 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2508',
      date: '2025-12-06',
      machine: 'SF-01',
      party: 'JG',
      color: 'Light Grey',
      lotNo: '372',
      quantity: '312 kg',
      duration: '6h 20m',
      status: 'rejected',
      efficiency: 79,
      deltaE: 2.8,
      operator: 'Zain Abbas',
      recipe: {
        dyes: [
          { name: 'BLACK B (SF) Divine', qty: '1.2%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '28 min', temp: '25°C' },
        { name: 'Dyeing', duration: '110 min', temp: '90°C' },
        { name: 'Soap Run', duration: '38 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '50 min', temp: '98°C' },
        { name: 'Unload', duration: '18 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2509',
      date: '2025-12-06',
      machine: 'SF-04',
      party: 'LUX',
      color: 'Ivory',
      lotNo: '2388/2389',
      quantity: '562 kg',
      duration: '8h 05m',
      status: 'completed',
      efficiency: 90,
      deltaE: 0.5,
      operator: 'Amir Khan',
      recipe: {
        dyes: [
          { name: 'YELLOW ME49L (Divine)', qty: '0.5%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Bleaching Agent', qty: '1.2g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '36 min', temp: '25°C' },
        { name: 'Bleaching', duration: '90 min', temp: '60°C' },
        { name: 'Dyeing', duration: '100 min', temp: '90°C' },
        { name: 'Soap Run', duration: '58 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '72 min', temp: '98°C' },
        { name: 'Unload', duration: '26 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2510',
      date: '2025-12-05',
      machine: 'SF-02',
      party: 'Modenik',
      color: 'Teal Blue',
      lotNo: '115',
      quantity: '493 kg',
      duration: '7h 45m',
      status: 'completed',
      efficiency: 93,
      deltaE: 0.7,
      operator: 'Hassan Ali',
      recipe: {
        dyes: [
          { name: 'BLUE RR (Divine)', qty: '2.8%' },
          { name: 'GREEN L (Divine)', qty: '1.2%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '34 min', temp: '25°C' },
        { name: 'Dyeing', duration: '138 min', temp: '90°C' },
        { name: 'Soap Run', duration: '50 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '65 min', temp: '98°C' },
        { name: 'Unload', duration: '24 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2511',
      date: '2025-12-05',
      machine: 'SF-03',
      party: 'JG',
      color: 'Burgundy',
      lotNo: '373',
      quantity: '441 kg',
      duration: '7h 25m',
      status: 'completed',
      efficiency: 88,
      deltaE: 1.4,
      operator: 'Bilal Ahmed',
      recipe: {
        dyes: [
          { name: 'RED W3R (Divine)', qty: '3.5%' },
          { name: 'BLACK B (SF) Divine', qty: '2.1%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '31 min', temp: '25°C' },
        { name: 'Dyeing', duration: '135 min', temp: '90°C' },
        { name: 'Soap Run', duration: '52 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '67 min', temp: '98°C' },
        { name: 'Unload', duration: '24 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2512',
      date: '2025-12-04',
      machine: 'SF-07',
      party: 'LUX',
      color: 'Pearl White',
      lotNo: '2390/2391',
      quantity: '518 kg',
      duration: '8h 15m',
      status: 'completed',
      efficiency: 91,
      deltaE: 0.4,
      operator: 'Hassan Ali',
      recipe: {
        dyes: [
          { name: 'OPTICAL BRIGHTENER', qty: '0.8%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Bleaching Agent', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3.5%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '35 min', temp: '25°C' },
        { name: 'Bleaching', duration: '95 min', temp: '60°C' },
        { name: 'Dyeing', duration: '105 min', temp: '90°C' },
        { name: 'Soap Run', duration: '60 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '75 min', temp: '98°C' },
        { name: 'Unload', duration: '27 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2513',
      date: '2025-12-04',
      machine: 'SF-06',
      party: 'Modenik',
      color: 'Deep Purple',
      lotNo: '116',
      quantity: '476 kg',
      duration: '7h 55m',
      status: 'completed',
      efficiency: 86,
      deltaE: 1.6,
      operator: 'Zain Abbas',
      recipe: {
        dyes: [
          { name: 'BLUE RR (Divine)', qty: '2.5%' },
          { name: 'RED W3R (Divine)', qty: '1.8%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3.5%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '34 min', temp: '25°C' },
        { name: 'Dyeing', duration: '142 min', temp: '90°C' },
        { name: 'Soap Run', duration: '54 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '72 min', temp: '98°C' },
        { name: 'Unload', duration: '26 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2514',
      date: '2025-12-03',
      machine: 'SF-04',
      party: 'JG',
      color: 'Copper',
      lotNo: '374',
      quantity: '388 kg',
      duration: '7h 10m',
      status: 'rejected',
      efficiency: 80,
      deltaE: 2.5,
      operator: 'Amir Khan',
      recipe: {
        dyes: [
          { name: 'ORANGE R (Divine)', qty: '2.8%' },
          { name: 'YELLOW ME49L (Divine)', qty: '0.6%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '30 min', temp: '25°C' },
        { name: 'Dyeing', duration: '125 min', temp: '90°C' },
        { name: 'Soap Run', duration: '45 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '60 min', temp: '98°C' },
        { name: 'Unload', duration: '22 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2515',
      date: '2025-12-03',
      machine: 'SF-01',
      party: 'LUX',
      color: 'Sea Green',
      lotNo: '2392/2393',
      quantity: '527 kg',
      duration: '7h 40m',
      status: 'completed',
      efficiency: 94,
      deltaE: 0.6,
      operator: 'Hassan Ali',
      recipe: {
        dyes: [
          { name: 'GREEN L (Divine)', qty: '2.5%' },
          { name: 'BLUE RR (Divine)', qty: '1.2%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '33 min', temp: '25°C' },
        { name: 'Dyeing', duration: '136 min', temp: '90°C' },
        { name: 'Soap Run', duration: '51 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '66 min', temp: '98°C' },
        { name: 'Unload', duration: '25 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2516',
      date: '2025-12-02',
      machine: 'SF-05',
      party: 'Modenik',
      color: 'Plum',
      lotNo: '117',
      quantity: '434 kg',
      duration: '7h 35m',
      status: 'completed',
      efficiency: 89,
      deltaE: 1.2,
      operator: 'Bilal Ahmed',
      recipe: {
        dyes: [
          { name: 'BLUE RR (Divine)', qty: '2.2%' },
          { name: 'RED W3R (Divine)', qty: '2.1%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3.2%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '32 min', temp: '25°C' },
        { name: 'Dyeing', duration: '132 min', temp: '90°C' },
        { name: 'Soap Run', duration: '48 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '64 min', temp: '98°C' },
        { name: 'Unload', duration: '23 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2517',
      date: '2025-12-02',
      machine: 'SF-02',
      party: 'JG',
      color: 'Stone Grey',
      lotNo: '375',
      quantity: '495 kg',
      duration: '6h 55m',
      status: 'completed',
      efficiency: 92,
      deltaE: 0.8,
      operator: 'Zain Abbas',
      recipe: {
        dyes: [
          { name: 'BLACK B (SF) Divine', qty: '1.5%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '30 min', temp: '25°C' },
        { name: 'Dyeing', duration: '118 min', temp: '90°C' },
        { name: 'Soap Run', duration: '42 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '58 min', temp: '98°C' },
        { name: 'Unload', duration: '21 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2518',
      date: '2025-12-01',
      machine: 'SF-03',
      party: 'LUX',
      color: 'Sage',
      lotNo: '2394/2395',
      quantity: '512 kg',
      duration: '7h 50m',
      status: 'completed',
      efficiency: 95,
      deltaE: 0.5,
      operator: 'Hassan Ali',
      recipe: {
        dyes: [
          { name: 'GREEN L (Divine)', qty: '2.0%' },
          { name: 'YELLOW ME49L (Divine)', qty: '1.2%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '35 min', temp: '25°C' },
        { name: 'Dyeing', duration: '140 min', temp: '90°C' },
        { name: 'Soap Run', duration: '52 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '68 min', temp: '98°C' },
        { name: 'Unload', duration: '25 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2519',
      date: '2025-12-01',
      machine: 'SF-06',
      party: 'Modenik',
      color: 'Slate',
      lotNo: '118',
      quantity: '467 kg',
      duration: '7h 20m',
      status: 'completed',
      efficiency: 90,
      deltaE: 1.0,
      operator: 'Amir Khan',
      recipe: {
        dyes: [
          { name: 'BLUE RR (Divine)', qty: '1.8%' },
          { name: 'BLACK B (SF) Divine', qty: '1.5%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '32 min', temp: '25°C' },
        { name: 'Dyeing', duration: '128 min', temp: '90°C' },
        { name: 'Soap Run', duration: '46 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '62 min', temp: '98°C' },
        { name: 'Unload', duration: '22 min', temp: '30°C' }
      ]
    },
    {
      id: 'BTH-2520',
      date: '2025-11-30',
      machine: 'SF-07',
      party: 'JG',
      color: 'Crimson',
      lotNo: '376',
      quantity: '448 kg',
      duration: '7h 30m',
      status: 'completed',
      efficiency: 87,
      deltaE: 1.3,
      operator: 'Bilal Ahmed',
      recipe: {
        dyes: [
          { name: 'RED W3R (Divine)', qty: '3.8%' },
          { name: 'BLUE RR (Divine)', qty: '0.5%' }
        ],
        chemicals: [
          { name: 'Wetting Oil - BMW/CFLD', qty: '2g/l' },
          { name: 'Soaping Oil - OL 40', qty: '1.5g/l' },
          { name: 'Softner Cakes (1:15)', qty: '3%' }
        ]
      },
      stages: [
        { name: 'TD Load', duration: '33 min', temp: '25°C' },
        { name: 'Dyeing', duration: '137 min', temp: '90°C' },
        { name: 'Soap Run', duration: '50 min', temp: '80°C' },
        { name: 'Soap Steam', duration: '65 min', temp: '98°C' },
        { name: 'Unload', duration: '25 min', temp: '30°C' }
      ]
    }
  ];

  const filteredBatches = batches
    .filter(batch => {
      // Search filter
      const matchesSearch = batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.lotNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.party.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
      
      // Machine filter
      const matchesMachine = filterMachine === 'all' || batch.machine === filterMachine;
      
      // Party filter
      const matchesParty = filterParty === 'all' || batch.party === filterParty;
      
      return matchesSearch && matchesStatus && matchesMachine && matchesParty;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'efficiency':
          aValue = a.efficiency;
          bValue = b.efficiency;
          break;
        case 'quantity':
          aValue = parseFloat(a.quantity);
          bValue = parseFloat(b.quantity);
          break;
        case 'deltaE':
          aValue = a.deltaE;
          bValue = b.deltaE;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique values for filters
  const uniqueMachines = [...new Set(batches.map(b => b.machine))].sort();
  const uniqueParties = [...new Set(batches.map(b => b.party))].sort();

  const completedCount = batches.filter(b => b.status === 'completed').length;
  const totalQuantity = batches.reduce((sum, b) => sum + parseFloat(b.quantity), 0);
  const avgEfficiency = Math.round(batches.reduce((sum, b) => sum + b.efficiency, 0) / batches.length);

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getDeltaEClass = (deltaE) => {
    if (deltaE <= 1) return 'delta-good';
    if (deltaE <= 2) return 'delta-warning';
    return 'delta-bad';
  };

  return (
    <div className="batch-history">
      <div className="page-header">
        <div>
          <h1>Batch History</h1>
          <p className="page-subtitle">Complete production records with recipes and analytics</p>
        </div>
        <button className="export-button" onClick={downloadAllBatchesCSV}>
          <Download size={20} />
          Export Data
        </button>
      </div>

      {/* Summary Stats */}
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
      </div>

      {/* Search Bar & Filters */}
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by batch ID, color, lot no, or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Filters & Sorting */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }} className="filter-select">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Machine:</label>
          <select value={filterMachine} onChange={(e) => {
            setFilterMachine(e.target.value);
            setCurrentPage(1);
          }} className="filter-select">
            <option value="all">All Machines</option>
            {uniqueMachines.map(machine => (
              <option key={machine} value={machine}>{machine}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Party:</label>
          <select value={filterParty} onChange={(e) => {
            setFilterParty(e.target.value);
            setCurrentPage(1);
          }} className="filter-select">
            <option value="all">All Parties</option>
            {uniqueParties.map(party => (
              <option key={party} value={party}>{party}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
            <option value="date">Date</option>
            <option value="efficiency">Efficiency</option>
            <option value="quantity">Quantity</option>
            <option value="deltaE">Delta E</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        Showing {paginatedBatches.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredBatches.length)} of {filteredBatches.length} batches
      </div>

      {/* Batch List */}
      <div className="batch-list">
        {paginatedBatches.length > 0 ? (
          paginatedBatches.map((batch) => (
          <div key={batch.id} className="batch-card">
            <div className="batch-header">
              <div className="batch-title">
                <h3>{batch.id}</h3>
                <span className={`status-badge ${getStatusClass(batch.status)}`}>
                  {batch.status.toUpperCase()}
                </span>
              </div>
              <button className="view-btn" onClick={() => setSelectedBatch(batch)}>
                <Eye size={18} />
                View Details
              </button>
            </div>

            <div className="batch-info-grid">
              <div className="info-item">
                <span className="info-label">Date</span>
                <span className="info-value">{batch.date}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Machine</span>
                <span className="info-value">{batch.machine}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Party</span>
                <span className="info-value">{batch.party}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color</span>
                <span className="info-value color-text">{batch.color}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Lot No</span>
                <span className="info-value">{batch.lotNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Quantity</span>
                <span className="info-value">{batch.quantity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Duration</span>
                <span className="info-value">{batch.duration}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Efficiency</span>
                <span className="info-value">{batch.efficiency}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Delta E</span>
                <span className={`info-value ${getDeltaEClass(batch.deltaE)}`}>
                  {batch.deltaE}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Operator</span>
                <span className="info-value">{batch.operator}</span>
              </div>
            </div>
          </div>
        ))
        ) : (
          <div className="no-results">
            <p>No batches found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Batch Detail Modal */}
      {selectedBatch && (
        <div className="modal-overlay" onClick={() => setSelectedBatch(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedBatch.id} - {selectedBatch.color}</h2>
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
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchHistory;
