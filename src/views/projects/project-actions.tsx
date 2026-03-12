import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SchemaIcon from '@mui/icons-material/Schema';
import { IconButton, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

type ProjectActionsProps = {
    onGoToPlanner: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export const ProjectActions = ({
    onGoToPlanner,
    onEdit,
    onDelete,
}: ProjectActionsProps) => {
    const { t } = useTranslation();
    return (
        <StyledRow>
            <Tooltip title={t('PROJECTS.GO_TO_PLANNER')}>
                <IconButton
                    aria-label="planner"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onGoToPlanner();
                    }}
                >
                    <SchemaIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('PROJECTS.EDIT')}>
                <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={t('PROJECTS.DELETE')}>
                <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    data-cy="delete_action"
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </StyledRow>
    );
};

const StyledRow = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;
