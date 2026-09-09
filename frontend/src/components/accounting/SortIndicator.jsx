import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function SortIndicator({ currentField, activeField, direction }) {
  if (currentField !== activeField) {
    return <ArrowUpDown size={13} className="sort-indicator" aria-hidden="true" />;
  }
  return direction === 'asc' 
    ? <ArrowUp size={13} className="sort-indicator active" aria-hidden="true" />
    : <ArrowDown size={13} className="sort-indicator active" aria-hidden="true" />;
}
