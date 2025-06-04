
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeDirectory from "./pages/Employees/EmployeeDirectory";
import EmployeeProfile from "./pages/Employees/EmployeeProfile";
import TimeTracking from "./pages/Time/TimeTracking";
import LeaveManagement from "./pages/Leave/LeaveManagement";
import WorkforceAnalytics from "./pages/Analytics/WorkforceAnalytics";
import WorkforcePlanning from "./pages/Planning/WorkforcePlanning";
import ComplianceManagement from "./pages/Compliance/ComplianceManagement";
import PerformanceManagement from "./pages/Performance/PerformanceManagement";
import RecruitmentManagement from "./pages/Recruitment/RecruitmentManagement";
import LearningDevelopment from "./pages/Learning/LearningDevelopment";
import PayrollManagement from "./pages/Payroll/PayrollManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeDirectory />} />
            <Route path="employees/:id" element={<EmployeeProfile />} />
            <Route path="time/tracking" element={<TimeTracking />} />
            <Route path="leave/my-leaves" element={<LeaveManagement />} />
            <Route path="analytics/workforce" element={<WorkforceAnalytics />} />
            <Route path="planning/workforce" element={<WorkforcePlanning />} />
            <Route path="compliance" element={<ComplianceManagement />} />
            
            {/* Performance Management */}
            <Route path="performance/*" element={<PerformanceManagement />} />
            
            {/* Recruitment & Talent */}
            <Route path="recruitment/*" element={<RecruitmentManagement />} />
            
            {/* Learning & Development */}
            <Route path="learning/*" element={<LearningDevelopment />} />
            
            {/* Payroll Management */}
            <Route path="payroll/*" element={<PayrollManagement />} />
            
            {/* Placeholder routes */}
            <Route path="employees/add" element={<div className="p-6"><h1 className="text-2xl font-bold">Add Employee</h1><p className="text-gray-600">Employee registration form coming soon...</p></div>} />
            <Route path="employees/org-chart" element={<div className="p-6"><h1 className="text-2xl font-bold">Organizational Chart</h1><p className="text-gray-600">Interactive org chart coming soon...</p></div>} />
            <Route path="time/attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Attendance</h1><p className="text-gray-600">Attendance tracking coming soon...</p></div>} />
            <Route path="time/timesheets" element={<div className="p-6"><h1 className="text-2xl font-bold">Timesheets</h1><p className="text-gray-600">Timesheet management coming soon...</p></div>} />
            <Route path="leave/apply" element={<div className="p-6"><h1 className="text-2xl font-bold">Apply for Leave</h1><p className="text-gray-600">Leave application form coming soon...</p></div>} />
            <Route path="leave/calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Leave Calendar</h1><p className="text-gray-600">Team leave calendar coming soon...</p></div>} />
            <Route path="reports/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-gray-600">Advanced reporting coming soon...</p></div>} />
            <Route path="admin/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Administration</h1><p className="text-gray-600">Admin panel coming soon...</p></div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
