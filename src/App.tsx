
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
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
import AnalyticsOverview from "./pages/Analytics/AnalyticsOverview";
import PerformanceAnalytics from "./pages/Analytics/PerformanceAnalytics";
import CustomReports from "./pages/Analytics/CustomReports";
import WorkforcePlanning from "./pages/Planning/WorkforcePlanning";
import ComplianceManagement from "./pages/Compliance/ComplianceManagement";
import PerformanceManagement from "./pages/Performance/PerformanceManagement";
import RecruitmentManagement from "./pages/Recruitment/RecruitmentManagement";
import CandidatePipeline from "./pages/Recruitment/CandidatePipeline";
import InterviewSchedule from "./pages/Recruitment/InterviewSchedule";
import LearningDevelopment from "./pages/Learning/LearningDevelopment";
import CourseCatalog from "./pages/Learning/CourseCatalog";
import MyLearning from "./pages/Learning/MyLearning";
import Certifications from "./pages/Learning/Certifications";
import PayrollManagement from "./pages/Payroll/PayrollManagement";
import PayrollProcessing from "./pages/Payroll/PayrollProcessing";
import CompensationPlans from "./pages/Payroll/CompensationPlans";
import BenefitsManagement from "./pages/Payroll/BenefitsManagement";
import ReportsManagement from "./pages/Reports/ReportsManagement";
import HRAnalytics from "./pages/Reports/HRAnalytics";
import ComplianceReports from "./pages/Reports/ComplianceReports";
import AdminManagement from "./pages/Admin/AdminManagement";
import UserManagement from "./pages/Admin/UserManagement";
import SystemConfig from "./pages/Admin/SystemConfig";
import SecuritySettings from "./pages/Admin/SecuritySettings";
import SettingsManagement from "./pages/Settings/SettingsManagement";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
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
                
                {/* Analytics Routes */}
                <Route path="analytics/workforce" element={<WorkforceAnalytics />} />
                <Route path="analytics/overview" element={<AnalyticsOverview />} />
                <Route path="analytics/performance" element={<PerformanceAnalytics />} />
                <Route path="analytics/reports" element={<CustomReports />} />
                
                <Route path="planning/workforce" element={<WorkforcePlanning />} />
                <Route path="compliance" element={<ComplianceManagement />} />
                
                {/* Performance Management */}
                <Route path="performance/*" element={<PerformanceManagement />} />
                
                {/* Recruitment & Talent Routes */}
                <Route path="recruitment" element={<RecruitmentManagement />} />
                <Route path="recruitment/jobs" element={<RecruitmentManagement />} />
                <Route path="recruitment/candidates" element={<CandidatePipeline />} />
                <Route path="recruitment/interviews" element={<InterviewSchedule />} />
                
                {/* Learning & Development Routes */}
                <Route path="learning" element={<LearningDevelopment />} />
                <Route path="learning/catalog" element={<CourseCatalog />} />
                <Route path="learning/my-learning" element={<MyLearning />} />
                <Route path="learning/certifications" element={<Certifications />} />
                
                {/* Payroll Management Routes */}
                <Route path="payroll" element={<PayrollManagement />} />
                <Route path="payroll/processing" element={<PayrollProcessing />} />
                <Route path="payroll/compensation" element={<CompensationPlans />} />
                <Route path="payroll/benefits" element={<BenefitsManagement />} />
                
                {/* Reports Routes */}
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="reports/hr-analytics" element={<HRAnalytics />} />
                <Route path="reports/custom" element={<CustomReports />} />
                <Route path="reports/compliance" element={<ComplianceReports />} />
                
                {/* Admin Routes */}
                <Route path="admin" element={<AdminManagement />} />
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="admin/system" element={<SystemConfig />} />
                <Route path="admin/config" element={<SystemConfig />} />
                <Route path="admin/security" element={<SecuritySettings />} />
                
                {/* Settings Routes */}
                <Route path="settings" element={<SettingsManagement />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
