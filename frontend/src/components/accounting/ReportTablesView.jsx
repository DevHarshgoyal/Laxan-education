import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  Calendar, Search, RefreshCw, 
  AlertCircle, Wallet, Receipt, Users, 
  X, Filter, Sparkles, ChevronDown, Check
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import { formatDisplayDate, getTodayDate } from '../../utils/accountingUtils';
import RemainingFeesTable from './RemainingFeesTable';
import DayWiseCollectionTable from './DayWiseCollectionTable';
import StudentListTable from './StudentListTable';
import ReportSummaryFooter from './ReportSummaryFooter';
import '../../styles/ReportTablesView.css';

// ── Report Registry Configuration ───────────────────────────────────
const REPORT_CONFIGS = {
  'remaining-fees': {
    id: 'remaining-fees',
    title: 'Remaining Fee Outstanding Report',
    shortTitle: 'Remaining Fee Report',
    icon: Wallet,
    endpoint: '/api/accounting/reports/remaining-fees',
    TableComponent: RemainingFeesTable,
  },
  'day-wise': {
    id: 'day-wise',
    title: 'Day Wise Fee Collection Report',
    shortTitle: 'Day Wise Collection Report',
    icon: Receipt,
    endpoint: '/api/accounting/reports/day-wise-collection',
    TableComponent: DayWiseCollectionTable,
  },
  'student-list': {
    id: 'student-list',
    title: 'Student Admission & Fee Register',
    shortTitle: 'Student Admissions List',
    icon: Users,
    endpoint: '/api/accounting/reports/student-list',
    TableComponent: StudentListTable,
  },
};

const NUMERIC_SORT_FIELDS = new Set(['remainFee', 'amount', 'finalFee', 'id']);

