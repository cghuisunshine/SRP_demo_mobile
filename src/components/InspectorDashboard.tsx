import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';

interface Inspection {
    id: string;
    strataPlan: string;
    complexName: string;
    address: string;
    date: string;
    time: string;
    status: 'Scheduled' | 'Completed' | 'ReportPending';
    notes?: string;
}

// Mock Data - In real app, fetch from /api/inspector/my-inspections
const MOCK_INSPECTIONS: Inspection[] = [
    {
        id: "insp-1",
        strataPlan: "VIS 2345",
        complexName: "Vancouver Heights",
        address: "123 High St, Vancouver, BC",
        date: "2024-03-15",
        time: "10:00 AM",
        status: "Scheduled"
    },
    {
        id: "insp-2",
        strataPlan: "EPS 9876",
        complexName: "The Grandview",
        address: "450 12th Ave, Vancouver, BC",
        date: "2024-03-20",
        time: "02:00 PM",
        status: "Scheduled"
    },
    {
        id: "insp-3",
        strataPlan: "LMS 4522",
        complexName: "Maple Ridge Estates",
        address: "8800 River Rd, Richmond, BC",
        date: "2024-02-28",
        time: "10:00 AM",
        status: "Completed"
    }
];

export function InspectorDashboard() {
    const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed'>('Upcoming');

    const filteredInspections = inspections.filter(i =>
        activeTab === 'Upcoming' ? i.status === 'Scheduled' : i.status !== 'Scheduled'
    );

    const markComplete = (id: string) => {
        setInspections(prev => prev.map(i =>
            i.id === id ? { ...i, status: 'Completed' } : i
        ));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#6B8E5F] text-white border-none shadow-lg shadow-[#6B8E5F]/20">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-xs font-bold uppercase tracking-wider">Next Inspection</p>
                            <h3 className="text-2xl font-black mt-1">Mar 15</h3>
                            <p className="text-green-100/80 text-sm mt-1">10:00 AM @ VIS 2345</p>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Navigation className="text-white" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">This Month</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">12</h3>
                            <p className="text-gray-500 text-sm mt-1">Scheduled Visits</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <Calendar className="text-gray-400" size={24} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm cursor-pointer hover:border-[#6B8E5F]/30 transition-colors group" onClick={() => window.location.href = '/inspector/availability'}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Availability</p>
                            <h3 className="text-lg font-black text-gray-900 mt-2 flex items-center gap-2 group-hover:text-[#6B8E5F]">
                                Manage Schedule
                            </h3>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#6B8E5F]/10 group-hover:text-[#6B8E5F] transition-colors">
                            <AlertCircle size={24} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* List Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                    <button
                        onClick={() => setActiveTab('Upcoming')}
                        className={`text-sm font-bold pb-2 transition-colors relative ${activeTab === 'Upcoming' ? 'text-[#6B8E5F]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Upcoming
                        {activeTab === 'Upcoming' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#6B8E5F]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('Completed')}
                        className={`text-sm font-bold pb-2 transition-colors relative ${activeTab === 'Completed' ? 'text-[#6B8E5F]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Completed / History
                        {activeTab === 'Completed' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-[#6B8E5F]" />}
                    </button>
                </div>

                <div className="grid gap-4">
                    {filteredInspections.map((insp) => (
                        <Card key={insp.id} className="border-gray-100 hover:border-[#6B8E5F]/30 transition-all hover:shadow-md group">
                            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs font-mono bg-gray-50 text-gray-500 border-gray-200">
                                            {insp.strataPlan}
                                        </Badge>
                                        <span className="text-sm font-medium text-gray-400">{insp.status}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">{insp.complexName}</h4>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {insp.date} at {insp.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {insp.address}
                                        </div>
                                    </div>
                                </div>

                                {activeTab === 'Upcoming' && (
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" className="border-gray-200 hover:bg-gray-50" onClick={() => window.location.href = `/inspector/job/${insp.id}`}>
                                            Start Inspection
                                        </Button>
                                        <Button
                                            onClick={() => markComplete(insp.id)}
                                            className="bg-[#6B8E5F] hover:bg-[#5a7850] text-white shadow-md shadow-[#6B8E5F]/10"
                                        >
                                            <CheckCircle2 size={16} className="mr-2" />
                                            Mark Complete
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    {filteredInspections.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <p>No inspections found in this view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
