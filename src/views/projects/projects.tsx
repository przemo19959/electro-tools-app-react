import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "../../components/search/search";
import type { DataTableColumn, DataTableSort } from "../../components/data-table/types";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/data-table-toolbar";
import { EditProjectModal } from "./edit-project-modal";
import { ProjectActions } from "./project-actions";
import { useProjectApi } from "../../hooks/project/use-project-api";
import { type ReadProjectDto } from "../../api/api";
import dayjs from "dayjs";
import { ConfirmModal } from "../../components/modals/confirm-modal";
import { HANDLE_ABORT_EXCEPTION } from "../../utils/api-utils";
import { StyledAvatar, StyledCard, StyledCardContent, StyledCardHeader } from "../styles";
import { useNavigate } from "react-router";

const onToggle = (project: ReadProjectDto, selection: string[]): string[] => {
    const key = `${project.id}`;
    if (selection.includes(key)) {
        return selection.filter(v => v !== key);
    } else {
        return [...selection, key];
    }
}

const onAllToggle = (selectAll: boolean, projects: ReadProjectDto[]): string[] => {
    if (selectAll) {
        return projects.map(v => v.id + '');
    } else {
        return [];
    }
}

type EditProjectModalMode = 'CREATE' | 'EDIT' | 'NONE';

export const Projects = () => {
    const [query, setQuery] = useState<string>('');
    const [sort, setSort] = useState<DataTableSort<ReadProjectDto> | undefined>(undefined);
    const [selection, setSelection] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [projects, setProjects] = useState<ReadProjectDto[]>([]);

    const [editProjectModalMode, setEditProjectModalMode] = useState<EditProjectModalMode>('NONE');
    const [editedProject, setEditedProject] = useState<ReadProjectDto | undefined>(undefined);
    const [deleteModalMessage, setDeleteModalMessage] = useState<string | undefined>(undefined);
    const [deleteProjectIds, setDeleteProjectIds] = useState<string[]>([]);

    const {
        pageAll,
        deleteAllById,
    } = useProjectApi();
    const navigate = useNavigate();

    const reload = useCallback((
        page: number,
        pageSize: number,
        sort?: DataTableSort<ReadProjectDto>,
        query?: string,
    ) => pageAll(
        page,
        pageSize,
        sort,
        query,
    ).then(v => {
        setTotalElements(v.totalElements ?? 0);
        setProjects(v.content ?? []);
    })
        .catch(HANDLE_ABORT_EXCEPTION), [pageAll]);

    const columns: DataTableColumn<ReadProjectDto>[] = useMemo(() => [
        { key: 'name', label: 'Project name' },
        { key: 'elementCount', label: 'Element count', colStyle: { width: '200px' } },
        { key: 'createdBy', label: 'Owner' },
        { key: 'modifiedBy', label: 'Modified by' },
        { key: 'modifiedDate', label: 'Last modified at', render: v => dayjs(v.modifiedDate).format('YYYY-MM-DD HH:mm') },
        {
            key: 'actions' as keyof ReadProjectDto,
            label: 'Actions',
            render: (v) => (
                <ProjectActions
                    onGoToPlanner={() => {
                        navigate(`/planner/${v.id}`);
                    }}
                    onEdit={() => {
                        setEditProjectModalMode('EDIT');
                        setEditedProject(v);
                    }}
                    onDelete={() => {
                        if (v.id) {
                            setDeleteProjectIds([v.id]);
                            setDeleteModalMessage(`Do you want to delete project ${v.name}?`);
                        }
                    }}
                />
            ),
            colStyle: {
                width: '40px',
            }
        },
    ], [navigate]);


    useEffect(() => {
        reload(page, pageSize, sort, query);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); //this must be empty

    return (
        <StyledCard>
            <StyledCardHeader
                avatar={
                    <StyledAvatar aria-label="project">
                        P
                    </StyledAvatar>
                }
                action={
                    <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        onClick={() => {
                            setEditedProject(undefined);
                            setEditProjectModalMode('CREATE');
                        }}
                        data-cy="create_project_btn"
                    >
                        Create Project
                    </Button>
                }
                title="Projects"
                subheader="Manage your projects here"
            />
            <StyledCardContent>
                <DataTableToolbar
                    beforeSlot={(
                        <Search value={query} onChange={(v) => {
                            setPage(0);
                            setQuery(v);
                            reload(0, pageSize, sort, v);
                        }} />
                    )}
                    numSelected={selection.length}
                    onDeleteSelected={() => {
                        setDeleteProjectIds(selection);
                        setDeleteModalMessage(`Do you want to delete ${selection.length} project(s)?`);
                    }}
                />
                <DataTable
                    columns={columns}
                    items={projects}
                    getItemId={v => `${v.id}`}
                    page={page}
                    onPageChange={(v) => {
                        setPage(v);
                        reload(v, pageSize, sort, query);
                    }}
                    pageSize={pageSize}
                    onPageSizeChange={(v) => {
                        setPage(0);
                        setPageSize(v);
                        reload(0, v, sort, query);
                    }}
                    selection={selection}
                    sort={sort}
                    onSortChange={setSort}
                    onSelectAll={(v) => setSelection(onAllToggle(v, projects))}
                    onClick={(v) => setSelection(onToggle(v, selection))}
                    totalElements={totalElements}
                />
            </StyledCardContent>
            {editProjectModalMode !== 'NONE' && (
                <EditProjectModal
                    edit={editProjectModalMode === 'EDIT'}
                    project={editedProject}
                    onSuccess={() => {
                        setEditProjectModalMode('NONE');
                        reload(page, pageSize, sort, query);
                    }}
                    onCancel={() => setEditProjectModalMode('NONE')}
                />
            )}
            {deleteModalMessage !== undefined && (
                <ConfirmModal
                    message={deleteModalMessage}
                    onConfirm={() => {
                        deleteAllById(deleteProjectIds)
                            .then(() => {
                                setPage(0);
                                setSelection(prev => prev.filter(v2 => !deleteProjectIds.includes(v2)));
                                reload(0, pageSize, sort, query);
                                setDeleteModalMessage(undefined);
                            })
                    }}
                    onClose={() => setDeleteModalMessage(undefined)}
                />
            )}
        </StyledCard>
    )
};