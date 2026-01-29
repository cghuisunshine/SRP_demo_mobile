import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, ArrowLeft, Save, FileCheck } from 'lucide-react';

interface Finding {
    element: {
        name: string;
        category: string;
        age_years: number;
    };
    finding: {
        condition_score: number;
        observation: string;
        recommendation: string;
        estimated_cost: number;
    };
}

export function InspectionExecution({ jobId }: { jobId: string }) {
    const [findings, setFindings] = useState<Finding[]>([]);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const runSimulation = async () => {
        setLoading(true);
        try {
            // Call our new Rust ECS endpoint
            const res = await fetch('/api/ecs/inspection/simulate', { method: 'POST' });
            const data = await res.json();
            setFindings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setSaved(true);
        // In a real app, this would POST the findings back to the DB
        setTimeout(() => {
            window.location.href = '/inspector/dashboard';
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <a href="/inspector/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="text-gray-500" />
                </a>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inspection Execution</h1>
                    <p className="text-gray-500">Job #{jobId} • Vancouver Heights (VIS 2345)</p>
                </div>
            </div>

            {findings.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-200">
                    <CardContent className="py-20 flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-full mb-2">
                            <Wand2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">AI Simulation Ready</h3>
                        <p className="text-gray-500 max-w-md">
                            Use the ECS Engine to simulate field observations based on the building's age and component lifecycle models.
                        </p>
                        <Button
                            size="lg"
                            onClick={runSimulation}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white mt-4"
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            Run ECS Simulation
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-4">
                        {findings.map((item, idx) => (
                            <Card key={idx} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
                                <div className={`h-2 w-full ${getScoreColor(item.finding.condition_score)}`} />
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline">{item.element.category}</Badge>
                                                <span className="text-xs text-gray-400">Age: {item.element.age_years} yrs</span>
                                            </div>
                                            <h3 className="text-lg font-bold">{item.element.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-gray-900">{item.finding.condition_score}</span>
                                            <span className="text-xs text-gray-400 block uppercase tracking-wider">Score</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Observation</p>
                                            <p className="text-sm font-medium text-gray-700">{item.finding.observation}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Recommendation</p>
                                            <p className="text-sm font-medium text-gray-700">{item.finding.recommendation}</p>
                                        </div>
                                    </div>

                                    {item.finding.estimated_cost > 0 && (
                                        <div className="mt-4 flex justify-end">
                                            <Badge className="bg-gray-900 text-white hover:bg-gray-800">
                                                Est. Cost: ${item.finding.estimated_cost.toLocaleString()}
                                            </Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            size="lg"
                            onClick={handleSave}
                            disabled={saved}
                            className={`min-w-[200px] ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#6B8E5F] hover:bg-[#5a7850]'}`}
                        >
                            {saved ? (
                                <>
                                    <FileCheck className="mr-2 h-4 w-4" />
                                    Saved to Database
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Findings
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function getScoreColor(score: number): string {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
}
