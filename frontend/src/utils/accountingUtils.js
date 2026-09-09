// frontend/src/utils/accountingUtils.js
// Shared formatting and utility functions for accounting tables and reports

/**
 * Calculates the current week date range (Monday to Sunday) in local YYYY-MM-DD format.
 */
export function getCurrentWeekRange(referenceDate = new Date()) {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatLocalYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  };

  return {
    from: formatLocalYMD(monday),
    to: formatLocalYMD(sunday)
  };
}

/**
 * Formats a numeric value into INR currency format (e.g. ₹12,500.00)
 */
export function formatCurrency(num) {
  const val = Number(num) || 0;
  return '₹' + val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Formats date strings (YYYY-MM-DD or DD-MM-YYYY) to user-friendly format (e.g. 05 Sep 2026)
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  const parts = String(dateStr).split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    } else if (parts[2].length === 4) {
      // DD-MM-YYYY
      const d = new Date(parts[2], parts[1] - 1, parts[0]);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }
  }
  return dateStr;
}

/**
 * Returns true if a due date is before today's start of day
 */
export function isDateOverdue(dateStr) {
  if (!dateStr) return false;
  try {
    const parts = String(dateStr).split(/[-/]/);
    let targetDate = null;
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else if (parts[2].length === 4) {
        targetDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    if (targetDate && !isNaN(targetDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return targetDate < today;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Maps course names to their corresponding CSS badge class
 */
export function getCourseBadgeClass(course) {
  const name = String(course || '').toLowerCase();
  if (name.includes('bca')) return 'bca';
  if (name.includes('dca')) return 'dca';
  if (name.includes('adca')) return 'adca';
  if (name.includes('ccc')) return 'ccc';
  return 'default';
}

/**
 * Maps payment modes to their corresponding CSS badge class
 */
export function getPaymentModeBadgeClass(pmode) {
  const mode = String(pmode || '').toLowerCase().trim();
  if (mode === 'cash') return 'cash';
  if (mode === 'bank' || mode === 'online' || mode === 'upi') return 'bank';
  if (mode === 'cheque') return 'cheque';
  return 'other';
}
