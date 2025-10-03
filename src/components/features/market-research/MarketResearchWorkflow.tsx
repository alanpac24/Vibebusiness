import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { executeMarketResearchAgent } from '@/lib/agents/market-research-agent';
import { useToast } from '@/hooks/use-toast';

export function MarketResearchWorkflow() {
  const { businessContext, updateBusinessContext } = useBusinessContext();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);
  
  const hasRequiredInputs = true; // businessContext?.companyProfile?.businessIdea;
  const existingOutput = businessContext?.agentOutputs?.['market-research'];

  const runMarketResearch = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Simulate progress for each sub-agent
      setProgress(20);
      
      // Create a mock business context for demo if none exists
      const mockContext = businessContext || {
        projectId: 'demo',
        companyProfile: {
          projectId: 'demo',
          businessIdea: 'AI-powered SaaS platform for small businesses',
          problemStatement: 'Small businesses struggle with digital transformation',
          targetAudience: 'Small to medium businesses',
          valueProposition: 'Simple, affordable AI tools for business automation'
        },
        agentOutputs: {}
      };
      
      const result = await executeMarketResearchAgent({
        agent: {
          id: 'market-research',
          name: 'Market Research Agent',
          category: 'market',
          description: 'Analyzes market size, competitors, and trends',
          icon: '📊',
          requiredInputs: ['idea-refiner']
        },
        businessContext: mockContext
      });
      
      setProgress(60);
      
      if (result.success && result.contextUpdates) {
        if (businessContext) {
          await updateBusinessContext(result.contextUpdates);
        }
        setProgress(100);
        
        toast({
          title: "Market Research Complete",
          description: "Your market analysis is ready to review",
        });
        
        setActiveTab('market-size');
      } else {
        throw new Error(result.error || 'Market research failed');
      }
    } catch (error) {
      console.error('Market research error:', error);
      toast({
        title: "Error",
        description: "Failed to complete market research. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const marketData = existingOutput?.data || businessContext?.marketIntelligence;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Market Research & Analysis
              </CardTitle>
              <CardDescription>
                Understand your market size, competition, and opportunities
              </CardDescription>
            </div>
            {existingOutput && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!hasRequiredInputs ? (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Complete the Idea Refiner first to enable market research</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Analyzes TAM/SAM/SOM, identifies competitors, and spots industry trends
                </p>
                <Button 
                  onClick={runMarketResearch}
                  disabled={isProcessing}
                  size="sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : existingOutput ? (
                    'Refresh Research'
                  ) : (
                    'Start Research'
                  )}
                </Button>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {progress < 40 ? 'Analyzing market size...' : 
                     progress < 80 ? 'Scanning competitors...' : 
                     'Identifying trends...'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {marketData && (
        <Card>
          <CardHeader>
            <CardTitle>Research Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="market-size">Market Size</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">{marketData.summary}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <DollarSign className="h-8 w-8 text-muted-foreground" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            ${(marketData.marketSize?.tam / 1000000000).toFixed(1)}B
                          </p>
                          <p className="text-sm text-muted-foreground">TAM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <Target className="h-8 w-8 text-muted-foreground" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {marketData.competitors?.length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Competitors</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {(marketData.marketSize?.growthRate * 100).toFixed(0)}%
                          </p>
                          <p className="text-sm text-muted-foreground">Growth Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="market-size" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Market Size Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Total Addressable Market (TAM)</p>
                          <p className="text-sm text-muted-foreground">
                            {marketData.marketSize?.reasoning?.tam}
                          </p>
                        </div>
                        <p className="text-2xl font-bold">
                          ${(marketData.marketSize?.tam / 1000000000).toFixed(2)}B
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Serviceable Addressable Market (SAM)</p>
                          <p className="text-sm text-muted-foreground">
                            {marketData.marketSize?.reasoning?.sam}
                          </p>
                        </div>
                        <p className="text-2xl font-bold">
                          ${(marketData.marketSize?.sam / 1000000).toFixed(0)}M
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Serviceable Obtainable Market (SOM)</p>
                          <p className="text-sm text-muted-foreground">
                            {marketData.marketSize?.reasoning?.som}
                          </p>
                        </div>
                        <p className="text-2xl font-bold">
                          ${(marketData.marketSize?.som / 1000000).toFixed(0)}M
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Market Drivers</h4>
                    <ul className="space-y-2">
                      {marketData.marketSize?.drivers?.map((driver: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitors" className="mt-6">
                <div className="space-y-4">
                  {marketData.competitors?.map((competitor: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{competitor.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={competitor.type === 'direct' ? 'destructive' : 'secondary'}>
                              {competitor.type}
                            </Badge>
                            <Badge variant="outline">
                              {(competitor.marketShare * 100).toFixed(0)}% share
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{competitor.positioning}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-2 text-green-600">Strengths</p>
                            <ul className="text-sm space-y-1">
                              {competitor.strengths.map((strength: string, i: number) => (
                                <li key={i}>• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2 text-red-600">Weaknesses</p>
                            <ul className="text-sm space-y-1">
                              {competitor.weaknesses.map((weakness: string, i: number) => (
                                <li key={i}>• {weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm">
                            <span className="font-medium">Pricing:</span> {competitor.pricing}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <div className="space-y-4">
                  {marketData.trends?.map((trend: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{trend.trend}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={trend.impact === 'high' ? 'default' : 'secondary'}>
                              {trend.impact} impact
                            </Badge>
                            <Badge variant="outline">{trend.timeframe}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Opportunity:</span> {trend.opportunity}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}