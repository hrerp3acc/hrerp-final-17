
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Plus, Download, Edit, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimesheetEntry {
  id: string;
  date: string;
  project: string;
  task: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

const Timesheets = () => {
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: '',
    description: ''
  });

  const projects = ['Website Redesign', 'Mobile App', 'E-commerce Platform', 'Internal Tools'];
  const tasks = ['Frontend Development', 'Backend Development', 'Bug Fixes', 'Testing', 'Documentation'];

  const handleAddEntry = () => {
    if (!newEntry.project || !newEntry.task || !newEntry.hours) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const entry: TimesheetEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      project: newEntry.project,
      task: newEntry.task,
      hours: parseFloat(newEntry.hours),
      description: newEntry.description,
      status: 'draft'
    };

    setEntries([...entries, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      project: '',
      task: '',
      hours: '',
      description: ''
    });

    toast({
      title: "Success!",
      description: "Timesheet entry added successfully.",
    });
  };

  const handleStatusChange = (id: string, newStatus: TimesheetEntry['status']) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, status: newStatus } : entry
    ));

    toast({
      title: "Status Updated",
      description: `Timesheet entry ${newStatus === 'submitted' ? 'submitted for approval' : newStatus}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles];
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const weeklyTarget = 40;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
          <p className="text-gray-600">Track and manage your work hours</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Week Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Weekly Target</p>
                <p className="text-2xl font-bold text-gray-900">{weeklyTarget}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {entries.filter(e => e.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Edit className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {entries.filter(e => e.status === 'submitted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Add Time Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={newEntry.project}
                onChange={(e) => setNewEntry({...newEntry, project: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select project</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
              <select
                value={newEntry.task}
                onChange={(e) => setNewEntry({...newEntry, task: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select task</option>
                {tasks.map(task => (
                  <option key={task} value={task}>{task}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
              <Input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={newEntry.hours}
                onChange={(e) => setNewEntry({...newEntry, hours: e.target.value})}
                placeholder="8.0"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddEntry} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Input
              value={newEntry.description}
              onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
              placeholder="Describe what you worked on..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Timesheet Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your time by adding your first entry above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Task</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-900">{entry.project}</td>
                      <td className="py-3 px-4 text-gray-600">{entry.task}</td>
                      <td className="py-3 px-4 text-gray-900">{entry.hours}h</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {entry.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {entry.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(entry.id, 'submitted')}
                            >
                              Submit
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Timesheets;
