import styled from "@emotion/styled";
import { Avatar, Card, CardContent, CardHeader } from "@mui/material";

export const StyledCard = styled(Card)`
  margin: 16px;

  display: flex;
  flex-direction:column;
  flex: 1;
  min-height:0;
`;

export const StyledCardContent = styled(CardContent)`
    display: flex;
    flex-direction:column;
    flex: 1;
    min-height:0;
    gap: .5rem;
    overflow: auto;
`

export const StyledCardHeader = styled(CardHeader)`
    text-align: left;

    .MuiCardHeader-action{
        margin: 0;
    }
`;

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
}));