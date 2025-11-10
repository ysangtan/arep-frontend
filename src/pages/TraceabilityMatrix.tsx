import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CoverageMetrics } from '@/components/traceability/CoverageMetrics';
import { LinkManagementModal } from '@/components/traceability/LinkManagementModal';
import { OrphanReports } from '@/components/traceability/OrphanReports';
import { traceabilityService } from '@/services/traceabilityMockData';
import { TraceabilityMatrix as TraceabilityMatrixType, TraceabilityLink } from '@/types/traceability.types';
import {
  Search,
  Plus,
  Download,
  TestTube2,
  Code2,
  FileText,
  Palette,
  Check,
  Minus,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function TraceabilityMatrix() {
  const [matrix, setMatrix] = useState<TraceabilityMatrixType[]>([]);
  const [coverage, setCoverage] = useState<any>(null);
  const [orphanRequirements, setOrphanRequirements] = useState<any[]>([]);
  const [orphanArtifacts, setOrphanArtifacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<TraceabilityLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [matrixData, coverageData, orphanReqs, orphanArts] = await Promise.all([
        traceabilityService.getTraceabilityMatrix(),
        traceabilityService.getCoverageMetrics(),
        traceabilityService.getOrphanRequirements(),
        traceabilityService.getOrphanArtifacts(),
      ]);
      setMatrix(matrixData);
      setCoverage(coverageData);
      setOrphanRequirements(orphanReqs);
      setOrphanArtifacts(orphanArts);
    } catch (error) {
      toast.error('Failed to load traceability data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMatrix = matrix.filter(
    (row) =>
      row.requirementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.requirementTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCellClick = (requirementId: string, links: TraceabilityLink[]) => {
    if (links.length === 0) {
      setSelectedRequirement(requirementId);
      setSelectedLink(null);
      setIsModalOpen(true);
    } else if (links.length === 1) {
      setSelectedRequirement(requirementId);
      setSelectedLink(links[0]);
      setIsModalOpen(true);
    } else {
      // Multiple links - show first one for now
      setSelectedRequirement(requirementId);
      setSelectedLink(links[0]);
      setIsModalOpen(true);
    }
  };

  const renderCell = (links: TraceabilityLink[], Icon: any) => {
    if (links.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <Minus className="w-4 h-4 text-muted-foreground" />
        </div>
      );
    }

    const hasActive = links.some((l) => l.status === 'active');
    const hasBroken = links.some((l) => l.status === 'broken');

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-1 cursor-pointer">
              {hasBroken && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {hasActive && <Check className="w-4 h-4 text-green-600" />}
              <span className="text-xs font-medium">{links.length}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {links.slice(0, 3).map((link) => (
                <div key={link.id} className="text-xs">
                  • {link.artifactName}
                  {link.status === 'broken' && ' (broken)'}
                </div>
              ))}
              {links.length > 3 && (
                <div className="text-xs text-muted-foreground">+{links.length - 3} more</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting traceability matrix as ${format.toUpperCase()}...`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading traceability data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Traceability Matrix</h1>
          <p className="text-muted-foreground mt-1">
            Track relationships between requirements and artifacts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="matrix" className="space-y-6">
        <TabsList>
          <TabsTrigger value="matrix">Matrix View</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search requirements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements vs Artifacts</CardTitle>
                  <CardDescription>
                    Click any cell to view or add links. <Check className="w-3 h-3 inline text-green-600" /> = Active
                    link, <AlertTriangle className="w-3 h-3 inline text-amber-600" /> = Broken link, <Minus className="w-3 h-3 inline" /> = No link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Requirement</TableHead>
                          <TableHead className="min-w-[250px]">Title</TableHead>
                          <TableHead className="w-[100px] text-center">
                            <div className="flex items-center justify-center gap-1">
                              <TestTube2 className="w-4 h-4" />
                              Tests
                            </div>
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Code2 className="w-4 h-4" />
                              Code
                            </div>
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            <div className="flex items-center justify-center gap-1">
                              <FileText className="w-4 h-4" />
                              Docs
                            </div>
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Palette className="w-4 h-4" />
                              Design
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMatrix.map((row) => (
                          <TableRow key={row.requirementId}>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {row.requirementId}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{row.requirementTitle}</TableCell>
                            <TableCell
                              className="text-center cursor-pointer hover:bg-accent/50"
                              onClick={() => handleCellClick(row.requirementId, row.tests)}
                            >
                              {renderCell(row.tests, TestTube2)}
                            </TableCell>
                            <TableCell
                              className="text-center cursor-pointer hover:bg-accent/50"
                              onClick={() => handleCellClick(row.requirementId, row.code)}
                            >
                              {renderCell(row.code, Code2)}
                            </TableCell>
                            <TableCell
                              className="text-center cursor-pointer hover:bg-accent/50"
                              onClick={() => handleCellClick(row.requirementId, row.docs)}
                            >
                              {renderCell(row.docs, FileText)}
                            </TableCell>
                            <TableCell
                              className="text-center cursor-pointer hover:bg-accent/50"
                              onClick={() => handleCellClick(row.requirementId, row.design)}
                            >
                              {renderCell(row.design, Palette)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              {coverage && <CoverageMetrics metrics={coverage} />}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <OrphanReports
            orphanRequirements={orphanRequirements}
            orphanArtifacts={orphanArtifacts}
          />
        </TabsContent>
      </Tabs>

      {selectedRequirement && (
        <LinkManagementModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          requirementId={selectedRequirement}
          link={selectedLink || undefined}
          onSuccess={() => {
            loadData();
            setSelectedRequirement(null);
            setSelectedLink(null);
          }}
        />
      )}
    </div>
  );
}