export default function ReportTablesView() {
  const [activeReport, setActiveReport] = useState('remaining-fees');
  
  // Date filter inputs — always defaulted to current date in both from and to
  const initialToday = useMemo(() => getTodayDate(), []);
  const [fromDate, setFromDate] = useState(initialToday);
  const [toDate, setToDate] = useState(initialToday);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // Mobile custom dropdown open state & outside click handler
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const activeConfig = REPORT_CONFIGS[activeReport] || REPORT_CONFIGS['remaining-fees'];
  const ActiveIcon = activeConfig.icon;
  const ActiveTable = activeConfig.TableComponent;

  // Fetch report data
  const fetchReport = useCallback(async (customFrom, customTo, customReport) => {
    const reportKey = customReport || activeReport;
    const from = customFrom !== undefined ? customFrom : fromDate;
    const to = customTo !== undefined ? customTo : toDate;
    const config = REPORT_CONFIGS[reportKey];

    if (!config) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);

      const endpoint = `${config.endpoint}?${params.toString()}`;
      const res = await apiRequest(endpoint);
      
      setReportData(res);
      setSelectedRowId(res?.data?.length > 0 ? res.data[0].id : null);
    } catch (err) {
      logger.error('ReportTablesView', `Failed to load ${reportKey} report data:`, err);
      setError(err.message || 'Failed to load report data');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [activeReport, fromDate, toDate]);

  // Tab switch handler: dynamically resets date filter to current date in both from and to
  const handleReportSwitch = (reportKey) => {
    setDropdownOpen(false);
    if (reportKey === activeReport) return;
    const today = getTodayDate();
    setActiveReport(reportKey);
    setReportData(null);
    setSelectedRowId(null);
    setSearchTerm('');
    setSortField(null);
    setFromDate(today);
    setToDate(today);
    setError(null);
  };

  const handleShowClick = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleSort = useCallback((field) => {
    setSortField(prevField => {
      if (prevField === field) {
        setSortDirection(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
        return field;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  // Filtered & Sorted items
  const processedData = useMemo(() => {
    if (!reportData?.data) return [];
    let items = [...reportData.data];

    // 1. Client-side search across relevant visible columns
    const cleanSearch = searchTerm.trim().toLowerCase();
    if (cleanSearch) {
      items = items.filter(r => {
        const searchableFields = [r.name, r.memberid || r.id, r.course, r.recno, r.pmode];
        return searchableFields.some(val => val != null && String(val).toLowerCase().includes(cleanSearch));
      });
    }

    // 2. Client-side sorting
    if (sortField) {
      const isNumeric = NUMERIC_SORT_FIELDS.has(sortField);
      items.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (isNumeric) {
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
    return processedData.reduce((acc, row) => {
      const amt = Number(row.amount) || 0;
      const mode = String(row.pmode || '').toLowerCase();

      acc.totalRemainFee += Number(row.remainFee) || 0;
      acc.totalAmount += amt;
      if (mode === 'cash') {
        acc.cashAmount += amt;
      } else if (mode === 'bank' || mode === 'online' || mode === 'upi') {
        acc.bankAmount += amt;
      }
      acc.totalFinalFee += Number(row.finalFee) || 0;

      return acc;
    }, {
      totalRemainFee: 0,
      totalAmount: 0,
      cashAmount: 0,
      bankAmount: 0,
      totalAdmissions: processedData.length,
      totalFinalFee: 0,
      count: processedData.length
    });
  }, [processedData]);

  return (
    <div className="report-tables-wrapper">
      {/* ── 1. Report Navigation (Tabs for Desktop / Dropdown for Mobile) ── */}
      <nav className="report-selector-bar" aria-label="Report Selector">
        {/* Desktop / Tablet Pills */}
        <div className="report-pills-group" role="tablist" aria-orientation="horizontal">
          {Object.values(REPORT_CONFIGS).map((config) => {
            const Icon = config.icon;
            const isActive = activeReport === config.id;
            return (
              <button 
                key={config.id}
                id={`report-tab-${config.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`report-panel-${config.id}`}
                className={`report-selector-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleReportSwitch(config.id)}
              >
                <Icon size={15} className="pill-icon" aria-hidden="true" />
                <span>{config.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Custom Dropdown Selector */}
        <div className="report-mobile-dropdown-container" ref={dropdownRef}>
          <button
            type="button"
            className={`report-dropdown-custom-card ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen(prev => !prev)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-label="Select report view"
          >
            <div className="report-dropdown-left">
              <span className="report-dropdown-icon-box" aria-hidden="true">
                <ActiveIcon size={18} />
              </span>
              <div className="report-dropdown-info">
                <span className="report-dropdown-label">Report View</span>
                <span className="report-dropdown-selected-name">{activeConfig.shortTitle}</span>
              </div>
            </div>
            <div className={`report-dropdown-chevron ${dropdownOpen ? 'rotate' : ''}`} aria-hidden="true">
              <ChevronDown size={18} />
            </div>
          </button>

          {dropdownOpen && (
            <div className="report-dropdown-menu" role="listbox" aria-label="Available Reports">
              {Object.values(REPORT_CONFIGS).map((config) => {
                const ItemIcon = config.icon;
                const isSelected = activeReport === config.id;
                return (
                  <button
                    key={config.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`report-dropdown-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleReportSwitch(config.id)}
                  >
                    <div className="dropdown-item-left">
                      <span className="dropdown-item-icon" aria-hidden="true">
                        <ItemIcon size={16} />
                      </span>
                      <div className="dropdown-item-text">
                        <span className="dropdown-item-title">{config.shortTitle}</span>
                        <span className="dropdown-item-desc">{config.title}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="dropdown-item-check" aria-hidden="true">
                        <Check size={16} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* ── 2. Master Institutional Report Card ── */}
      <section 
        className="report-sheet-card"
        role="tabpanel"
        id={`report-panel-${activeReport}`}
        aria-labelledby={`report-tab-${activeReport}`}
      >
        {/* Header Banner */}
        <header className="report-header-banner">
          <div className="header-banner-left">
            <div className="report-icon-avatar" aria-hidden="true">
              <ActiveIcon size={22} />
            </div>
            <div className="report-header-titles">
              <span className="report-institution-name">Laxan Educational Institute • Accounts</span>
              <h2 className="report-main-title">{activeConfig.title}</h2>
            </div>
          </div>

          <div className="header-banner-right">
            <div className="header-badge-chip">
              <Calendar size={13} aria-hidden="true" />
              <span>
                {fromDate && toDate && fromDate === toDate
                  ? formatDisplayDate(fromDate)
                  : `${fromDate ? formatDisplayDate(fromDate) : 'Start'} to ${toDate ? formatDisplayDate(toDate) : 'Present'}`}
              </span>
            </div>
            {reportData && (
              <div className="header-badge-chip gold">
                <Sparkles size={13} aria-hidden="true" />
                <span>{processedData.length} Records</span>
              </div>
            )}
          </div>
        </header>

        {/* Controls: Date Filter & Live Search */}
        <div className="report-control-toolbar">
          <div className="toolbar-primary-row">
            <form onSubmit={handleShowClick} className="date-filters-form">
              <div className="filter-input-group">
                <label htmlFor="report-from-date" className="filter-label-text">
                  <Calendar size={12} aria-hidden="true" />
                  <span>From Date</span>
                </label>
                <div className="date-input-wrapper">
                  <input 
                    id="report-from-date"
                    type="date"
                    className="modern-date-input"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-input-group">
                <label htmlFor="report-to-date" className="filter-label-text">
                  <Calendar size={12} aria-hidden="true" />
                  <span>To Date</span>
                </label>
                <div className="date-input-wrapper">
                  <input 
                    id="report-to-date"
                    type="date"
                    className="modern-date-input"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="filter-apply-btn" disabled={loading}>
                {loading ? <RefreshCw size={14} className="spin" aria-hidden="true" /> : <Filter size={14} aria-hidden="true" />}
                <span>{loading ? 'Filtering...' : 'Apply Date Filter'}</span>
              </button>
            </form>

            {/* In-table Live Search */}
            <div className="live-search-box">
              <Search size={15} className="live-search-icon" aria-hidden="true" />
              <input
                type="text"
                className="live-search-input"
                placeholder="Search name, receipt, course, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search records"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="search-clear-btn" 
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                  aria-label="Clear search keyword"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. Modular High-Performance Data Table ── */}
        <div className="table-data-wrapper">
          {error ? (
            <div className="error-table-state" role="alert" aria-live="assertive">
              <AlertCircle size={32} color="#ef4444" aria-hidden="true" />
              <h4 className="empty-state-title text-danger">Unable to load report</h4>
              <p className="empty-state-desc">{error}</p>
              <button type="button" onClick={() => fetchReport()} className="filter-apply-btn mt-2">
                <RefreshCw size={14} aria-hidden="true" />
                <span>Retry Fetch</span>
              </button>
            </div>
          ) : loading ? (
            <div className="loading-table-state" role="status" aria-live="polite">
              <div className="loading-spinner-ring" aria-hidden="true" />
              <h4 className="empty-state-title">Retrieving Financial Ledger...</h4>
              <p className="empty-state-desc">Compiling institutional records and balances</p>
            </div>
          ) : !reportData ? (
            <div className="empty-table-state">
              <div className="empty-state-icon" aria-hidden="true">
                <Filter size={24} />
              </div>
              <h4 className="empty-state-title">Apply Filter to View Report</h4>
              <p className="empty-state-desc">
                Select your date range above and click &quot;Apply Date Filter&quot; to load records.
              </p>
            </div>
          ) : processedData.length === 0 ? (
            <div className="empty-table-state">
              <div className="empty-state-icon" aria-hidden="true">
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
            <ActiveTable
              data={processedData}
              selectedRowId={selectedRowId}
              onSelectRow={setSelectedRowId}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>

        {/* ── 4. Financial KPI Summary Footer ── */}
        {!loading && (
          <ReportSummaryFooter 
            activeReport={activeReport} 
            aggregates={aggregates} 
          />
        )}
      </section>
    </div>
  );
}
