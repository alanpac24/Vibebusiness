import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Target,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { executeOfferDesignAgent } from '@/lib/agents/offer-design-agent';
import { useToast } from '@/hooks/use-toast';

export function OfferDesignWorkflow() {
  const { businessContext, updateBusinessContext } = useBusinessContext();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);
  
  const hasRequiredInputs = businessContext?.agentOutputs?.['market-research'];
  const existingOutput = businessContext?.agentOutputs?.['offer-design'];

  const runOfferDesign = async () => {
    if (!businessContext) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      setProgress(25);
      
      const result = await executeOfferDesignAgent({
        agent: {
          id: 'offer-design',
          name: 'Offer Design Agent',
          category: 'product',
          description: 'Designs product offerings and value propositions',
          icon: '📦',
          requiredInputs: ['market-research']
        },
        businessContext
      });
      
      setProgress(70);
      
      if (result.success && result.contextUpdates) {
        await updateBusinessContext(result.contextUpdates);
        setProgress(100);
        
        toast({
          title: "Offer Design Complete",
          description: "Your product offerings are ready to review",
        });
        
        setActiveTab('value-props');
      } else {
        throw new Error(result.error || 'Offer design failed');
      }
    } catch (error) {
      console.error('Offer design error:', error);
      toast({
        title: "Error",
        description: "Failed to complete offer design. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const offerData = existingOutput?.data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6" />
                Offer Design & Packaging
              </CardTitle>
              <CardDescription>
                Design your value propositions, features, and pricing tiers
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
              <p className="text-sm">Complete Market Research first to enable offer design</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Creates compelling value propositions and feature packages
                </p>
                <Button 
                  onClick={runOfferDesign}
                  disabled={isProcessing}
                  size="sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Designing...
                    </>
                  ) : existingOutput ? (
                    'Redesign Offers'
                  ) : (
                    'Design Offers'
                  )}
                </Button>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {progress < 40 ? 'Creating value propositions...' : 
                     progress < 80 ? 'Prioritizing features...' : 
                     'Building packages...'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {offerData && (
        <Card>
          <CardHeader>
            <CardTitle>Offer Design Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="value-props">Value Props</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">{offerData.summary}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">
                          {offerData.valuePropositions?.segmentSpecific?.length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Target Segments</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">
                          {offerData.features?.filter((f: any) => f.category === 'must-have').length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Core Features</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">
                          {offerData.packages?.length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Pricing Tiers</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="value-props" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Primary Value Proposition</h3>
                    <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                      <p className="text-lg font-medium">{offerData.valuePropositions?.primary}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Supporting Value Props</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {offerData.valuePropositions?.supporting?.map((prop: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="text-sm">{prop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Segment-Specific Value Props</h4>
                    <div className="space-y-3">
                      {offerData.valuePropositions?.segmentSpecific?.map((segment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{segment.segment}</p>
                            <p className="text-sm text-muted-foreground mt-1">{segment.proposition}</p>
                          </div>
                          <Target className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Key Differentiators</h4>
                    <div className="space-y-2">
                      {offerData.valuePropositions?.differentiators?.map((diff: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{diff}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <div className="space-y-4">
                  {offerData.features?.map((feature: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                          <Badge 
                            variant={feature.category === 'must-have' ? 'default' : 
                                    feature.category === 'should-have' ? 'secondary' : 'outline'}
                          >
                            {feature.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-muted-foreground">Customer Value</p>
                            <p className="font-bold text-lg">{feature.customerValue}/10</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Competitive Edge</p>
                            <p className="font-bold text-lg">{feature.competitiveAdvantage}/10</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Effort</p>
                            <p className="font-bold text-lg">{feature.effort}/10</p>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground">Revenue Impact</p>
                            <p className="font-bold text-lg">{feature.revenueImpact}/10</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Justification:</span> {feature.justification}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="packages" className="mt-6">
                <div className="grid gap-4">
                  {offerData.packages?.map((pkg: any, index: number) => (
                    <Card key={index} className={pkg.highlighted ? 'border-primary shadow-lg' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              {pkg.name}
                              {pkg.highlighted && <Star className="h-5 w-5 fill-primary text-primary" />}
                            </CardTitle>
                            <CardDescription>{pkg.targetSegment}</CardDescription>
                          </div>
                          {pkg.customPricing && (
                            <Badge>Custom Pricing</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          {pkg.positioning}
                        </p>
                        
                        <div>
                          <h5 className="font-medium mb-2">Features</h5>
                          <ul className="text-sm space-y-1">
                            {pkg.features.map((feature: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                          <div>
                            <p className="text-sm font-medium mb-1">Limits</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>Users: {pkg.limits.users}</li>
                              <li>Projects: {pkg.limits.projects}</li>
                              <li>API Calls: {pkg.limits.apiCalls}</li>
                              <li>Storage: {pkg.limits.storage}</li>
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Support</p>
                            <p className="text-sm text-muted-foreground">{pkg.support}</p>
                          </div>
                        </div>
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