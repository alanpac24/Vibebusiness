import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calculator,
  Percent,
  Users,
  ChartBar
} from 'lucide-react';
import { useBusinessContext } from '@/hooks/useBusinessContext';
import { executePricingStrategyAgent } from '@/lib/agents/pricing-strategy-agent';
import { useToast } from '@/hooks/use-toast';

export function PricingStrategyWorkflow() {
  const { businessContext, updateBusinessContext } = useBusinessContext();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [progress, setProgress] = useState(0);
  
  const hasRequiredInputs = businessContext?.agentOutputs?.['market-research'] && 
                           businessContext?.agentOutputs?.['offer-design'];
  const existingOutput = businessContext?.agentOutputs?.['pricing-strategy'];

  const runPricingStrategy = async () => {
    if (!businessContext) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      setProgress(30);
      
      const result = await executePricingStrategyAgent({
        agent: {
          id: 'pricing-strategy',
          name: 'Pricing Strategy Agent',
          category: 'market',
          description: 'Optimizes pricing model and price points',
          icon: '💰',
          requiredInputs: ['market-research', 'offer-design']
        },
        businessContext
      });
      
      setProgress(75);
      
      if (result.success && result.contextUpdates) {
        await updateBusinessContext(result.contextUpdates);
        setProgress(100);
        
        toast({
          title: "Pricing Strategy Complete",
          description: "Your optimized pricing is ready to review",
        });
        
        setActiveTab('pricing-model');
      } else {
        throw new Error(result.error || 'Pricing strategy failed');
      }
    } catch (error) {
      console.error('Pricing strategy error:', error);
      toast({
        title: "Error",
        description: "Failed to complete pricing strategy. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const pricingData = existingOutput?.data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                Pricing Strategy & Optimization
              </CardTitle>
              <CardDescription>
                Find the perfect pricing model and price points for your SaaS
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
              <p className="text-sm">Complete Market Research and Offer Design first</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Analyzes market data to optimize pricing for maximum revenue
                </p>
                <Button 
                  onClick={runPricingStrategy}
                  disabled={isProcessing}
                  size="sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : existingOutput ? (
                    'Recalculate Pricing'
                  ) : (
                    'Optimize Pricing'
                  )}
                </Button>
              </div>
              
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {progress < 40 ? 'Selecting pricing model...' : 
                     progress < 80 ? 'Optimizing price points...' : 
                     'Analyzing elasticity...'}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {pricingData && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Strategy Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pricing-model">Model</TabsTrigger>
                <TabsTrigger value="price-points">Pricing</TabsTrigger>
                <TabsTrigger value="elasticity">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">{pricingData.summary}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Calculator className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">
                          {pricingData.model?.model?.type || 'Subscription'}
                        </p>
                        <p className="text-sm text-muted-foreground">Pricing Model</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Percent className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">
                          {(pricingData.model?.billing?.annualDiscount * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Annual Discount</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-2xl font-bold">
                          {pricingData.model?.trial?.duration} days
                        </p>
                        <p className="text-sm text-muted-foreground">Free Trial</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pricing-model" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing Model</h3>
                    <div className="p-6 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-lg">{pricingData.model?.model?.type}</h4>
                        <Badge>Recommended</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{pricingData.model?.model?.description}</p>
                      <p className="text-sm">
                        <span className="font-medium">Rationale:</span> {pricingData.model?.model?.rationale}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Billing Options</h4>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Frequencies</p>
                            <div className="flex gap-2">
                              {pricingData.model?.billing?.frequencies?.map((freq: string) => (
                                <Badge key={freq} variant={freq === pricingData.model?.billing?.preferred ? 'default' : 'secondary'}>
                                  {freq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {pricingData.model?.billing?.rationale}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Trial Strategy</h4>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{pricingData.model?.trial?.type}</p>
                            <Badge variant="outline">{pricingData.model?.trial?.duration} days</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pricingData.model?.trial?.limitations}
                          </p>
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs">
                              Expected conversion: {(pricingData.model?.trial?.conversionRate * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Contract Terms</h4>
                    <div className="p-4 border rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Minimum</p>
                          <p className="font-medium">{pricingData.model?.contracts?.minimum || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Enterprise</p>
                          <p className="font-medium">{pricingData.model?.contracts?.enterprise}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Custom Terms</p>
                          <p className="font-medium">{pricingData.model?.contracts?.customTerms ? 'Available' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="price-points" className="mt-6">
                <div className="space-y-6">
                  <div className="grid gap-4">
                    {pricingData.pricing?.tiers?.map((tier: any, index: number) => (
                      <Card key={index} className={tier.highlighted ? 'border-primary shadow-lg' : ''}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{tier.name}</CardTitle>
                            {tier.highlighted && <Badge>Most Popular</Badge>}
                            {tier.customPricing && <Badge variant="outline">Custom Pricing</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Monthly</p>
                              <p className="text-2xl font-bold">${tier.monthlyPrice}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Annual (per month)</p>
                              <p className="text-2xl font-bold">${tier.annualPrice}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Setup Fee</p>
                              <p className="text-2xl font-bold">${tier.setupFee}</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <p className="text-sm">
                              <span className="font-medium">Rationale:</span> {tier.rationale}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Discount Structure</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-2">Volume Discounts</p>
                        <div className="space-y-1 text-sm">
                          {pricingData.pricing?.discounts?.volume?.map((vol: any, i: number) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-muted-foreground">{vol.users} users</span>
                              <span className="font-medium">
                                {typeof vol.discount === 'number' ? `${(vol.discount * 100).toFixed(0)}% off` : vol.discount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium mb-2">Special Discounts</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nonprofit</span>
                            <span className="font-medium">{(pricingData.pricing?.discounts?.nonprofit * 100).toFixed(0)}% off</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Education</span>
                            <span className="font-medium">{(pricingData.pricing?.discounts?.education * 100).toFixed(0)}% off</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Startup</span>
                            <span className="font-medium">{(pricingData.pricing?.discounts?.startup * 100).toFixed(0)}% off</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="elasticity" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Price Elasticity Analysis</h3>
                    <div className="space-y-4">
                      {Object.entries(pricingData.elasticity?.elasticity || {}).map(([tier, data]: [string, any]) => (
                        <div key={tier} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize">{tier}</h4>
                            <Badge variant="outline">Elasticity: {data.coefficient}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{data.interpretation}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Sweet spot: </span>
                              <span className="font-medium">${data.sweetSpot.min} - ${data.sweetSpot.max}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Optimal: </span>
                              <span className="font-medium text-green-600">${data.sweetSpot.optimal}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Revenue Scenarios</h4>
                    <div className="space-y-3">
                      {pricingData.elasticity?.scenarios?.map((scenario: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium">{scenario.name}</h5>
                              <ChartBar className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Pricing</p>
                                <p className="font-medium">
                                  ${scenario.pricing.starter} / ${scenario.pricing.professional} / ${scenario.pricing.enterprise}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Users</p>
                                <p className="font-medium">{scenario.projection.users.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Revenue</p>
                                <p className="font-medium">${scenario.projection.revenue.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Profit</p>
                                <p className="font-medium">${scenario.projection.profit.toLocaleString()}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">A/B Testing Recommendation</h4>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <p className="font-medium mb-2">{pricingData.elasticity?.testing?.recommendation}</p>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{pricingData.elasticity?.testing?.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sample Size</p>
                          <p className="font-medium">{pricingData.elasticity?.testing?.sampleSize}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Key Metrics</p>
                          <p className="font-medium">{pricingData.elasticity?.testing?.metrics?.length} metrics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}