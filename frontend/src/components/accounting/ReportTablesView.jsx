import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Search, RefreshCw, 
  AlertCircle, Wallet, Receipt, Users, 
  X, Filter, Sparkles 
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import { formatDisplayDate } from '../../utils/accountingUtils';
import RemainingFeesTable from './RemainingFeesTable';
import DayWiseCollectionTable from './DayWiseCollectionTable';
import StudentListTable from './StudentListTable';
import ReportSummaryFooter from './ReportSummaryFooter';
import './ReportTablesView.css';

export default function ReportTablesView() {
  const [activeReport, setActiveReport] = useState('remaining-fees');
  
  // Date filter inputs
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-05');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // Intelligent date presets based on report type
  const handleReportSwitch = (reportKey) => {
    setActiveReport(reportKey);
    setSelectedRowId(null);
    setSearchTerm('');
    setSortField(null);
    if (reportKey === 'remaining-fees') {
      setFromDate('2026-09-01');
      setToDate('2026-09-05');
    } else if (reportKey === 'day-wise') {
      setFromDate('2026-05-12');
      setToDate('2026-05-12');
    } else if (reportKey === 'student-list') {
      setFromDate('2026-05-01');
      setToDate('2026-05-06');
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      let endpoint = '';
      if (activeReport === 'remaining-fees') {
        endpoint = `/api/accounting/reports/remaining-fees?${params.toString()}`;
      } else if (activeReport === 'day-wise') {
        endpoint = `/api/accounting/reports/day-wise-collection?${params.toString()}`;
      } else if (activeReport === 'student-list') {
        endpoint = `/api/accounting/reports/student-list?${params.toString()}`;
      }

      const res = await apiRequest(endpoint);
      setReportData(res);
      if (res?.data && res.data.length > 0) {
        setSelectedRowId(res.data[0].id);
      } else {
        setSelectedRowId(null);
      }
    } catch (err) {
      logger.error('ReportTablesView', `Failed to load ${activeReport} report data:`, err);
      setError(err.message || 'Failed to load report data');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever report tab changes
  useEffect(() => {
    fetchReport();
  }, [activeReport]);

  const handleShowClick = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted items
  const processedData = useMemo(() => {
    if (!reportData?.data) return [];
    let items = [...reportData.data];

    // 1. Instant client-side search across visible columns
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      items = items.filter(r => {
        const nameMatch = r.name && String(r.name).toLowerCase().includes(q);
        const idMatch = (r.memberid || r.id) && String(r.memberid || r.id).toLowerCase().includes(q);
        const courseMatch = r.course && String(r.course).toLowerCase().includes(q);
        const recnoMatch = r.recno && String(r.recno).toLowerCase().includes(q);
        const pmodeMatch = r.pmode && String(r.pmode).toLowerCase().includes(q);
        return nameMatch || idMatch || courseMatch || recnoMatch || pmodeMatch;
      });
    }

    // 2. Client-side sorting
    if (sortField) {
      items.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'remainFee' || sortField === 'amount' || sortField === 'finalFee' || sortField === 'id') {
          valA = Number(valA) || 0;
          valB = Number(valB) || 0;
        } else {
          valA = String(valA || '').toLowerCase();
          valB = String(valB || '').toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [reportData, searchTerm, sortField, sortDirection]);

  // Dynamic aggregates based on filtered rows
  const aggregates = useMemo(() => {
    if (!processedData || processedData.length === 0) {
      return {
        totalRemainFee: 0,
        totalAmount: 0,
        cashAmount: 0,
        bankAmount: 0,
        totalAdmissions: 0,
        totalFinalFee: 0,
        count: 0
      };
    }

    let totalRemain = 0;
    let totalAmt = 0;
    let cashAmt = 0;
    let bankAmt = 0;
    let totalFinal = 0;

    processedData.forEach(r => {
      totalRemain += (Number(r.remainFee) || 0);
      const amt = Number(r.amount) || 0;
      totalAmt += amt;
      const mode = String(r.pmode || '').toLowerCase();
      if (mode === 'cash') cashAmt += amt;
      else if (mode === 'bank' || mode === 'online' || mode === 'upi') bankAmt += amt;
      totalFinal += (Number(r.finalFee) || 0);
    });

    return {
      totalRemainFee: totalRemain,
      totalAmount: totalAmt,
      cashAmount: cashAmt,
      bankAmount: bankAmt,
      totalAdmissions: processedData.length,
      totalFinalFee: totalFinal,
      count: processedData.length
    };
  }, [processedData]);

  return (
    <div className="report-tables-wrapper">
      {/* ── 1. Modern Report Selector Bar ── */}
      <div className="report-selector-bar">
        <div className="report-pills-group">
          <button 
            type="button"
            className={`report-selector-pill ${activeReport === 'remaining-fees' ? 'active' : ''}`}
            onClick={() => handleReportSwitch('remaining-fees')}
          >
            <Wallet size={15} className="pill-icon" />
            <span>Remaining Fee Report</span>
          </button>
          <button 
            type="button"
            className={`report-selector-pill ${activeReport === 'day-wise' ? 'active' : ''}`}
            onClick={() => handleReportSwitch('day-wise')}
          >
            <Receipt size={15} className="pill-icon" />
            <span>Day Wise Collection Report</span>
          </button>
          <button 
            type="button"
            className={`report-selector-pill ${activeReport === 'student-list' ? 'active' : ''}`}
            onClick={() => handleReportSwitch('student-list')}
          >
            <Users size={15} className="pill-icon" />
            <span>Student Admissions List</span>
          </button>
        </div>
      </div>

      {/* ── 2. Executive Report Sheet Card ── */}
      <div className="report-sheet-card">
        {/* Header Banner */}
        <div className="report-header-banner">
          <div className="header-banner-left">
            <div className="report-icon-avatar">
              {activeReport === 'remaining-fees' && <Wallet size={22} />}
              {activeReport === 'day-wise' && <Receipt size={22} />}
              {activeReport === 'student-list' && <Users size={22} />}
            </div>
            <div className="report-header-titles">
              <span className="report-institution-name">Laxan Educational Institute • Accounts</span>
              <h2 className="report-main-title">
                {activeReport === 'remaining-fees' && 'Remaining Fee Outstanding Report'}
                {activeReport === 'day-wise' && 'Day Wise Fee Collection Report'}
                {activeReport === 'student-list' && 'Student Admission & Fee Register'}
              </h2>
            </div>
          </div>

          <div className="header-banner-right">
            <div className="header-badge-chip">
              <Calendar size={13} />
              <span>{fromDate ? formatDisplayDate(fromDate) : 'Start'} to {toDate ? formatDisplayDate(toDate) : 'Present'}</span>
            </div>
            <div className="header-badge-chip gold">
              <Sparkles size={13} />
              <span>{processedData.length} Records</span>
            </div>
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="report-control-toolbar">
          <div className="toolbar-primary-row">
            <form onSubmit={handleShowClick} className="date-filters-form">
              <div className="filter-input-group">
                <label className="filter-label-text">
                  <Calendar size={12} />
                  <span>From Date</span>
                </label>
                <div className="date-input-wrapper">
                  <input 
                    type="date"
                    className="modern-date-input"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-input-group">
                <label className="filter-label-text">
                  <Calendar size={12} />
                  <span>To Date</span>
                </label>
                <div className="date-input-wrapper">
                  <input 
                    type="date"
                    className="modern-date-input"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="filter-apply-btn" disabled={loading}>
                {loading ? <RefreshCw size={14} className="spin" /> : <Filter size={14} />}
                <span>{loading ? 'Filtering...' : 'Apply Date Filter'}</span>
              </button>
            </form>

            {/* In-table Live Search Input */}
            <div className="live-search-box">
              <Search size={15} className="live-search-icon" />
              <input
                type="text"
                className="live-search-input"
                placeholder="Search name, receipt, course, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="search-clear-btn" 
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Modular High-Performance Data Tables ── */}
        <div className="table-data-wrapper">
          {error ? (
            <div className="error-table-state">
              <AlertCircle size={32} color="#ef4444" />
              <h4 className="empty-state-title text-danger">Unable to load report</h4>
              <p className="empty-state-desc">{error}</p>
              <button type="button" onClick={fetchReport} className="filter-apply-btn mt-2">
                <RefreshCw size={14} />
                <span>Retry Fetch</span>
              </button>
            </div>
          ) : loading ? (
            <div className="loading-table-state">
              <div className="loading-spinner-ring" />
              <h4 className="empty-state-title">Retrieving Financial Ledger...</h4>
              <p className="empty-state-desc">Compiling institutional records and balances</p>
            </div>
          ) : processedData.length === 0 ? (
            <div className="empty-table-state">
              <div className="empty-state-icon">
                <Search size={24} />
              </div>
              <h4 className="empty-state-title">No Records Found</h4>
              <p className="empty-state-desc">
                {searchTerm 
                  ? `No records match your search "${searchTerm}". Try clearing your search keyword.`
                  : 'No entries were recorded for the selected date range. Please select another date range.'
                }
              </p>
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} className="filter-apply-btn mt-2">
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <>
              {activeReport === 'remaining-fees' && (
                <RemainingFeesTable
                  data={processedData}
                  selectedRowId={selectedRowId}
                  onSelectRow={setSelectedRowId}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              )}

              {activeReport === 'day-wise' && (
                <DayWiseCollectionTable
                  data={processedData}
                  selectedRowId={selectedRowId}
                  onSelectRow={setSelectedRowId}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              )}

              {activeReport === 'student-list' && (
                <StudentListTable
                  data={processedData}
                  selectedRowId={selectedRowId}
                  onSelectRow={setSelectedRowId}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              )}
            </>
          )}
        </div>

        {/* ── 4. Executive Financial KPI Summary Footer ── */}
        {!loading && (
          <ReportSummaryFooter 
            activeReport={activeReport} 
            aggregates={aggregates} 
          />
        )}
      </div>
    </div>
  );
}
