import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import ProfileCard from '../components/dashboard/ProfileCard';
import TabBar from '../components/layout/TabBar';
import OverviewTab from '../components/dashboard/OverviewTab';
import AttendanceTab from '../components/dashboard/AttendanceTab';
import MarksTab from '../components/dashboard/MarksTab';
import SyllabusTab from '../components/dashboard/SyllabusTab';
import Footer from '../components/layout/Footer';

export default function DashboardPage() {
  // studentId comes straight from the URL: /profile/:studentId
  const { studentId } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':   return <OverviewTab   studentId={studentId} />;
      case 'Attendance': return <AttendanceTab studentId={studentId} />;
      case 'Marks':      return <MarksTab      studentId={studentId} />;
      case 'Syllabus':   return <SyllabusTab   studentId={studentId} />;
      default:           return <OverviewTab   studentId={studentId} />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <ProfileCard studentId={studentId} />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content-container" style={{ padding: '0 20px', marginTop: '20px' }}>
        {renderTabContent()}
      </div>

      <Footer />
    </div>
  );
}
