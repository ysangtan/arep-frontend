import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ValidationRule, ValidationTestResult } from '@/types/validation.types';
import { validationService } from '@/services/validationMockData';
import { Search, Plus, Play, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function ValidationConfiguration() {
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<ValidationTestResult | null>(null);
  const [testData, setTestData] = useState('');

  const loadRules = async () => {
    setIsLoading(true);
    try {
      const data = await validationService.getAllRules();
      setRules(data);
    } catch (error) {
      toast.error('Failed to load validation rules');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleRule = async (ruleId: string) => {
    try {
      await validationService.toggleRule(ruleId);
      loadRules();
      toast.success('Rule status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle rule');
    }
  };

  const handleTestRule = async (ruleId: string) => {
    setTestingRuleId(ruleId);
    setTestResult(null);

    try {
      const result = await validationService.testRule(ruleId, testData);
      setTestResult(result);
      if (result.passed) {
        toast.success('Validation test passed');
      } else {
        toast.error('Validation test failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to test rule');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-amber-100 text-amber-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <Badge className={getSeverityColor(rule.severity)}>
                      {rule.severity}
                    </Badge>
                    <Badge variant="outline">{rule.ruleType}</Badge>
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Applies to:</span>
                    <span className="ml-2 font-medium">{rule.appliesTo}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Field:</span>
                    <span className="ml-2 font-medium">{rule.field}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Executions:</span>
                    <span className="ml-2 font-medium">{rule.executionCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Violations:</span>
                    <span className="ml-2 font-medium">{rule.violationCount || 0}</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Error Message: </span>
                    {rule.errorMessage}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (testingRuleId === rule.id) {
                        setTestingRuleId(null);
                        setTestResult(null);
                      } else {
                        setTestingRuleId(rule.id);
                        setTestResult(null);
                        setTestData('');
                      }
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {testingRuleId === rule.id ? 'Close Test' : 'Test Rule'}
                  </Button>
                </div>

                {testingRuleId === rule.id && (
                  <div className="space-y-3 pt-3 border-t">
                    <div className="space-y-2">
                      <Label>Test Data (JSON or plain text)</Label>
                      <Textarea
                        placeholder='{"title": "Test", "priority": "high"}'
                        value={testData}
                        onChange={(e) => setTestData(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={() => handleTestRule(rule.id)} size="sm">
                      Run Test
                    </Button>

                    {testResult && (
                      <div
                        className={`p-4 rounded-lg ${
                          testResult.passed ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {testResult.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                testResult.passed ? 'text-green-900' : 'text-red-900'
                              }`}
                            >
                              {testResult.message}
                            </p>
                            {testResult.violations && testResult.violations.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {testResult.violations.map((violation, idx) => (
                                  <li key={idx} className="text-sm text-red-800">
                                    • {violation}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
