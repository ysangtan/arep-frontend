import { CoverageMetrics as CoverageMetricsType } from '@/types/traceability.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TestTube2, Code2, FileText, Palette, TrendingUp } from 'lucide-react';

interface CoverageMetricsProps {
  metrics: CoverageMetricsType;
}

export function CoverageMetrics({ metrics }: CoverageMetricsProps) {
  const metricItems = [
    {
      label: 'Test Coverage',
      value: metrics.testCoverage,
      icon: TestTube2,
      color: 'text-blue-600',
    },
    {
      label: 'Code Coverage',
      value: metrics.codeCoverage,
      icon: Code2,
      color: 'text-green-600',
    },
    {
      label: 'Documentation Coverage',
      value: metrics.docCoverage,
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      label: 'Design Coverage',
      value: metrics.designCoverage,
      icon: Palette,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Overall Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">{metrics.overallCoverage}%</span>
              <span className="text-sm text-muted-foreground">of requirements</span>
            </div>
            <Progress value={metrics.overallCoverage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {metricItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
