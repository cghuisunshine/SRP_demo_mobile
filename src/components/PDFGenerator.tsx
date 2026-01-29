import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Download } from 'lucide-react';

export function PDFGenerator() {
    const [status, setStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

    const generate = () => {
        setStatus('generating');
        // Simulate backend processing time
        setTimeout(() => {
            setStatus('ready');
        }, 2500);
    };

    return (
        <div className="flex items-center justify-end">
            {status === 'idle' && (
                <Button onClick={generate} variant="outline" className="text-[#6B8E5F] border-[#6B8E5F]/30 hover:bg-[#6B8E5F]/5">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Draft Report
                </Button>
            )}

            {status === 'generating' && (
                <Button disabled variant="outline" className="text-gray-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Compiling Data...
                </Button>
            )}

            {status === 'ready' && (
                <Button variant="default" className="bg-[#6B8E5F] text-white hover:bg-[#5a7850] animate-in fade-in zoom-in duration-300">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            )}
        </div>
    );
}
