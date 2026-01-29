import { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Progress } from './ui/progress';
import { ChevronLeft, Save, CheckCircle2 } from 'lucide-react';
import type { SurveyQuestion } from '@/lib/types';

interface SurveyEngineProps {
    sectionId: string;
    initialQuestions?: any[];
}

export function SurveyEngine({ sectionId, initialQuestions = [] }: SurveyEngineProps) {
    const { fetchHubStatus } = useStore();

    // Map Astro Content Collection format to our UI format
    const mappedQuestions = useMemo(() => {
        return initialQuestions.map(q => ({
            id: q.id,
            sectionId: sectionId,
            questionText: q.text,
            questionType: q.type,
            options: q.options,
            isMandatory: q.isMandatory,
            helpText: q.helpText,
            dependsOnQuestionId: q.dependsOn?.questionId,
            dependsOnValue: q.dependsOn?.value
        } as SurveyQuestion));
    }, [initialQuestions, sectionId]);

    const [questions, setQuestions] = useState<SurveyQuestion[]>(mappedQuestions);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false); // No longer loading if we have props
    const [saving, setSaving] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Skip fetch if we already have questions from props (Static Mode)
        if (initialQuestions.length > 0) {
            setLoading(false);
            return;
        }

        async function loadQuestions() {
            setLoading(true);
            try {
                const response = await fetch(`/api/surveys/sections/${sectionId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setQuestions(data);
                    }
                }
            } catch (error) {
                console.error('Error loading questions:', error);
            } finally {
                setLoading(false);
            }
        }
        loadQuestions();
    }, [sectionId, initialQuestions.length]);

    const visibleQuestions = useMemo(() => {
        return questions.filter(q => {
            if (!q.dependsOnQuestionId) return true;
            const parentValue = answers[q.dependsOnQuestionId];
            return parentValue === q.dependsOnValue;
        });
    }, [questions, answers]);

    const progress = useMemo(() => {
        if (visibleQuestions.length === 0) return 0;
        const answeredCount = visibleQuestions.filter(q => !!answers[q.id]).length;
        return Math.round((answeredCount / visibleQuestions.length) * 100);
    }, [visibleQuestions, answers]);

    const handleAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/surveys/save-answers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionId,
                    answers,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                setIsComplete(true);
                fetchHubStatus();
            }
        } catch (error) {
            console.error('Failed to save answers:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading survey questions...</div>;
    }

    if (isComplete) {
        return (
            <Card className="max-w-2xl mx-auto border-[#6B8E5F]/20 shadow-xl overflow-hidden animate-in zoom-in duration-500">
                <div className="bg-[#6B8E5F] p-12 text-center text-white">
                    <CheckCircle2 size={64} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">Section Complete!</h2>
                    <p className="mt-2 text-green-100">Your answers have been saved and progress updated.</p>
                </div>
                <CardFooter className="p-8 text-center justify-center">
                    <Button onClick={() => window.location.href = '/client/dashboard'} className="bg-[#6B8E5F] hover:bg-[#5a7850]">
                        Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="space-y-2">
                <div className="flex justify-between items-end mb-2">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Section Progress</h2>
                    <span className="text-lg font-bold text-[#6B8E5F]">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-[#6B8E5F]/10" />
            </div>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Survey
                    </CardTitle>
                    <CardDescription>Please provide accurate details for our engineering review.</CardDescription>
                </CardHeader>

                <CardContent className="p-8 space-y-12">
                    {visibleQuestions.map((q, index) => (
                        <div key={q.id} className="space-y-4 animate-in slide-in-from-left duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="space-y-1">
                                <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    {q.questionText}
                                    {q.isMandatory && <span className="text-red-500 text-xs">*</span>}
                                </Label>
                                {q.helpText && <p className="text-sm text-gray-500">{q.helpText}</p>}
                            </div>

                            {q.questionType === 'boolean' && (
                                <RadioGroup
                                    value={answers[q.id] || ""}
                                    onValueChange={(val: string) => handleAnswer(q.id, val)}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id={`${q.id}-yes`} className="border-[#6B8E5F] text-[#6B8E5F]" />
                                        <Label htmlFor={`${q.id}-yes`}>Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id={`${q.id}-no`} className="border-[#6B8E5F] text-[#6B8E5F]" />
                                        <Label htmlFor={`${q.id}-no`}>No</Label>
                                    </div>
                                </RadioGroup>
                            )}

                            {q.questionType === 'text' && (
                                <Input
                                    placeholder="Enter details..."
                                    className="max-w-md focus-visible:ring-[#6B8E5F]"
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                                />
                            )}

                            {q.questionType === 'select' && (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {q.options?.map(opt => (
                                        <Button
                                            key={opt}
                                            variant={answers[q.id] === opt ? "default" : "outline"}
                                            className={answers[q.id] === opt ? "bg-[#6B8E5F] hover:bg-[#5a7850]" : "hover:border-[#6B8E5F] hover:text-[#6B8E5F]"}
                                            onClick={() => handleAnswer(q.id, opt)}
                                        >
                                            {opt}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>

                <CardFooter className="bg-gray-50/50 p-6 flex justify-between border-t border-gray-100">
                    <Button variant="ghost" onClick={() => window.history.back()} className="text-gray-500">
                        <ChevronLeft size={18} className="mr-2" />
                        Cancel
                    </Button>
                    <Button
                        disabled={saving || progress < 100}
                        onClick={handleSave}
                        className="bg-[#6B8E5F] hover:bg-[#5a7850] min-w-[140px]"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save size={18} className="mr-2" />
                                Save & Continue
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
