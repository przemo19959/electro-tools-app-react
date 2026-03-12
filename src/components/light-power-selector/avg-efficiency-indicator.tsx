import { Chip } from "@mui/material";
import { joinTestIDs } from "../../utils/common-utils";
import { useTranslation } from "react-i18next";

type AvgEfficiencyTouchableProps = {
    active: boolean;
    onClick?: () => void;
    testID?: string;
}

enum AvgEfficiencyIndicator_TestIDs {
    touchable = 'AvgEfficiencyIndicator_touchable',
}

export const AvgEfficiencyIndicator = ({
    active,
    onClick,
    testID,
}: AvgEfficiencyTouchableProps) => {
    const { t } = useTranslation();

    if (!active) return null;

    return (
        <Chip
            size="small"
            color="secondary"
            label={t('COMMON.SET_AVG')}
            onClick={onClick}
            data-cy={joinTestIDs(testID, AvgEfficiencyIndicator_TestIDs.touchable)}
            style={{ fontWeight: 'bold', marginRight: '0.25rem', zIndex: 1 }}
        />
    );
}