import styled from "@emotion/styled";
import { ElementMessage } from "../../domain/elementmessage/element-message";
import { css, useTheme } from "@mui/material";

type Props = {
    messages: ElementMessage[];
};

export const MessageListView = ({ messages }: Props) => {
    // const { t } = useTranslation();
    const { palette } = useTheme();

    return (
        <StyledCol>
            {messages.map(v => (
                <StyledRow key={v.id} style={{ alignItems: 'center' }}>
                    {v.key.type.sign}
                    <StyledText color={v.key.type.fromPalette(palette)}>
                        {/* {t(v.key.translationKey(), v.params)} */'todo'}
                    </StyledText>
                </StyledRow>
            )
            )}
        </StyledCol>
    );
};

const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledRow = styled.div`
    display: flex;
    align-items: center;
`;

const StyledText = styled.div<{ color: string }>`   
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    ${({ color }) => css`
        color: ${color};
    `}
`;