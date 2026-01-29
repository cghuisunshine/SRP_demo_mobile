import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Search, UserPlus, Edit2, Shield, User, ShieldAlert } from 'lucide-react';

export function UserManagement() {
    const { users, fetchUsers } = useStore();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase());

            const matchesRole = roleFilter === 'all' || u.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-50 text-red-600';
            case 'inspector': return 'bg-blue-50 text-blue-600';
            case 'client': return 'bg-green-50 text-green-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
                <Button className="bg-[#6B8E5F] hover:bg-[#5a7850] text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-[#6B8E5F]/20 flex gap-2">
                    <UserPlus size={20} />
                    Add New User
                </Button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B8E5F] transition-colors" size={18} />
                    <Input
                        placeholder="Search by name or email..."
                        className="h-11 pl-11 border-gray-100 bg-white/50 focus-visible:ring-[#6B8E5F] rounded-xl font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="h-11 border-gray-100 bg-white/50 focus:ring-[#6B8E5F] rounded-xl font-medium">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <Card className="overflow-hidden border-gray-100 shadow-sm rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Associated Strata</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#6B8E5F] font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className={`${getRoleColor(u.role)} border-none font-bold text-[10px] uppercase tracking-wider px-2 py-1`}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.strataId ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Shield size={14} className="text-[#6B8E5F]" />
                                                {u.strataId}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Internal Staff</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#6B8E5F] hover:bg-[#6B8E5F]/5 rounded-lg">
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <ShieldAlert size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center">
                            <User size={48} className="mx-auto mb-4 text-gray-200" />
                            <p className="text-gray-400 font-bold">No users found matching your search.</p>
                            <Button variant="link" className="text-[#6B8E5F] font-bold" onClick={() => { setSearch(''); setRoleFilter('all'); }}>
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
