// frontend/src/utils/accountingUtils.js
// Shared formatting and utility functions for accounting tables and reports

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
