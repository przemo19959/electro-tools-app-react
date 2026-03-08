import { Button } from "@mui/material";
import { StyledAvatar, StyledCard, StyledCardContent, StyledCardHeader } from "../styles";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange, Controls, Background, BackgroundVariant, type Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import type { ElectricElement } from "../../domain/electricelement/electric-element";
import { EditElementModal } from "./edit-element-modal";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch } from "../../store/hooks";
import { addAlert } from "../../components/alert-stack/alert-stack-slice";
import { useElectricElementApi } from "../../hooks/element/use-electric-element-api";
import { HANDLE_ABORT_EXCEPTION } from "../../utils/api-utils";
import type { UpdateBasicElementPositionDto } from "../../api/api";

type EditElementModalMode = 'CREATE' | 'EDIT' | 'NONE';

export const Planner = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [editElementModalMode, setEditElementModalMode] = useState<EditElementModalMode>('NONE');
    const [editedElement, setEditedElement] = useState<ElectricElement | undefined>(undefined);

    const dispatch = useAppDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const { getTrees, updatePositions } = useElectricElementApi();

    const reload = () => {
        if (params.projectId) {
            getTrees(params.projectId)
                .then(v => {
                    setNodes(v.map(v2 => {
                        const { id, x, y, ...rest } = v2;
                        return ({
                            id: id ?? '',
                            position: {
                                x: x ?? 0,
                                y: y ?? 0,
                            },
                            data: rest,
                        });
                    }));
                })
                .catch(HANDLE_ABORT_EXCEPTION)
        }
    }

    const validateProjectIdParam = () => {
        if (!params.projectId) {
            dispatch(addAlert({
                id: new Date().getTime(),
                message: 'Unable to load planner view for unknown project',
                type: 'error',
            }))
            navigate("/projects", {});
        }
    }

    useEffect(() => {
        validateProjectIdParam();
        reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => {

            setNodes((prev) => applyNodeChanges(changes, prev));

            const positionDragEndChanges: UpdateBasicElementPositionDto[] = changes
                .map(v => {
                    if (v.type === 'position' && v.dragging === false) {
                        return ({
                            elementId: v.id,
                            ...v.position,
                        }) as UpdateBasicElementPositionDto
                    }
                    return {};
                }).filter(v => Boolean(v.elementId));
            if (positionDragEndChanges.length !== 0) {
                updatePositions(positionDragEndChanges);
            }
        },
        [updatePositions],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange<Edge>[]) => setEdges((prev) => applyEdgeChanges(changes, prev)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((prev) => addEdge(params, prev)),
        [],
    );

    const handleAddElement = () => {
        validateProjectIdParam();
        setEditedElement(undefined);
        setEditElementModalMode('CREATE');
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
                    <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        onClick={handleAddElement}
                        data-cy="add_element_btn"
                    >
                        Add element
                    </Button>
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
                {editElementModalMode !== 'NONE' && Boolean(params.projectId) && (
                    <EditElementModal
                        projectId={params.projectId!}
                        edit={editElementModalMode === 'EDIT'}
                        element={editedElement}
                        onSuccess={() => {
                            setEditElementModalMode('NONE');
                            reload();
                        }}
                        onCancel={() => setEditElementModalMode('NONE')}
                    />
                )}
            </StyledCardContent>
        </StyledCard>
    );
}