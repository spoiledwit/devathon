import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Trash2, Loader, UserMinus, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const BASE_URL = import.meta.env.VITE_BASE_URI;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'agent';
  revenue: number;
}

interface UserStats {
  totalUsers: number;
  adminUsers: number;
  agentUsers: number;
  regularUsers: number;
}

interface UserWidgetProps {
  icon: React.ElementType;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

const UserWidget: React.FC<UserWidgetProps> = ({ icon: Icon, label, value, bgColor, iconColor, textColor }) => (
  <Card className={`${bgColor}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    </CardContent>
  </Card>
);

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    adminUsers: 0,
    agentUsers: 0,
    regularUsers: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }); 
      setUsers(response.data.users);
      updateUserStats(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStats = (userData: User[]) => {
    const stats: UserStats = {
      totalUsers: userData.length,
      adminUsers: userData.filter(user => user.role === 'admin').length,
      agentUsers: userData.filter(user => user.role === 'agent').length,
      regularUsers: userData.filter(user => user.role === 'user').length,
    };
    setUserStats(stats);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`${BASE_URL}/auth/${userToDelete._id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <UserWidget
          icon={UsersIcon}
          label="Total Users"
          value={userStats.totalUsers}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          textColor="text-blue-600"
        />
        <UserWidget
          icon={UserCheck}
          label="Admin Users"
          value={userStats.adminUsers}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          textColor="text-green-600"
        />
        <UserWidget
          icon={UserCheck}
          label="Agent Users"
          value={userStats.agentUsers}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          textColor="text-yellow-600"
        />
        <UserWidget
          icon={UserMinus}
          label="Regular Users"
          value={userStats.regularUsers}
          bgColor="bg-red-100"
          iconColor="text-red-600"
          textColor="text-red-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users Table</CardTitle>
          <CardDescription>Manage your user base</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-green-200 text-green-800' :
                      user.role === 'agent' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>${user.revenue.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;