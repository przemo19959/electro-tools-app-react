import { MenuButton } from "../../components/menu-button/menu-button";
import { MenuItem } from "@mui/material";
import type { ReadAbstractElementDto } from "../../api/api";
import { StyledAvatar, StyledCard, StyledCardContent, StyledCardHeader } from "../styles";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange, Controls, Background, BackgroundVariant, type Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from "react";

type ElementType = NonNullable<ReadAbstractElementDto['elementType']>
const ELEMENT_TYPES: ElementType[] = [
    'LOAD',
    'OVER_CURRENT_PROTECTION',
    'RCD',
    'TERMINAL',
    'UNKNOWN',
];

export const Planner = () => {
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: '1',
            position: { x: 0, y: 0 },
            data: { age: 10, label: 'aaa' },
        }
    ]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => setNodes((prev) => applyNodeChanges(changes, prev)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange<Edge>[]) => setEdges((prev) => applyEdgeChanges(changes, prev)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((prev) => addEdge(params, prev)),
        [],
    );

    const handleAddElement = (type: ElementType) => {
        console.log(type);
    }

    return (
        <StyledCard>
            <StyledCardHeader
                avatar={
                    <StyledAvatar aria-label="planner">
                        P
                    </StyledAvatar>
                }
                action={
                    <MenuButton label="Add element">
                        {ELEMENT_TYPES.map(v => (
                            <MenuItem
                                key={v}
                                onClick={() => handleAddElement(v)}
                            >
                                {v}
                            </MenuItem>
                        ))}
                    </MenuButton>
                }
                title="Planner"
                subheader="Manage your project elements"
            />
            <StyledCardContent>
                <div style={{ width: '100%', height: '100%' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        colorMode="dark"
                    >
                        <Controls />
                        <Background color="#ccc" variant={BackgroundVariant.Dots} />
                    </ReactFlow>
                </div>
            </StyledCardContent>
        </StyledCard>
    );
}