
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUser } from '@/contexts/UserContext';
import { useEmployeeSync } from '@/hooks/useEmployeeSync';
import EmployeeProfileSetup from '@/components/Employee/EmployeeProfileSetup';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  const { employee, loading, needsEmployeeProfile, createEmployeeProfile } = useEmployeeSync();
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEmployeeProfileComplete = async (employeeData: any) => {
    await createEmployeeProfile(employeeData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Employee Profile Setup Modal */}
      <EmployeeProfileSetup 
        isOpen={needsEmployeeProfile} 
        onComplete={handleEmployeeProfileComplete}
      />

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar userRole={user?.role || 'employee'} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;
