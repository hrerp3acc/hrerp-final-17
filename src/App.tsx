
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeDirectory from "./pages/Employees/EmployeeDirectory";
import EmployeeProfile from "./pages/Employees/EmployeeProfile";
import AddEmployee from "./pages/Employees/AddEmployee";
import OrgChart from "./pages/Employees/OrgChart";
import TimeTracking from "./pages/Time/TimeTracking";
import Attendance from "./pages/Time/Attendance";
import Timesheets from "./pages/Time/Timesheets";
import LeaveManagement from "./pages/Leave/LeaveManagement";
import LeaveAttendance from "./pages/Leave/LeaveAttendance";
import LeaveApplication from "./pages/Leave/LeaveApplication";
import LeaveCalendar from "./pages/Leave/LeaveCalendar";
import WorkforceAnalytics from "./pages/Analytics/WorkforceAnalytics";
import WorkforcePlanning from "./pages/Planning/WorkforcePlanning";
import ComplianceManagement from "./pages/Compliance/ComplianceManagement";
import PerformanceManagement from "./pages/Performance/PerformanceManagement";
import RecruitmentManagement from "./pages/Recruitment/RecruitmentManagement";
import LearningDevelopment from "./pages/Learning/LearningDevelopment";
import PayrollManagement from "./pages/Payroll/PayrollManagement";
import ReportsManagement from "./pages/Reports/ReportsManagement";
import AdminManagement from "./pages/Admin/AdminManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="employees" element={<EmployeeDirectory />} />
              <Route path="employees/:id" element={<EmployeeProfile />} />
              <Route path="employees/add" element={<AddEmployee />} />
              <Route path="employees/org-chart" element={<OrgChart />} />
              <Route path="time/tracking" element={<TimeTracking />} />
              <Route path="time/attendance" element={<Attendance />} />
              <Route path="time/timesheets" element={<Timesheets />} />
              <Route path="leave/my-leaves" element={<LeaveManagement />} />
              <Route path="leave/attendance" element={<LeaveAttendance />} />
              <Route path="leave/apply" element={<LeaveApplication />} />
              <Route path="leave/calendar" element={<LeaveCalendar />} />
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
              
              {/* Reports & Admin pages */}
              <Route path="reports/*" element={<ReportsManagement />} />
              <Route path="admin/*" element={<AdminManagement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
