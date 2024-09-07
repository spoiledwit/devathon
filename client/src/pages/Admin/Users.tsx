import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, Trash2, Loader, UserMinus, UserCheck, UserPlus, Edit } from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [registerAgentDialogOpen, setRegisterAgentDialogOpen] = useState<boolean>(false);
  const [newAgent, setNewAgent] = useState<{ name: string; email: string; password: string }>({
    name: '',
    email: '',
    password: '',
  });
  const [updateUserDialogOpen, setUpdateUserDialogOpen] = useState<boolean>(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);

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
      await axios.delete(`${BASE_URL}/admin/user/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
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

  const handleRegisterAgent = async () => {
    try {
      await axios.post(`${BASE_URL}/admin/agent`, newAgent, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      toast.success('Agent registered successfully');
      fetchUsers();
      setRegisterAgentDialogOpen(false);
      setNewAgent({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error registering agent:', error);
      toast.error('Failed to register agent');
    }
  };

  const handleUpdateUser = async () => {
    if (!userToUpdate) return;

    try {
      await axios.put(`${BASE_URL}/admin/user/${userToUpdate._id}`, userToUpdate, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      toast.success('User updated successfully');
      fetchUsers();
      setUpdateUserDialogOpen(false);
      setUserToUpdate(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setRegisterAgentDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Register Agent
        </Button>
      </div>
      
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
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setUserToUpdate(user);
                        setUpdateUserDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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

      <Dialog open={registerAgentDialogOpen} onOpenChange={setRegisterAgentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Agent</DialogTitle>
            <DialogDescription>
              Enter the details of the new agent.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegisterAgentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRegisterAgent}>Register Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={updateUserDialogOpen} onOpenChange={setUpdateUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Update the details of the user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="updateName" className="text-right">
                Name
              </Label>
              <Input
                id="updateName"
                value={userToUpdate?.name || ''}
                onChange={(e) => setUserToUpdate(prev => prev ? {...prev, name: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="updateEmail" className="text-right">
                Email
              </Label>
              <Input
                id="updateEmail"
                type="email"
                value={userToUpdate?.email || ''}
                onChange={(e) => setUserToUpdate(prev => prev ? {...prev, email: e.target.value} : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="updateRole" className="text-right">
                Role
              </Label>
              <select
                id="updateRole"
                value={userToUpdate?.role || ''}
                onChange={(e) => setUserToUpdate(prev => prev ? {...prev, role: e.target.value as 'admin' | 'user' | 'agent'} : null)}
                className="col-span-3 p-2 rounded-md border border-gray-300"
              >
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;