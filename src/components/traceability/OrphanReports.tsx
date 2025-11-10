import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrphanRequirement, OrphanArtifact } from '@/types/traceability.types';
import { AlertTriangle, ExternalLink, FileQuestion, TestTube2, Code2, FileText, Palette } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrphanReportsProps {
  orphanRequirements: OrphanRequirement[];
  orphanArtifacts: OrphanArtifact[];
}

export function OrphanReports({ orphanRequirements, orphanArtifacts }: OrphanReportsProps) {
  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'test':
        return <TestTube2 className="w-3 h-3" />;
      case 'code':
        return <Code2 className="w-3 h-3" />;
      case 'doc':
        return <FileText className="w-3 h-3" />;
      case 'design':
        return <Palette className="w-3 h-3" />;
      default:
        return <FileQuestion className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Orphan Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Orphan Requirements
          </CardTitle>
          <CardDescription>
            Requirements with missing artifact links ({orphanRequirements.length} found)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orphanRequirements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No orphan requirements found. All requirements have links!</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {orphanRequirements.map((req) => (
                  <div
                    key={req.requirementId}
                    className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {req.requirementId}
                        </Badge>
                        <h4 className="font-medium text-sm text-foreground">{req.title}</h4>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {req.missingArtifacts.map((artifact) => (
                          <Badge
                            key={artifact}
                            variant="secondary"
                            className="text-xs gap-1 bg-amber-100 text-amber-700"
                          >
                            {getArtifactIcon(artifact)}
                            Missing {artifact}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Orphan Artifacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Orphan Artifacts
          </CardTitle>
          <CardDescription>
            Artifacts with no linked requirements ({orphanArtifacts.length} found)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orphanArtifacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No orphan artifacts found. All artifacts are linked!</p>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
                {orphanArtifacts.map((artifact) => (
                  <div
                    key={artifact.artifactId}
                    className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs gap-1">
                          {getArtifactIcon(artifact.artifactType)}
                          {artifact.artifactId}
                        </Badge>
                        <h4 className="font-medium text-sm text-foreground">{artifact.artifactName}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        No requirements linked to this {artifact.artifactType}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-2">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
