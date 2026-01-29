import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Search, ExternalLink, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
    'draft': 'bg-gray-100 text-gray-600',
    'documents_complete': 'bg-blue-100 text-blue-600',
    'approved': 'bg-green-100 text-green-600',
    'pending_approval': 'bg-yellow-100 text-yellow-600',
    'archived': 'bg-red-50 text-red-400',
};

export function RequestManagement() {
    const { serviceRequests, fetchRequests } = useStore();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = useMemo(() => {
        return (serviceRequests || []).filter((r) => {
            const matchesSearch =
                (r.strataPlan || '').toLowerCase().includes(search.toLowerCase()) ||
                r.serviceType.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [serviceRequests, search, statusFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Service Requests</h1>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B8E5F] transition-colors" size={18} />
                    <Input
                        placeholder="Search by Strata ID or Service Type..."
                        className="h-11 pl-11 border-gray-100 bg-white/50 focus-visible:ring-[#6B8E5F] rounded-xl font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 border-gray-100 bg-white/50 focus:ring-[#6B8E5F] rounded-xl font-medium">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="documents_complete">Documents Complete</SelectItem>
                        <SelectItem value="pending_approval">Pending Approval</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <Card className="overflow-hidden border-gray-100 shadow-sm rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Strata</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-sm text-gray-900">{r.strataPlan}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-gray-700">{r.serviceType}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className={`${statusColors[r.status] || 'bg-gray-50 text-gray-400'} border-none font-bold text-[10px] uppercase tracking-wider px-2 py-1`}>
                                            {r.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 min-w-[120px]">
                                            <Progress value={r.progress} className="h-1.5 flex-grow bg-[#6B8E5F]/10" color="#6B8E5F" />
                                            <span className="text-[11px] font-black text-[#6B8E5F]">{r.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#6B8E5F] hover:bg-[#6B8E5F]/5 rounded-lg">
                                            <ExternalLink size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRequests.length === 0 && (
                        <div className="py-20 text-center">
                            <Clock size={48} className="mx-auto mb-4 text-gray-200" />
                            <p className="text-gray-400 font-bold">No service requests found.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
