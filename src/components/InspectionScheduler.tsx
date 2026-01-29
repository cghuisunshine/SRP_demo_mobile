import { useState, useMemo, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    Info,
    CalendarCheck,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

interface Slot {
    date: string;
    time: string;
    id: string;
}

export function InspectionScheduler() {
    const { documents } = useStore();

    // In a real app, we check if all mandatory docs are 'reviewed'
    const mandatoryDocs = documents.filter((d: any) => d.category === 'mandatory');
    const allApproved = mandatoryDocs.length > 0 && mandatoryDocs.every((d: any) => d.status === 'reviewed');

    const isLocked = !allApproved;

    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'submitted' | 'confirmed'>('loading');
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch('/api/logistics/available-slots');
                const data = await response.json();
                setAvailableSlots(data);
                setStatus('idle');
            } catch (error) {
                console.error('Failed to fetch slots:', error);
                setStatus('idle');
            }
        };
        fetchSlots();
    }, []);

    // Group slots by date
    const groupedSlots = useMemo(() => {
        const groups: Record<string, Slot[]> = {};
        availableSlots.forEach(slot => {
            if (!groups[slot.date]) groups[slot.date] = [];
            groups[slot.date]!.push(slot);
        });
        return Object.entries(groups).map(([date, slots]) => ({
            date: parseISO(date),
            slots
        }));
    }, [availableSlots]);

    const toggleSlot = (slot: Slot) => {
        if (selectedSlots.find(s => s.id === slot.id)) {
            setSelectedSlots(selectedSlots.filter(s => s.id !== slot.id));
        } else {
            if (selectedSlots.length >= 2) return;
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const handleSubmit = () => {
        setStatus('submitted');
    };

    if (isLocked) {
        return (
            <Card className="max-w-3xl mx-auto border-dashed border-gray-200 bg-gray-50/50">
                <CardContent className="p-12 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Lock size={32} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-gray-400">Scheduler Locked</h2>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm">
                            In accordance with project requirements, the inspection scheduler is unavailable until all mandatory documents have been <strong>reviewed and approved</strong> by our staff.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/client/documents'}
                        className="text-[#6B8E5F] border-[#6B8E5F] hover:bg-[#6B8E5F]/5"
                    >
                        Review Document Status
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (status === 'submitted') {
        return (
            <Card className="max-w-2xl mx-auto border-[#6B8E5F]/20 bg-[#6B8E5F]/5">
                <CardContent className="p-12 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-[#6B8E5F] rounded-full flex items-center justify-center text-white">
                        <CalendarCheck size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-gray-900">Request Sent!</h2>
                        <p className="text-gray-500">
                            We've received your inspection preferences. Our staff will review your choices and confirm the final date via email within 24 hours.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 text-left space-y-4">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-[#6B8E5F]">Requested Slots</h4>
                        {selectedSlots.map((slot, idx) => (
                            <div key={slot.id} className="flex justify-between items-center pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                                <span className="font-bold">{idx === 0 ? 'First Choice' : 'Alternate Choice'}</span>
                                <div className="text-right">
                                    <div className="font-black">{format(parseISO(slot.date), 'EEEE, MMM do')}</div>
                                    <div className="text-sm text-gray-500">{slot.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={() => window.location.href = '/client/dashboard'}
                        className="bg-[#6B8E5F] hover:bg-[#5a7850] px-8"
                    >
                        Done
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-full">
                    <Info size={20} className="text-blue-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-bold text-blue-900">Inspection Scheduling Rules</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        To optimize our flight-path and on-site efficiency, all inspections are conducted on <strong>Fridays</strong>.
                        Please select a <strong>primary choice</strong> and one <strong>alternate choice</strong>.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {groupedSlots.map(({ date, slots }) => (
                    <Card key={date.toISOString()} className="overflow-hidden border-gray-100">
                        <div className="bg-gray-50 p-4 border-b border-gray-100 text-center">
                            <h4 className="font-black text-gray-900">{format(date, 'MMM do')}</h4>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Friday</p>
                        </div>
                        <CardContent className="p-4 space-y-3">
                            {slots.map((slot) => {
                                const isSelected = selectedSlots.find(s => s.id === slot.id);
                                const isFirstChoice = selectedSlots[0]?.id === slot.id;

                                return (
                                    <button
                                        key={slot.id}
                                        onClick={() => toggleSlot(slot)}
                                        className={cn(
                                            "w-full py-4 px-4 rounded-xl border-2 transition-all text-left relative",
                                            isSelected
                                                ? "border-[#6B8E5F] bg-[#6B8E5F]/5"
                                                : "border-gray-50 bg-white hover:border-[#6B8E5F]/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="font-bold text-sm">{slot.time}</div>
                                            {isSelected && (
                                                <Badge className={cn(
                                                    "text-[8px] uppercase font-black",
                                                    isFirstChoice ? "bg-[#6B8E5F]" : "bg-gray-400"
                                                )}>
                                                    {isFirstChoice ? '1st' : 'Alt'}
                                                </Badge>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-6">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-black",
                        selectedSlots.length === 2 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    )}>
                        {selectedSlots.length}/2
                    </div>
                    <span className="text-sm font-bold text-gray-500">
                        {selectedSlots.length === 0 ? "Select your preferred date/time" :
                            selectedSlots.length === 1 ? "Please select an alternate choice" :
                                "Choices confirmed. Ready to submit."}
                    </span>
                </div>

                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setSelectedSlots([])} className="text-gray-400">
                        Reset Selections
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={selectedSlots.length < 2}
                        className="bg-[#6B8E5F] hover:bg-[#5a7850] px-12 py-6 text-lg font-bold shadow-lg shadow-[#6B8E5F]/20"
                    >
                        Submit Inspection Request
                    </Button>
                </div>
            </div>
        </div>
    );
}
