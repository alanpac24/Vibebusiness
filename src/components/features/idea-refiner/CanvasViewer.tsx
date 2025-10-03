import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Maximize2, Grid3X3, Lightbulb, Users, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { LeanCanvas, BusinessModelCanvas, CustomerSegment, ValueProposition, ProblemSolutionFit, RiskAssumption } from '@/types/idea-refiner';

interface CanvasViewerProps {
  leanCanvas: LeanCanvas;
  businessModelCanvas?: BusinessModelCanvas;
  customerSegments?: CustomerSegment[];
  valueProposition?: ValueProposition;
  problemSolutionFit?: ProblemSolutionFit;
  risks?: RiskAssumption[];
}

const LeanCanvasGrid = ({ canvas }: { canvas: LeanCanvas }) => {
  const sections = [
    { 
      title: 'Problem', 
      items: canvas.problem, 
      gridArea: 'problem',
      color: 'bg-red-50 border-red-200' 
    },
    { 
      title: 'Solution', 
      items: canvas.solution, 
      gridArea: 'solution',
      color: 'bg-blue-50 border-blue-200' 
    },
    { 
      title: 'Key Metrics', 
      items: canvas.keyMetrics, 
      gridArea: 'metrics',
      color: 'bg-purple-50 border-purple-200' 
    },
    { 
      title: 'Unique Value Proposition', 
      items: [canvas.uniqueValueProposition], 
      gridArea: 'uvp',
      color: 'bg-green-50 border-green-200',
      isLarge: true 
    },
    { 
      title: 'Unfair Advantage', 
      items: [canvas.unfairAdvantage], 
      gridArea: 'advantage',
      color: 'bg-yellow-50 border-yellow-200' 
    },
    { 
      title: 'Channels', 
      items: canvas.channels, 
      gridArea: 'channels',
      color: 'bg-indigo-50 border-indigo-200' 
    },
    { 
      title: 'Customer Segments', 
      items: canvas.customerSegments, 
      gridArea: 'segments',
      color: 'bg-pink-50 border-pink-200' 
    },
    { 
      title: 'Cost Structure', 
      items: canvas.costStructure, 
      gridArea: 'costs',
      color: 'bg-orange-50 border-orange-200' 
    },
    { 
      title: 'Revenue Streams', 
      items: canvas.revenueStreams, 
      gridArea: 'revenue',
      color: 'bg-teal-50 border-teal-200' 
    }
  ];

  return (
    <div 
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(2, minmax(200px, 1fr))',
        gridTemplateAreas: `
          "problem solution metrics uvp segments"
          "problem solution advantage channels segments"
          "costs costs revenue revenue revenue"
        `
      }}
    >
      {sections.map((section) => (
        <Card
          key={section.title}
          className={`${section.color} border-2`}
          style={{ gridArea: section.gridArea }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {section.isLarge ? (
              <p className="text-sm">{section.items[0]}</p>
            ) : (
              <ul className="space-y-1">
                {section.items.map((item, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-muted-foreground mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const BusinessCanvasGrid = ({ canvas }: { canvas: BusinessModelCanvas }) => {
  const sections = [
    { 
      title: 'Key Partners', 
      items: canvas.keyPartners, 
      gridArea: 'partners',
      color: 'bg-blue-50 border-blue-200' 
    },
    { 
      title: 'Key Activities', 
      items: canvas.keyActivities, 
      gridArea: 'activities',
      color: 'bg-purple-50 border-purple-200' 
    },
    { 
      title: 'Key Resources', 
      items: canvas.keyResources, 
      gridArea: 'resources',
      color: 'bg-indigo-50 border-indigo-200' 
    },
    { 
      title: 'Value Propositions', 
      items: canvas.valuePropositions, 
      gridArea: 'value',
      color: 'bg-green-50 border-green-200' 
    },
    { 
      title: 'Customer Relationships', 
      items: canvas.customerRelationships, 
      gridArea: 'relationships',
      color: 'bg-yellow-50 border-yellow-200' 
    },
    { 
      title: 'Channels', 
      items: canvas.channels, 
      gridArea: 'channels',
      color: 'bg-orange-50 border-orange-200' 
    },
    { 
      title: 'Customer Segments', 
      items: canvas.customerSegments, 
      gridArea: 'segments',
      color: 'bg-pink-50 border-pink-200' 
    },
    { 
      title: 'Cost Structure', 
      items: canvas.costStructure, 
      gridArea: 'costs',
      color: 'bg-red-50 border-red-200' 
    },
    { 
      title: 'Revenue Streams', 
      items: canvas.revenueStreams, 
      gridArea: 'revenue',
      color: 'bg-teal-50 border-teal-200' 
    }
  ];

  return (
    <div 
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(3, minmax(150px, 1fr))',
        gridTemplateAreas: `
          "partners partners activities activities value value relationships relationships segments segments"
          "partners partners resources resources value value channels channels segments segments"
          "costs costs costs costs costs revenue revenue revenue revenue revenue"
        `
      }}
    >
      {sections.map((section) => (
        <Card
          key={section.title}
          className={`${section.color} border-2`}
          style={{ gridArea: section.gridArea }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {section.items.map((item, index) => (
                <li key={index} className="text-xs flex items-start">
                  <span className="text-muted-foreground mr-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const CanvasViewer = ({ 
  leanCanvas, 
  businessModelCanvas,
  customerSegments,
  valueProposition,
  problemSolutionFit,
  risks
}: CanvasViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('context');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Business Analysis & Canvas</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      {/* Context and Analysis Section */}
      <div className="space-y-6">
        {/* Key Insights Summary */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Analysis Overview
            </CardTitle>
            <CardDescription>
              AI-generated insights based on your idea and diagnostic responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Value Proposition Summary */}
            {valueProposition && (
              <Alert className="border-blue-200 bg-blue-50">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">Core Value Proposition:</p>
                  <p>{valueProposition.headline}</p>
                  <p className="text-sm text-muted-foreground">{valueProposition.subheadline}</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Target Customers Summary */}
            {customerSegments && customerSegments.length > 0 && (
              <Alert className="border-green-200 bg-green-50">
                <Users className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">Primary Target Segments:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {customerSegments.slice(0, 3).map((segment) => (
                      <li key={segment.id} className="text-sm">
                        <span className="font-medium">{segment.name}</span>: {segment.description}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Problem-Solution Fit Score */}
            {problemSolutionFit && (
              <Alert className="border-purple-200 bg-purple-50">
                <Target className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">Problem-Solution Fit Score: {problemSolutionFit.fitScore}%</p>
                  <p className="text-sm">
                    Your solution addresses {problemSolutionFit.problems?.length || 0} key problems 
                    with {problemSolutionFit.solution?.keyFeatures?.length || 0} main features.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {/* Key Risks */}
            {risks && risks.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="space-y-2">
                  <p className="font-semibold">Critical Risks to Address:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {risks
                      .filter(risk => risk.impact === 'high')
                      .slice(0, 3)
                      .map((risk) => (
                        <li key={risk.id} className="text-sm">
                          {risk.description}
                        </li>
                      ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Canvas Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Your Business Canvas</CardTitle>
            <CardDescription>
              The canvas below synthesizes all aspects of your business model. Each section is populated 
              based on your idea description and diagnostic answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The <span className="font-medium">Lean Canvas</span> focuses on problem-solution fit and is ideal for startups. 
              The <span className="font-medium">Business Model Canvas</span> provides a comprehensive view of how your business creates, 
              delivers, and captures value.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Canvas Tabs */}
      <Tabs defaultValue="lean" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lean">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Lean Canvas
          </TabsTrigger>
          {businessModelCanvas && (
            <TabsTrigger value="business">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Business Model Canvas
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="lean" className="mt-4">
          <div className={isFullscreen ? 'fixed inset-0 bg-background z-50 p-8 overflow-auto' : 'space-y-4'}>
            {isFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="mb-4"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
            )}
            <LeanCanvasGrid canvas={leanCanvas} />
          </div>
        </TabsContent>

        {businessModelCanvas && (
          <TabsContent value="business" className="mt-4">
            <div className={isFullscreen ? 'fixed inset-0 bg-background z-50 p-8 overflow-auto' : 'space-y-4'}>
              {isFullscreen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(false)}
                  className="mb-4"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Exit Fullscreen
                </Button>
              )}
              <BusinessCanvasGrid canvas={businessModelCanvas} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};