
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeDirectory from "./pages/Employees/EmployeeDirectory";
import TimeTracking from "./pages/Time/TimeTracking";
import LeaveManagement from "./pages/Leave/LeaveManagement";
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
            <Route path="time/tracking" element={<TimeTracking />} />
            <Route path="leave/my-leaves" element={<LeaveManagement />} />
            <Route path="employees/add" element={<div className="p-6"><h1 className="text-2xl font-bold">Add Employee</h1><p className="text-gray-600">Employee registration form coming soon...</p></div>} />
            <Route path="employees/org-chart" element={<div className="p-6"><h1 className="text-2xl font-bold">Organizational Chart</h1><p className="text-gray-600">Interactive org chart coming soon...</p></div>} />
            <Route path="time/attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Attendance</h1><p className="text-gray-600">Attendance tracking coming soon...</p></div>} />
            <Route path="time/timesheets" element={<div className="p-6"><h1 className="text-2xl font-bold">Timesheets</h1><p className="text-gray-600">Timesheet management coming soon...</p></div>} />
            <Route path="leave/apply" element={<div className="p-6"><h1 className="text-2xl font-bold">Apply for Leave</h1><p className="text-gray-600">Leave application form coming soon...</p></div>} />
            <Route path="leave/calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Leave Calendar</h1><p className="text-gray-600">Team leave calendar coming soon...</p></div>} />
            <Route path="performance/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Performance Management</h1><p className="text-gray-600">Performance features coming soon...</p></div>} />
            <Route path="payroll/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Payroll Management</h1><p className="text-gray-600">Payroll features coming soon...</p></div>} />
            <Route path="learning/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Learning & Development</h1><p className="text-gray-600">Learning management coming soon...</p></div>} />
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
