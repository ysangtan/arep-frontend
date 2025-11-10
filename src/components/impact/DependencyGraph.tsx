import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ImpactAnalysis, ImpactLevel } from '@/types/changeRequest.types';

interface DependencyGraphProps {
  impactAnalysis: ImpactAnalysis;
  changeRequestTitle: string;
}

export function DependencyGraph({ impactAnalysis, changeRequestTitle }: DependencyGraphProps) {
  const getNodeColor = (impactLevel: 'direct' | 'indirect' | ImpactLevel) => {
    switch (impactLevel) {
      case 'direct':
      case 'critical':
        return '#ef4444'; // red
      case 'high':
        return '#f97316'; // orange
      case 'medium':
      case 'indirect':
        return '#eab308'; // yellow
      case 'low':
        return '#22c55e'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      {
        id: 'cr',
        type: 'input',
        data: { label: changeRequestTitle },
        position: { x: 400, y: 50 },
        style: {
          background: '#3b82f6',
          color: 'white',
          border: '2px solid #2563eb',
          padding: 10,
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 'bold',
          width: 250,
        },
      },
    ];

    // Add affected requirements
    impactAnalysis.affectedRequirements.forEach((req, index) => {
      nodes.push({
        id: req.requirementId,
        data: {
          label: (
            <div className="text-center">
              <div className="font-mono text-xs mb-1">{req.requirementId}</div>
              <div className="text-xs">{req.title}</div>
              <div className="text-xs text-gray-600 mt-1">{req.impactType}</div>
            </div>
          ),
        },
        position: { x: 150 + index * 250, y: 200 },
        style: {
          background: getNodeColor(req.impactType),
          color: 'white',
          border: '2px solid rgba(0,0,0,0.2)',
          padding: 8,
          borderRadius: 6,
          fontSize: 12,
          width: 200,
        },
      });
    });

    // Add impacted artifacts (grouped by type)
    const artifactsByType: Record<string, typeof impactAnalysis.impactedArtifacts> = {
      test: [],
      code: [],
      doc: [],
      design: [],
    };

    impactAnalysis.impactedArtifacts.forEach((artifact) => {
      artifactsByType[artifact.artifactType].push(artifact);
    });

    let artifactYPosition = 400;
    Object.entries(artifactsByType).forEach(([type, artifacts]) => {
      if (artifacts.length > 0) {
        artifacts.forEach((artifact, index) => {
          nodes.push({
            id: artifact.artifactId,
            type: 'output',
            data: {
              label: (
                <div className="text-center">
                  <div className="text-xs font-semibold mb-1">{type.toUpperCase()}</div>
                  <div className="text-xs">{artifact.artifactName}</div>
                  <div className="text-xs mt-1">{artifact.estimatedEffort}h</div>
                </div>
              ),
            },
            position: { x: 100 + index * 200, y: artifactYPosition },
            style: {
              background: '#8b5cf6',
              color: 'white',
              border: '2px solid #7c3aed',
              padding: 8,
              borderRadius: 6,
              fontSize: 11,
              width: 180,
            },
          });
        });
        artifactYPosition += 120;
      }
    });

    return nodes;
  }, [impactAnalysis, changeRequestTitle]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    // Connect CR to requirements
    impactAnalysis.affectedRequirements.forEach((req) => {
      edges.push({
        id: `cr-${req.requirementId}`,
        source: 'cr',
        target: req.requirementId,
        type: 'smoothstep',
        animated: req.impactType === 'direct',
        style: {
          stroke: getNodeColor(req.impactType),
          strokeWidth: req.impactType === 'direct' ? 3 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: getNodeColor(req.impactType),
        },
      });
    });

    // Connect requirements to artifacts (simplified - connect to first requirement)
    if (impactAnalysis.affectedRequirements.length > 0) {
      const firstReqId = impactAnalysis.affectedRequirements[0].requirementId;
      impactAnalysis.impactedArtifacts.forEach((artifact) => {
        edges.push({
          id: `${firstReqId}-${artifact.artifactId}`,
          source: firstReqId,
          target: artifact.artifactId,
          type: 'smoothstep',
          style: {
            stroke: '#8b5cf6',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#8b5cf6',
          },
        });
      });
    }

    return edges;
  }, [impactAnalysis]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] border rounded-lg bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.id === 'cr') return '#3b82f6';
            return '#8b5cf6';
          }}
          className="bg-white"
        />
      </ReactFlow>
    </div>
  );
}
