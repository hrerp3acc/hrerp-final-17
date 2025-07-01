
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Interface for payslip data based on your first image
interface PayslipData {
  empNo: string;
  employeeName: string;
  designation: string;
  dateOfJoin: string;
  daysPresent: string;
  lateMin: number;
  otHrs: string;
  payMonth: string;
  payYear: string;
  unitName: string;
  uanNo: string;
  esiNo: string;
  earnings: {
    basic: number;
    hra: number;
    conveyance: number;
    otherAllowance: number;
    overtimeAmount: number;
    trimAllowance: number;
  };
  deductions: {
    pf: number;
    esi: number;
    advance: number;
    foodAllowance: number;
    rent: number;
    other: number;
  };
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
}

// Interface for salary statement data based on your second image
interface SalaryStatementData {
  employees: Array<{
    slNo: number;
    empNo: string;
    name: string;
    pfNumber: string;
    esiNumber: string;
    workedDays: number;
    otHrs: number;
    perDaySalary: number;
    basic: number;
    da: number;
    basicTotal: number;
    daTotal: number;
    extraHours: number;
    grossEarnings: number;
    pf12: number;
    esi075: number;
    food: number;
    uniform: number;
    deduction: number;
    takeHome: number;
    paymentMode: string;
  }>;
  totals: {
    totalDays: number;
    totalOtHrs: number;
    totalGrossEarnings: number;
    totalPf: number;
    totalEsi: number;
    totalFood: number;
    totalUniform: number;
    totalDeductions: number;
    totalTakeHome: number;
  };
}

export const generatePayslipPDF = (payslips: PayslipData[]) => {
  const doc = new jsPDF();
  let yPosition = 20;

  payslips.forEach((payslip, index) => {
    if (index > 0) {
      doc.addPage();
      yPosition = 20;
    }

    // Company header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SSS SOLUTIONS', 105, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('PAYSLIP', 105, yPosition, { align: 'center' });
    
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CASH', 180, yPosition);

    yPosition += 15;

    // Employee details section
    const leftColumnData = [
      ['Emp.No', payslip.empNo],
      ['Employee Name', payslip.employeeName],
      ['Designation', payslip.designation],
      ['Date of Join', payslip.dateOfJoin],
      ['Days Present', payslip.daysPresent]
    ];

    const middleColumnData = [
      ['Late Min', payslip.lateMin.toString()],
      ['OT Hrs', payslip.otHrs]
    ];

    const rightColumnData = [
      ['Pay Month', payslip.payMonth],
      ['Pay Year', payslip.payYear],
      ['UNIT NAME', payslip.unitName],
      ['UAN No', payslip.uanNo],
      ['ESI No', payslip.esiNo]
    ];

    // Draw employee details
    leftColumnData.forEach(([label, value], i) => {
      doc.text(`${label} : ${value}`, 20, yPosition + (i * 8));
    });

    middleColumnData.forEach(([label, value], i) => {
      doc.text(`${label} : ${value}`, 85, yPosition + (i * 8));
    });

    rightColumnData.forEach(([label, value], i) => {
      doc.text(`${label} : ${value}`, 130, yPosition + (i * 8));
    });

    yPosition += 50;

    // Earnings and Deductions table
    const tableData = [
      ['Earnings', 'Amount', 'Deductions', 'Amount'],
      ['Basic + D.A', payslip.earnings.basic.toFixed(2), 'PF', payslip.deductions.pf.toFixed(2)],
      ['HRA', payslip.earnings.hra.toFixed(2), 'ESI', payslip.deductions.esi.toFixed(2)],
      ['Conveyance', payslip.earnings.conveyance.toFixed(2), 'Advance', payslip.deductions.advance.toFixed(2)],
      ['Other Allowance', payslip.earnings.otherAllowance.toFixed(2), 'Food Allowance', payslip.deductions.foodAllowance.toFixed(2)],
      ['Overtime Amount', payslip.earnings.overtimeAmount.toFixed(2), 'Rent', payslip.deductions.rent.toFixed(2)],
      ['Trim Allowance', payslip.earnings.trimAllowance.toFixed(2), 'Other', payslip.deductions.other.toFixed(2)],
      ['Total Earnings', payslip.totalEarnings.toFixed(2), 'Total Deductions', payslip.totalDeductions.toFixed(2)]
    ];

    (doc as any).autoTable({
      startY: yPosition,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [200, 200, 200] },
      columnStyles: {
        0: { fontStyle: 'normal' },
        1: { halign: 'right' },
        2: { fontStyle: 'normal' },
        3: { halign: 'right' }
      }
    });

    // Net Pay
    yPosition = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`NET PAY: ${payslip.netPay.toFixed(2)}`, 20, yPosition);
  });

  return doc;
};

