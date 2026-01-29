import { useStore } from '@/lib/store';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Shield, Clock, User, CheckCircle2 } from 'lucide-react';
import { PDFGenerator } from './PDFGenerator';

export function ProjectSummary() {
    const { getCurrentUserServiceRequest, getCurrentUserStrata } = useStore();
    const request = getCurrentUserServiceRequest();
    const strata = getCurrentUserStrata();

    if (!request || !strata) return null;

    return (
        <Card className="p-8 border-gray-100 shadow-xl shadow-gray-200/50 rounded-3xl bg-white overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[#6B8E5F]">
                <Shield size={120} />
            </div>

            <div className="relative flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-6 flex-1">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-[#6B8E5F]/10 text-[#6B8E5F] border-none font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                                Active Project
                            </Badge>
                            <span className="text-xs font-bold text-gray-400">ID: {request.id.split('-')[1]?.toUpperCase() || '2024-001'}</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            {request.serviceType}
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            {strata.complexName} — <span className="text-gray-900">{strata.strataPlan}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12} /> Status
                            </p>
                            <p className="text-sm font-bold text-gray-900 capitalize italic">{request.status.replace('_', ' ')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Contact
                            </p>
                            <p className="text-sm font-bold text-gray-900">Robyn Griesgraber</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={12} /> Approval
                            </p>
                            <p className="text-sm font-bold text-[#6B8E5F]">Council Approved</p>
                        </div>
                    </div>
                </div>

                <div className="md:w-72 flex flex-col justify-end gap-3 pt-6 md:pt-0">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overall Completion</span>
                        <span className="text-xl font-black text-[#6B8E5F]">{request.progress}%</span>
                    </div>
                    <Progress value={request.progress} className="h-3 bg-[#6B8E5F]/10" />
                    <p className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-4">Current Phase: Information Gathering</p>

                    <PDFGenerator />
                </div>
            </div>
        </Card>
    );
}
