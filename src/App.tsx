
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

// Protected Route Wrapper Component
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <MainLayout>
        {children}
      </MainLayout>
    </ProtectedRoute>
  );
};

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
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
                
                {/* Employee Management */}
                <Route path="/employees" element={<ProtectedLayout><EmployeeDirectory /></ProtectedLayout>} />
                <Route path="/employees/add" element={<ProtectedLayout><AddEmployee /></ProtectedLayout>} />
                <Route path="/employees/:id" element={<ProtectedLayout><EmployeeProfile /></ProtectedLayout>} />
                <Route path="/employees/org-chart" element={<ProtectedLayout><OrgChart /></ProtectedLayout>} />

                {/* Time Management */}
                <Route path="/time/tracking" element={<ProtectedLayout><TimeTracking /></ProtectedLayout>} />
                <Route path="/time/timesheets" element={<ProtectedLayout><Timesheets /></ProtectedLayout>} />
                <Route path="/time/attendance" element={<ProtectedLayout><Attendance /></ProtectedLayout>} />

                {/* Leave Management */}
                <Route path="/leave" element={<ProtectedLayout><LeaveManagement /></ProtectedLayout>} />
                <Route path="/leave/apply" element={<ProtectedLayout><LeaveApplication /></ProtectedLayout>} />
                <Route path="/leave/calendar" element={<ProtectedLayout><LeaveCalendar /></ProtectedLayout>} />
                <Route path="/leave/attendance" element={<ProtectedLayout><LeaveAttendance /></ProtectedLayout>} />

                {/* Recruitment */}
                <Route path="/recruitment" element={<ProtectedLayout><RecruitmentManagement /></ProtectedLayout>} />
                <Route path="/recruitment/pipeline" element={<ProtectedLayout><CandidatePipeline /></ProtectedLayout>} />
                <Route path="/recruitment/interviews" element={<ProtectedLayout><InterviewSchedule /></ProtectedLayout>} />

                {/* Performance */}
                <Route path="/performance" element={<ProtectedLayout><PerformanceManagement /></ProtectedLayout>} />

                {/* Payroll */}
                <Route path="/payroll" element={<ProtectedLayout><PayrollManagement /></ProtectedLayout>} />
                <Route path="/payroll/processing" element={<ProtectedLayout><PayrollProcessing /></ProtectedLayout>} />
                <Route path="/payroll/benefits" element={<ProtectedLayout><BenefitsManagement /></ProtectedLayout>} />
                <Route path="/payroll/compensation" element={<ProtectedLayout><CompensationPlans /></ProtectedLayout>} />

                {/* Learning & Development */}
                <Route path="/learning" element={<ProtectedLayout><LearningDevelopment /></ProtectedLayout>} />
                <Route path="/learning/catalog" element={<ProtectedLayout><CourseCatalog /></ProtectedLayout>} />
                <Route path="/learning/my-learning" element={<ProtectedLayout><MyLearning /></ProtectedLayout>} />
                <Route path="/learning/certifications" element={<ProtectedLayout><Certifications /></ProtectedLayout>} />

                {/* Workforce Planning */}
                <Route path="/planning/workforce" element={<ProtectedLayout><WorkforcePlanning /></ProtectedLayout>} />
                <Route path="/planning/succession" element={<ProtectedLayout><SuccessionPlanning /></ProtectedLayout>} />
                <Route path="/planning/skills" element={<ProtectedLayout><SkillManagement /></ProtectedLayout>} />

                {/* Analytics */}
                <Route path="/analytics" element={<ProtectedLayout><AnalyticsOverview /></ProtectedLayout>} />
                <Route path="/analytics/workforce" element={<ProtectedLayout><WorkforceAnalytics /></ProtectedLayout>} />
                <Route path="/analytics/performance" element={<ProtectedLayout><PerformanceAnalytics /></ProtectedLayout>} />
                <Route path="/analytics/reports" element={<ProtectedLayout><CustomReports /></ProtectedLayout>} />

                {/* Reports */}
                <Route path="/reports" element={<ProtectedLayout><ReportsManagement /></ProtectedLayout>} />
                <Route path="/reports/hr-analytics" element={<ProtectedLayout><HRAnalytics /></ProtectedLayout>} />
                <Route path="/reports/compliance" element={<ProtectedLayout><ComplianceReports /></ProtectedLayout>} />

                {/* Compliance */}
                <Route path="/compliance" element={<ProtectedLayout><ComplianceManagement /></ProtectedLayout>} />

                {/* Admin */}
                <Route path="/admin" element={<ProtectedLayout><AdminManagement /></ProtectedLayout>} />
                <Route path="/admin/users" element={<ProtectedLayout><UserManagement /></ProtectedLayout>} />
                <Route path="/admin/security" element={<ProtectedLayout><SecuritySettings /></ProtectedLayout>} />
                <Route path="/admin/system" element={<ProtectedLayout><SystemConfig /></ProtectedLayout>} />

                {/* Settings */}
                <Route path="/settings" element={<ProtectedLayout><SettingsManagement /></ProtectedLayout>} />

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
