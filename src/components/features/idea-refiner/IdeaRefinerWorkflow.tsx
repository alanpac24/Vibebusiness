import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Target, 
  FileText, 
  ArrowRight,
  Download,
  Loader2
} from 'lucide-react';
import { IdeaInput } from './IdeaInput';
import { DiagnosticQA } from './DiagnosticQA';
import { CanvasViewer } from './CanvasViewer';
import { OutputExporter } from './OutputExporter';
import { useIdeaRefiner } from '@/hooks/useIdeaRefiner';
import { IdeaRefinerInput, IdeaRefinerOutput } from '@/types/idea-refiner';

export const IdeaRefinerWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [input, setInput] = useState<IdeaRefinerInput>({
    ideaDescription: '',
    existingDocs: [],
    customQuestions: []
  });
  const [output, setOutput] = useState<Partial<IdeaRefinerOutput>>({});
  const { processIdea, isProcessing } = useIdeaRefiner();

  const steps = [
    { id: 'input', label: 'Idea Input', icon: Lightbulb },
    { id: 'diagnostic', label: 'Diagnostic Q&A', icon: Target },
    { id: 'canvas', label: 'Business Canvas', icon: FileText }
  ];

  const handleNext = async () => {
    if (activeStep === 0 && input.ideaDescription) {
      // Start the AI processing
      const result = await processIdea(input);
      if (result) {
        setOutput(result);
      }
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Idea Refiner & Business Canvas</h1>
        <p className="text-muted-foreground mt-2">
          Transform your idea into a validated business concept with AI-powered analysis
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{steps[activeStep].label}</span>
          <span className="text-muted-foreground">
            Step {activeStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Button
              key={step.id}
              variant={index === activeStep ? 'default' : index < activeStep ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setActiveStep(index)}
              disabled={
                (index === 1 && !input.ideaDescription) || // Can't go to diagnostic without idea
                (index === 2 && (!output.diagnosticAnswers || output.diagnosticAnswers.length === 0)) // Can't go to canvas without diagnostic answers
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              {step.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {activeStep === 0 && (
            <IdeaInput
              value={input}
              onChange={setInput}
              onNext={handleNext}
              isProcessing={isProcessing}
            />
          )}

          {activeStep === 1 && (
            <DiagnosticQA
              questions={output.diagnosticAnswers || []}
              onUpdate={(questions) => setOutput({ ...output, diagnosticAnswers: questions })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              {output.leanCanvas ? (
                <>
                  <CanvasViewer
                    leanCanvas={output.leanCanvas}
                    businessModelCanvas={output.businessModelCanvas}
                    customerSegments={output.customerSegments}
                    valueProposition={output.valueProposition}
                    risks={output.risksAndAssumptions}
                    problemSolutionFit={output.problemSolutionFit}
                  />
                  <OutputExporter output={output as IdeaRefinerOutput} />
                </>
              ) : (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Generating your business canvas...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};