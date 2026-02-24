import { Avatar, Button, Card, CardContent, CardHeader, IconButton, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styled from "@emotion/styled";
import { useState } from "react";
import { Search } from "../../components/search/search";
import DeleteIcon from '@mui/icons-material/Delete';
import type { DataTableColumn, DataTableSort } from "../../components/data-table/types";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/data-table-toolbar";

type Project = {
    id: number;
    name: string;
    owner: string;
    elementCount: number;
}

const projects: Project[] = [
    { id: 1, name: 'Data Grid', owner: 'the Community version', elementCount: 100 },
    { id: 2, name: 'Data Grid Pro', owner: 'the Pro version', elementCount: 200 },
    { id: 3, name: 'Data Grid Premium', owner: 'the Premium version', elementCount: 300 },
    { id: 4, name: 'Analytics Dashboard', owner: 'Ops Team', elementCount: 87 },
    { id: 5, name: 'Client Portal', owner: 'Frontend Guild', elementCount: 143 },
    { id: 6, name: 'Asset Tracker', owner: 'Platform Team', elementCount: 59 },
    { id: 7, name: 'Workflow Engine', owner: 'Automation Squad', elementCount: 212 },
    { id: 8, name: 'Invoice Manager', owner: 'Finance Tools', elementCount: 96 },
    { id: 9, name: 'Fleet Monitor', owner: 'IoT Division', elementCount: 174 },
    { id: 10, name: 'Knowledge Base', owner: 'Support Team', elementCount: 121 },
    { id: 11, name: 'Release Planner', owner: 'DevOps Group', elementCount: 68 },
    { id: 12, name: 'Security Console', owner: 'Security Team', elementCount: 251 },
];

const columns: DataTableColumn<Project>[] = [
    { key: 'name', label: 'Project Name' },
    { key: 'owner', label: 'Project Owner' },
    { key: 'elementCount', label: 'Element Count', colStyle: { width: '200px' } },
    {
        key: 'actions' as keyof Project,
        label: 'Actions',
        render: (v) => (
            <StyledRow>
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" size="small" onClick={e => {
                        e.stopPropagation();
                        console.log(`Delete project with id ${v.id}`);
                    }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </StyledRow >
        ),
        colStyle: {
            width: '40px',
        }
    },
];

const onToggle = (project: Project, selection: string[]): string[] => {
    const key = `${project.id}`;
    if (selection.includes(key)) {
        return selection.filter(v => v !== key);
    } else {
        return [...selection, key];
    }
}

const onAllToggle = (selectAll: boolean, projects: Project[]): string[] => {
    if (selectAll) {
        return projects.map(v => v.id + '');
    } else {
        return [];
    }
}

export const Projects = () => {
    const [query, setQuery] = useState<string>('');
    const [sort, setSort] = useState<DataTableSort<Project> | undefined>(undefined);
    const [selection, setSelection] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    return (
        <StyledCard>
            <StyledCardHeader
                avatar={
                    <StyledAvatar aria-label="project">
                        P
                    </StyledAvatar>
                }
                action={
                    <Button variant="contained" endIcon={<AddIcon />}>
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
                            setQuery(v);
                            console.log(v);
                        }} />
                    )}
                    numSelected={selection.length}
                />
                <DataTable
                    columns={columns}
                    items={projects}
                    getItemId={v => `${v.id}`}
                    page={page}
                    onPageChange={setPage}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    selection={selection}
                    sort={sort}
                    onSortChange={setSort}
                    onSelectAll={(v) => setSelection(onAllToggle(v, projects))}
                    onClick={(v) => setSelection(onToggle(v, selection))}
                />
            </StyledCardContent>
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

const StyledRow = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
}));
