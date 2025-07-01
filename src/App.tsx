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
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                {/* Employee Management */}
                <Route path="/employees" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EmployeeDirectory />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/employees/add" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AddEmployee />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/employees/:id" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EmployeeProfile />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/employees/org-chart" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <OrgChart />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Time Management */}
                <Route path="/time/tracking" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TimeTracking />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/time/timesheets" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Timesheets />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/time/attendance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Attendance />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Leave Management */}
                <Route path="/leave" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LeaveManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/leave/apply" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LeaveApplication />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/leave/calendar" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LeaveCalendar />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/leave/attendance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LeaveAttendance />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Recruitment */}
                <Route path="/recruitment" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <RecruitmentManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/recruitment/pipeline" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CandidatePipeline />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/recruitment/interviews" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <InterviewSchedule />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Performance */}
                <Route path="/performance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PerformanceManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Payroll */}
                <Route path="/payroll" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PayrollManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/payroll/processing" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PayrollProcessing />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/payroll/benefits" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <BenefitsManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/payroll/compensation" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CompensationPlans />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Learning & Development */}
                <Route path="/learning" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <LearningDevelopment />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/learning/catalog" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CourseCatalog />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/learning/my-learning" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MyLearning />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/learning/certifications" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Certifications />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Workforce Planning */}
                <Route path="/planning/workforce" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <WorkforcePlanning />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/planning/succession" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SuccessionPlanning />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/planning/skills" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SkillManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Analytics */}
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AnalyticsOverview />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/analytics/workforce" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <WorkforceAnalytics />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/analytics/performance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PerformanceAnalytics />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/analytics/reports" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CustomReports />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Reports */}
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ReportsManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports/hr-analytics" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <HRAnalytics />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/reports/compliance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ComplianceReports />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Compliance */}
                <Route path="/compliance" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ComplianceManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AdminManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/security" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SecuritySettings />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/system" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SystemConfig />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Settings */}
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SettingsManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />

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
