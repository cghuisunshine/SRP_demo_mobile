import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Ban, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple calendar generation logic
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AvailabilityManager() {
    // Current month view logic (mocked to March 2024 for demo)
    const [currentMonth] = useState(new Date(2024, 2));
    const [unavailableDates, setUnavailableDates] = useState<string[]>(['2024-03-05', '2024-03-06']);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);

    const toggleDate = (day: number) => {
        const dateStr = `2024-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (unavailableDates.includes(dateStr)) {
            setUnavailableDates(prev => prev.filter(d => d !== dateStr));
        } else {
            setUnavailableDates(prev => [...prev, dateStr]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Availability Manager</h1>
                    <p className="text-gray-500 mt-1">Block off dates where you cannot accept new inspections.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Calendar Card */}
                <Card className="md:col-span-2 border-gray-100 shadow-lg shadow-gray-100/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <ChevronLeft size={16} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 mb-4 text-center">
                            {DAYS.map(day => (
                                <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: days }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `2024-03-${day.toString().padStart(2, '0')}`;
                                const isUnavailable = unavailableDates.includes(dateStr);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => toggleDate(day)}
                                        className={cn(
                                            "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 border",
                                            isUnavailable
                                                ? "bg-red-50 border-red-200 text-red-600 shadow-inner"
                                                : "bg-white border-gray-100 hover:border-[#6B8E5F] hover:shadow-md text-gray-700"
                                        )}
                                    >
                                        <span className={cn("text-lg font-bold", isUnavailable && "line-through opacity-50")}>{day}</span>
                                        {isUnavailable && (
                                            <Ban size={16} className="mt-1" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions / Legend */}
                <div className="space-y-6">
                    <Card className="bg-[#6B8E5F]/5 border-[#6B8E5F]/20">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-bold text-[#6B8E5F] flex items-center gap-2">
                                <CheckCircle size={18} />
                                Smart Routing Active
                            </h3>
                            <p className="text-sm text-[#6B8E5F]/80 leading-relaxed">
                                Our system automatically optimizes routes based on your available slots. Keeping this calendar accurate ensures you don't get booked for far-apart locations on the same day.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Legend</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg border border-gray-100 bg-white flex items-center justify-center">
                                    <span className="text-xs font-bold">12</span>
                                </div>
                                <span className="text-sm text-gray-600">Available for Booking</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center">
                                    <Ban size={14} />
                                </div>
                                <span className="text-sm text-gray-600">Marked Unavailable</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
