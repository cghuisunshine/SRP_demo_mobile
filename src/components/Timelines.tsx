import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function Timelines() {
    const { calculateTimeline } = useStore();
    const [formData, setFormData] = useState({
        file_opened: new Date().toISOString().split('T')[0],
        fiscal_year_start_month: 1,
        last_agm_date: '2024-03-15',
        last_depr_report: '',
        target_date: '',
        report_scope: 'This Fiscal',
    });

    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        const data = await calculateTimeline(formData);
        setResults(data);
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline Calculator</h1>
                <p className="text-gray-600">Please confirm the following dates so we can meet your timelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="border-[#6B8E5F]/20 shadow-sm">
                    <CardHeader className="bg-[#6B8E5F]/5">
                        <CardTitle className="text-lg text-[#6B8E5F]">Project Dates</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label>File Opened</Label>
                            <Input
                                type="date"
                                value={formData.file_opened}
                                onChange={(e) => setFormData({ ...formData, file_opened: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fiscal Year Start Month</Label>
                            <Select
                                value={formData.fiscal_year_start_month.toString()}
                                onValueChange={(v) => setFormData({ ...formData, fiscal_year_start_month: parseInt(v) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>{month}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Date of Last AGM</Label>
                            <Input
                                type="date"
                                value={formData.last_agm_date}
                                onChange={(e) => setFormData({ ...formData, last_agm_date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Report Scope</Label>
                            <Select
                                value={formData.report_scope}
                                onValueChange={(v) => setFormData({ ...formData, report_scope: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="This Fiscal">This Fiscal Year</SelectItem>
                                    <SelectItem value="Next Fiscal">Next Fiscal Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleCalculate}
                            className="w-full bg-[#6B8E5F] hover:bg-[#5a7850] text-white"
                            disabled={loading}
                        >
                            {loading ? "Calculating..." : "Calculate Timelines"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Display */}
                <div className="space-y-6">
                    {results ? (
                        <>
                            <Card className="border-green-200 bg-green-50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-800">Calculated Deadlines</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-100">
                                        <span className="text-gray-600 font-medium">Next Projected AGM</span>
                                        <span className="text-green-700 font-bold">{results.next_projected_agm}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#6B8E5F]/10 p-4 rounded-lg border border-[#6B8E5F]/30 highlight">
                                        <span className="text-[#6B8E5F] font-bold">Draft Deadline</span>
                                        <span className="text-[#6B8E5F] text-xl font-black">{results.draft_deadline}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Project Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Days into Fiscal Year:</span>
                                        <span className="font-semibold text-gray-700">{results.days_into_fiscal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Days remaining:</span>
                                        <span className="font-semibold text-gray-700">{results.days_remaining_in_fiscal}</span>
                                    </div>
                                    {results.days_since_agm !== null && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Days since last AGM:</span>
                                            <span className="font-semibold text-gray-700">{results.days_since_agm}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Days since file opened:</span>
                                        <span className="font-semibold text-gray-700">{results.days_since_file_opened}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button className="w-full bg-[#6B8E5F] text-white hover:bg-[#5a7850] py-6 text-lg font-bold">
                                Confirm Timelines
                            </Button>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
                            <Calendar className="w-12 h-12 mb-4 opacity-20" />
                            <p>Pick your dates and click calculate to see your project deadlines.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
