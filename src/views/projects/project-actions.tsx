import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Tooltip } from "@mui/material";

type ProjectActionsProps = {
    onDelete: () => void;
    onEdit: () => void;
};

export const ProjectActions = ({ onDelete, onEdit }: ProjectActionsProps) => (
    <StyledRow>
        <Tooltip title="Edit">
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
        <Tooltip title="Delete">
            <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    </StyledRow>
);

const StyledRow = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;
