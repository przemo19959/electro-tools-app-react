import { Avatar, Button, Card, CardContent, CardHeader } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styled from "@emotion/styled";
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

    const {
        pageAll,
        deleteById,
    } = useProjectApi();

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
    }), [pageAll]);

    const columns: DataTableColumn<ReadProjectDto>[] = useMemo(() => [
        { key: 'name', label: 'Project name' },
        { key: 'elementCount', label: 'Element count', colStyle: { width: '200px' } },
        { key: 'createdBy', label: 'owner' },
        { key: 'modifiedBy', label: 'Modified by' },
        { key: 'modifiedDate', label: 'Last modified at', render: v => dayjs(v.modifiedDate).format('YYYY-MM-DD HH:mm') },
        {
            key: 'actions' as keyof ReadProjectDto,
            label: 'Actions',
            render: (v) => (
                <ProjectActions
                    onDelete={() => {
                        if (v.id) {
                            deleteById(v.id)
                                .then(() => {
                                    const newPage = projects.length === 1 ? 0 : page;
                                    setPage(newPage);
                                    setSelection(prev => prev.filter(v2 => v2 !== v.id));
                                    reload(newPage, pageSize, sort, query);
                                });
                        }
                    }}
                    onEdit={() => {
                        setEditProjectModalMode('EDIT');
                        setEditedProject(v);
                    }}
                />
            ),
            colStyle: {
                width: '40px',
            }
        },
    ], [deleteById, pageSize, query, reload, sort, projects.length, page]);


    useEffect(() => {
        reload(page, pageSize, sort, query);
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
        </StyledCard>
    )
};

const StyledCard = styled(Card)`
  margin: 16px;

  display: flex;
  flex-direction:column;
  flex: 1;
  min-height:0;
`;

const StyledCardContent = styled(CardContent)`
    display: flex;
    flex-direction:column;
    flex: 1;
    min-height:0;
    gap: .5rem;
`

const StyledCardHeader = styled(CardHeader)`
    text-align: left;

    .MuiCardHeader-action{
        margin: 0;
    }
`;

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
}));
