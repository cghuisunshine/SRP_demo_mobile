import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Calendar, XCircle } from 'lucide-react';
import { emitEmailEvent } from '@/lib/email';

const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-50 text-yellow-600',
    'confirmed': 'bg-green-50 text-green-600',
    'completed': 'bg-blue-50 text-blue-600',
    'cancelled': 'bg-red-50 text-red-400',
};

export function AppointmentManagement() {
    const { appointments, fetchRequests, updateAppointment } = useStore(); // We'll assume appointments are fetched with requests or separately
    const [search, setSearch] = useState('');

    const confirm = async (id: string, strataPlan: string, date: string, time: string) => {
        await updateAppointment(id, {
            status: 'confirmed',
            confirmedDate: date,
            confirmedTime: time,
        } as any);
        await emitEmailEvent('appointment_confirmed', {
            strataPlan,
            confirmedDate: date,
            confirmedTime: time,
        });
    };

    useEffect(() => {
        // In a real app we'd have fetchAppointments()
        fetchRequests();
    }, []);

    const filteredAppointments = useMemo(() => {
        return (appointments || []).filter((a) => {
            return (a.strataPlan || '').toLowerCase().includes(search.toLowerCase());
        });
    }, [appointments, search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Appointment Requests</h1>
            </div>

            {/* Search Row */}
            <div className="relative group max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6B8E5F] transition-colors" size={18} />
                <Input
                    placeholder="Search by Strata ID..."
                    className="h-11 pl-11 border-gray-100 bg-white/50 focus-visible:ring-[#6B8E5F] rounded-xl font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Data Table */}
            <Card className="overflow-hidden border-gray-100 shadow-sm rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Strata</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / Time</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAppointments.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-black text-sm text-gray-900">{a.strataPlan}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-gray-200 text-gray-400">
                                            {a.appointmentType.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-700">{a.requestedDate1}</span>
                                            <span className="text-xs text-gray-400 font-medium">{a.requestedTime1}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="secondary" className={`${statusColors[a.status] || 'bg-gray-50 text-gray-400'} border-none font-bold text-[10px] uppercase tracking-wider px-2 py-1`}>
                                            {a.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-[#6B8E5F]/20 text-[#6B8E5F] hover:bg-[#6B8E5F]/5 font-bold text-xs gap-2 px-3 rounded-lg"
                                                onClick={() => confirm(a.id, a.strataPlan, a.requestedDate1, String(a.requestedTime1))}
                                            >
                                                Confirm
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg">
                                                <XCircle size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredAppointments.length === 0 && (
                        <div className="py-20 text-center">
                            <Calendar size={48} className="mx-auto mb-4 text-gray-200" />
                            <p className="text-gray-400 font-bold">No appointment requests found.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
