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
import { useTranslation } from "react-i18next";
import { type FilterGroupDto } from "../../api/api";
import { DataTableFilters } from "../../components/data-table/data-table-filters";
import { FilterUtils } from "../../utils/filter-utils";
import { DebouncedTextField } from "../../components/form-text-field/debounced-text-field";

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
const DEFAULT_FILTER: FilterGroupDto = {
    operator: 'AND',
    columns: [],
    groups: [],
};

type EditProjectModalMode = 'CREATE' | 'EDIT' | 'NONE';

export const Projects = () => {
    const [query, setQuery] = useState<string>('');
    const [sort, setSort] = useState<DataTableSort<ReadProjectDto> | undefined>(undefined);
    const [selection, setSelection] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [projects, setProjects] = useState<ReadProjectDto[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filter, setFilter] = useState<FilterGroupDto>(DEFAULT_FILTER);

    const [editProjectModalMode, setEditProjectModalMode] = useState<EditProjectModalMode>('NONE');
    const [editedProject, setEditedProject] = useState<ReadProjectDto | undefined>(undefined);
    const [deleteModalMessage, setDeleteModalMessage] = useState<string | undefined>(undefined);
    const [deleteProjectIds, setDeleteProjectIds] = useState<string[]>([]);

    const {
        pageAll,
        deleteAllById,
    } = useProjectApi();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const reload = useCallback((
        filter: FilterGroupDto,
        page: number,
        pageSize: number,
        sort?: DataTableSort<ReadProjectDto>,
        query?: string,
    ) => pageAll(
        filter,
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
        { key: 'name', label: t('PROJECTS_COL.PROJECT_NAME') },
        { key: 'elementCount', label: t('PROJECTS_COL.ELEMENT_COUNT'), colStyle: { width: '200px' } },
        { key: 'createdBy', label: t('PROJECTS_COL.OWNER') },
        { key: 'modifiedBy', label: t('PROJECTS_COL.MODIFIED_BY') },
        { key: 'modifiedDate', label: t('PROJECTS_COL.LAST_MODIFIED_AT'), render: v => dayjs(v.modifiedDate).format('YYYY-MM-DD HH:mm') },
        {
            key: 'actions' as keyof ReadProjectDto,
            label: t('PROJECTS_COL.ACTIONS'),
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
                            setDeleteModalMessage(t('QUESTIONS.DELETE_PROJECT', { projectName: v.name }));
                        }
                    }}
                />
            ),
            colStyle: {
                width: '40px',
            }
        },
    ], [navigate, t]);


    useEffect(() => {
        reload(filter, page, pageSize, sort, query);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <StyledCard>
            <StyledCardHeader
                avatar={
                    <StyledAvatar>
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
                title={t('VIEWS.PROJECTS')}
                subheader={t('TITLES.PROJECTS_SUBHEADER')}
            />
            <StyledCardContent>
                <DataTableToolbar
                    beforeSlot={(
                        <Search value={query} onChange={(v) => {
                            setPage(0);
                            setQuery(v);
                            reload(filter, 0, pageSize, sort, v);
                        }} />
                    )}
                    numSelected={selection.length}
                    onDeleteSelected={() => {
                        setDeleteProjectIds(selection);
                        setDeleteModalMessage(t('QUESTIONS.DELETE_MULTI_PROJECT', { count: selection.length }));
                    }}
                    onFilterToggle={() => setFilterOpen(prev => !prev)}
                />
                <DataTableFilters
                    open={filterOpen}
                    onClear={() => {
                        setFilter(DEFAULT_FILTER);
                        reload(DEFAULT_FILTER, 0, pageSize, sort, query);
                    }}
                    testID="project_filters"
                >
                    <DebouncedTextField
                        label="Name"
                        value={FilterUtils.getColumnValue(filter, 'NAME')}
                        onChange={(v) => {
                            const newFilter = FilterUtils.updateStringEq(filter, 'NAME', v);
                            setFilter(newFilter);
                            reload(newFilter, 0, pageSize, sort, query);
                        }}
                        testID="project_filter_name_input"
                    />
                    <DebouncedTextField
                        label="Created By"
                        value={FilterUtils.getColumnValue(filter, 'CREATED_BY')}
                        onChange={(v) => {
                            const newFilter = FilterUtils.updateStringEq(filter, 'CREATED_BY', v);
                            setFilter(newFilter);
                            reload(newFilter, 0, pageSize, sort, query);
                        }}
                        testID="project_filter_created_by_input"
                    />
                    <DebouncedTextField
                        label="Created At"
                        value={FilterUtils.getColumnValue(filter, 'CREATED_DATE')}
                        onChange={(v) => {
                            const newFilter = FilterUtils.updateStringEq(filter, 'CREATED_DATE', v);
                            setFilter(newFilter);
                            reload(newFilter, 0, pageSize, sort, query);
                        }}
                        testID="project_filter_created_date_input"
                    />
                    <DebouncedTextField
                        label="Updated By"
                        value={FilterUtils.getColumnValue(filter, 'MODIFIED_BY')}
                        onChange={(v) => {
                            const newFilter = FilterUtils.updateStringEq(filter, 'MODIFIED_BY', v);
                            setFilter(newFilter);
                            reload(newFilter, 0, pageSize, sort, query);
                        }}
                        testID="project_filter_modified_by_input"
                    />
                    <DebouncedTextField
                        label="Updated At"
                        value={FilterUtils.getColumnValue(filter, 'MODIFIED_DATE')}
                        onChange={(v) => {
                            const newFilter = FilterUtils.updateStringEq(filter, 'MODIFIED_DATE', v);
                            setFilter(newFilter);
                            reload(newFilter, 0, pageSize, sort, query);
                        }}
                        testID="project_filter_modified_date_input"
                    />
                </DataTableFilters>
                <DataTable
                    columns={columns}
                    items={projects}
                    getItemId={v => `${v.id}`}
                    page={page}
                    onPageChange={(v) => {
                        setPage(v);
                        reload(filter, v, pageSize, sort, query);
                    }}
                    pageSize={pageSize}
                    onPageSizeChange={(v) => {
                        setPage(0);
                        setPageSize(v);
                        reload(filter, 0, v, sort, query);
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
                        reload(filter, page, pageSize, sort, query);
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
                                reload(filter, 0, pageSize, sort, query);
                                setDeleteModalMessage(undefined);
                            })
                    }}
                    onClose={() => setDeleteModalMessage(undefined)}
                />
            )}
        </StyledCard>
    )
};