export const generateSalaryStatementExcel = (data: SalaryStatementData) => {
  const wb = XLSX.utils.book_new();
  
  // Create header rows
  const headerRows = [
    ['X ACT SALARY STATEMENT FOR THE MONTH OF MAY 2025'],
    [],
    [
      'Sl No', 'EMP No', 'Name of the Employee', 'PF Number', 'ESI Number',
      'Worked Days', 'OTHrs', 'Per Day Salary', 'Basic', 'DA', 'Basic', 'DA',
      'Extra Hours', 'Gross Earnings', 'PF 12%', 'ESI 0.75 %', 'Food',
      'Uniform', 'Deduction', 'TakeHome'
    ]
  ];

  // Add employee data
  const employeeRows = data.employees.map(emp => [
    emp.slNo, emp.empNo, emp.name, emp.pfNumber, emp.esiNumber,
    emp.workedDays, emp.otHrs, emp.perDaySalary, emp.basic, emp.da,
    emp.basicTotal, emp.daTotal, emp.extraHours, emp.grossEarnings,
    emp.pf12, emp.esi075, emp.food, emp.uniform, emp.deduction,
    emp.takeHome, emp.paymentMode
  ]);

  // Add totals row
  const totalsRow = [
    '', '', '', '', '', 
    data.totals.totalDays, data.totals.totalOtHrs, '', '', '',
    '', '', '', data.totals.totalGrossEarnings, data.totals.totalPf,
    data.totals.totalEsi, data.totals.totalFood, data.totals.totalUniform,
    data.totals.totalDeductions, data.totals.totalTakeHome, ''
  ];

  // Combine all data
  const wsData = [...headerRows, ...employeeRows, totalsRow];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = [
    { wch: 5 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
    { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 8 },
    { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 8 },
    { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 12 },
    { wch: 10 }
  ];
  ws['!cols'] = colWidths;

  // Merge cells for header
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 20 } }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Salary Statement');
  return wb;
};

// Mock data generators for testing
export const generateMockPayslipData = (): PayslipData[] => [
  {
    empNo: 'XACT042',
    employeeName: 'SURAJ TIRIA',
    designation: 'UNSKILLED',
    dateOfJoin: '',
    daysPresent: '551/28.00',
    lateMin: 0,
    otHrs: '59.74 / 89.00',
    payMonth: 'MAY',
    payYear: '2025',
    unitName: 'XACT',
    uanNo: '102043533336',
    esiNo: '513571242O',
    earnings: {
      basic: 15441.00,
      hra: 0.00,
      conveyance: 0.00,
      otherAllowance: 0.00,
      overtimeAmount: 5317.00,
      trimAllowance: 0.00
    },
    deductions: {
      pf: 1800.00,
      esi: 156.00,
      advance: 0.00,
      foodAllowance: 806.00,
      rent: 0.00,
      other: 200.00
    },
    totalEarnings: 20758.00,
    totalDeductions: 2962.00,
    netPay: 17796.00
  }
];

export const generateMockSalaryStatementData = (): SalaryStatementData => ({
  employees: [
    {
      slNo: 1,
      empNo: 'XACT013',
      name: 'MAN SINGH PINGUA',
      pfNumber: 'TU1795817293',
      esiNumber: '5134716350',
      workedDays: 27,
      otHrs: 97.50,
      perDaySalary: 551,
      basic: 331,
      da: 221,
      basicTotal: 8934,
      daTotal: 5956,
      extraHours: 5825,
      grossEarnings: 20715,
      pf12: 1787,
      esi075: 155.00,
      food: 778,
      uniform: 200,
      deduction: 2920,
      takeHome: 17795,
      paymentMode: 'BANK'
    }
  ],
  totals: {
    totalDays: 649,
    totalOtHrs: 1732,
    totalGrossEarnings: 190389,
    totalPf: 12195,
    totalEsi: 104202,
    totalFood: 415886,
    totalUniform: 36813,
    totalDeductions: 3119,
    totalTakeHome: 14196,
    totalFood: 4200
  }
});
