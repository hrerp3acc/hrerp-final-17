
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import EmployeeDirectory from '@/pages/Employees/EmployeeDirectory';
import AddEmployee from '@/pages/Employees/AddEmployee';
import EmployeeProfile from '@/pages/Employees/EmployeeProfile';
import OrgChart from '@/pages/Employees/OrgChart';
import TimeTracking from '@/pages/Time/TimeTracking';
import Timesheets from '@/pages/Time/Timesheets';
import Attendance from '@/pages/Time/Attendance';
import LeaveManagement from '@/pages/Leave/LeaveManagement';
import LeaveApplication from '@/pages/Leave/LeaveApplication';
import LeaveCalendar from '@/pages/Leave/LeaveCalendar';
import LeaveAttendance from '@/pages/Leave/LeaveAttendance';
import RecruitmentManagement from '@/pages/Recruitment/RecruitmentManagement';
import CandidatePipeline from '@/pages/Recruitment/CandidatePipeline';
import InterviewSchedule from '@/pages/Recruitment/InterviewSchedule';
import PerformanceManagement from '@/pages/Performance/PerformanceManagement';
import PayrollManagement from '@/pages/Payroll/PayrollManagement';
import PayrollProcessing from '@/pages/Payroll/PayrollProcessing';
import BenefitsManagement from '@/pages/Payroll/BenefitsManagement';
import CompensationPlans from '@/pages/Payroll/CompensationPlans';
import LearningDevelopment from '@/pages/Learning/LearningDevelopment';
import CourseCatalog from '@/pages/Learning/CourseCatalog';
import MyLearning from '@/pages/Learning/MyLearning';
import Certifications from '@/pages/Learning/Certifications';
import WorkforcePlanning from '@/pages/Planning/WorkforcePlanning';
import SuccessionPlanning from '@/pages/Planning/SuccessionPlanning';
import SkillManagement from '@/pages/Planning/SkillManagement';
import AnalyticsOverview from '@/pages/Analytics/AnalyticsOverview';
import WorkforceAnalytics from '@/pages/Analytics/WorkforceAnalytics';
import PerformanceAnalytics from '@/pages/Analytics/PerformanceAnalytics';
import CustomReports from '@/pages/Analytics/CustomReports';
import ReportsManagement from '@/pages/Reports/ReportsManagement';
import HRAnalytics from '@/pages/Reports/HRAnalytics';
import ComplianceReports from '@/pages/Reports/ComplianceReports';
import ComplianceManagement from '@/pages/Compliance/ComplianceManagement';
import AdminManagement from '@/pages/Admin/AdminManagement';
import UserManagement from '@/pages/Admin/UserManagement';
import SecuritySettings from '@/pages/Admin/SecuritySettings';
import SystemConfig from '@/pages/Admin/SystemConfig';
import SettingsManagement from '@/pages/Settings/SettingsManagement';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes with Layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  
                  {/* Employee Management */}
                  <Route path="employees" element={<EmployeeDirectory />} />
                  <Route path="employees/add" element={<AddEmployee />} />
                  <Route path="employees/:id" element={<EmployeeProfile />} />
                  <Route path="employees/org-chart" element={<OrgChart />} />

                  {/* Time Management */}
                  <Route path="time/tracking" element={<TimeTracking />} />
                  <Route path="time/timesheets" element={<Timesheets />} />
                  <Route path="time/attendance" element={<Attendance />} />

                  {/* Leave Management */}
                  <Route path="leave" element={<LeaveManagement />} />
                  <Route path="leave/apply" element={<LeaveApplication />} />
                  <Route path="leave/calendar" element={<LeaveCalendar />} />
                  <Route path="leave/attendance" element={<LeaveAttendance />} />

                  {/* Recruitment */}
                  <Route path="recruitment" element={<RecruitmentManagement />} />
                  <Route path="recruitment/pipeline" element={<CandidatePipeline />} />
                  <Route path="recruitment/interviews" element={<InterviewSchedule />} />

                  {/* Performance */}
                  <Route path="performance" element={<PerformanceManagement />} />

                  {/* Payroll */}
                  <Route path="payroll" element={<PayrollManagement />} />
                  <Route path="payroll/processing" element={<PayrollProcessing />} />
                  <Route path="payroll/benefits" element={<BenefitsManagement />} />
                  <Route path="payroll/compensation" element={<CompensationPlans />} />

                  {/* Learning & Development */}
                  <Route path="learning" element={<LearningDevelopment />} />
                  <Route path="learning/catalog" element={<CourseCatalog />} />
                  <Route path="learning/my-learning" element={<MyLearning />} />
                  <Route path="learning/certifications" element={<Certifications />} />

                  {/* Workforce Planning */}
                  <Route path="planning/workforce" element={<WorkforcePlanning />} />
                  <Route path="planning/succession" element={<SuccessionPlanning />} />
                  <Route path="planning/skills" element={<SkillManagement />} />

                  {/* Analytics */}
                  <Route path="analytics" element={<AnalyticsOverview />} />
                  <Route path="analytics/workforce" element={<WorkforceAnalytics />} />
                  <Route path="analytics/performance" element={<PerformanceAnalytics />} />
                  <Route path="analytics/reports" element={<CustomReports />} />

                  {/* Reports */}
                  <Route path="reports" element={<ReportsManagement />} />
                  <Route path="reports/hr-analytics" element={<HRAnalytics />} />
                  <Route path="reports/compliance" element={<ComplianceReports />} />

                  {/* Compliance */}
                  <Route path="compliance" element={<ComplianceManagement />} />

                  {/* Admin */}
                  <Route path="admin" element={<AdminManagement />} />
                  <Route path="admin/users" element={<UserManagement />} />
                  <Route path="admin/security" element={<SecuritySettings />} />
                  <Route path="admin/system" element={<SystemConfig />} />

                  {/* Settings */}
                  <Route path="settings" element={<SettingsManagement />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
