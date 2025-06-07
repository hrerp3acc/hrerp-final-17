
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import UserManagementDialog from '@/components/Admin/UserManagementDialog';
import { 
  SystemUser, 
  fetchSystemUsers,
  formatLastLogin
} from '@/utils/adminUtils';
import { 
  Search, Plus, Edit, Trash2, RefreshCw, Download
} from 'lucide-react';

const UserManagementTab = () => {
  const { toast } = useToast();
  
  // State management
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SystemUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [userFilterStatus, setUserFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dialog states
  const [userDialog, setUserDialog] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    user?: SystemUser;
  }>({ isOpen: false, mode: 'add' });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users when search term or filters change
  useEffect(() => {
    let filtered = systemUsers;

    // Search filter
    if (userSearchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (user.department || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (user.position || '').toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }

    // Role filter
    if (userFilterRole !== 'all') {
      filtered = filtered.filter(user => user.role === userFilterRole);
    }

    // Status filter
    if (userFilterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === userFilterStatus);
    }

    setFilteredUsers(filtered);
  }, [systemUsers, userSearchTerm, userFilterRole, userFilterStatus]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const users = await fetchSystemUsers();
      setSystemUsers(users);
      console.log('Loaded users:', users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSave = (userData: Partial<SystemUser>) => {
    if (userDialog.mode === 'add') {
      const newUser = userData as SystemUser;
      setSystemUsers(prev => [...prev, newUser]);
    } else {
      setSystemUsers(prev => 
        prev.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        )
      );
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    console.log('Deleting user:', userId);
    setSystemUsers(prev => prev.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: "User has been successfully deleted.",
    });
  };

  const handleUserStatusToggle = async (userId: string) => {
    const user = systemUsers.find(u => u.id === userId);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    console.log(`Changing user ${userId} status to:`, newStatus);
    
    setSystemUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      )
    );

    toast({
      title: "Status Updated",
      description: `User has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const exportUserData = () => {
    const csvContent = [
      'Name,Email,Role,Department,Position,Status,Last Login',
      ...filteredUsers.map(user => 
        `${user.name},${user.email},${user.role},${user.department || ''},${user.position || ''},${user.status},${formatLastLogin(user.lastLogin)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "User data has been downloaded as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">User Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportUserData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setUserDialog({ isOpen: true, mode: 'add' })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="userSearch">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="userSearch"
                  placeholder="Search by name, email, department..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="roleFilter">Filter by Role</Label>
              <Select value={userFilterRole} onValueChange={setUserFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="statusFilter">Filter by Status</Label>
              <Select value={userFilterStatus} onValueChange={setUserFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={loadUsers} 
                disabled={isLoading}
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            System Users ({filteredUsers.length} of {systemUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatLastLogin(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserDialog({ 
                          isOpen: true, 
                          mode: 'edit', 
                          user 
                        })}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserStatusToggle(user.id)}
                      >
                        {user.status === 'active' ? '⏸' : '▶'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserDelete(user.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {userSearchTerm || userFilterRole !== 'all' || userFilterStatus !== 'all' 
                ? 'No users match the current filters.' 
                : 'No users found.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Management Dialog */}
      <UserManagementDialog
        user={userDialog.user}
        isOpen={userDialog.isOpen}
        onClose={() => setUserDialog({ isOpen: false, mode: 'add' })}
        onSave={handleUserSave}
        mode={userDialog.mode}
      />
    </div>
  );
};

export default UserManagementTab;
