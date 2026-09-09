import React from 'react';
import '../../styles/TabBar.css';

const tabs = ['Overview', 'Attendance', 'Marks', 'Syllabus'];

const TabBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-container">
      <div className="card tab-card d-flex justify-between">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn fw-semibold ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBar;
