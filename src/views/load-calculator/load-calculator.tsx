import { useEffect, useState } from "react";
import { LoadElement } from "../../domain/electricelement/concrete/load/load-element";
import { StyledAvatar, StyledCard, StyledCardContent, StyledCardHeader } from "../styles";
import { CurrentTable } from "../../domain/currenttable/CurrentTable";
import { VoltageDropIndicator } from "../../components/indicators/voltage-drop-indicator";
import { ImpedanceIndicator } from "../../components/indicators/impedance-indicator";
import { ShortCurrentIndicator } from "../../components/indicators/short-current-indicator";
import { WireView } from "../../components/wire-view/wire-view";
import { MAX_CAPACITY_FORM_KEY } from "../../components/wire-view/raw-wire-view";
import { LoadView } from "../../components/load-view/load-view";
import { MessageListView } from "../../components/message-list-view/message-list-view";
import { WIRE_SCHEMA, LOAD_SCHEMA, type WireForm, type LoadForm } from "../planner/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export const LoadCalculator = () => {
    const [load, setLoad] = useState<LoadElement>(LoadElement.empty().check());

    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<WireForm & LoadForm>({
        defaultValues: {
            ...load,
            wire: {
                ...load.wire,
                maxCapacity: CurrentTable.findLoadCapacityByWire(load.wire).orElse(0),
            },
        },
        resolver: zodResolver(WIRE_SCHEMA.and(LOAD_SCHEMA)),
        mode: 'onChange',
    });

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            const tmp = LoadElement.createFromRaw(value);
            if (name !== MAX_CAPACITY_FORM_KEY && name?.startsWith("wire.")) {
                setValue(MAX_CAPACITY_FORM_KEY, CurrentTable.findLoadCapacityByWire(tmp.wire).orElse(0), { shouldValidate: true });
            } else {
                tmp.check();
                setLoad(tmp);
            }
        });
        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch]);

    const onPowerChange = (power: number) => setValue('drawPower', power, { shouldValidate: true });

    const voltageDropIndicator = <VoltageDropIndicator {...load.context} testID="load_calculator" />
    const impedanceIndicator = <ImpedanceIndicator {...load.context} testID="load_calculator" />

    return (
        <StyledCard>
            <StyledCardHeader
                avatar={
                    <StyledAvatar>
                        C
                    </StyledAvatar>
                }
                title={t('TITLES.LOAD_CALC')}
                subheader={t('TITLES.LOAD_CALC_SUBHEADER')}
                data-cy="load_calculator_header"
            />
            <StyledCardContent>
                <WireView
                    control={control}
                    errors={errors}
                    voltageDropIndicator={voltageDropIndicator}
                    context={load.context}
                    impedanceIndicator={impedanceIndicator}
                    withoutParent
                    loss={load.wirePowerLoss()}
                    shortCurrentIndicator={<ShortCurrentIndicator element={load} />}
                />
                <hr style={{ width: '100%' }} />
                <LoadView
                    load={load}
                    control={control}
                    voltageDropIndicator={voltageDropIndicator}
                    onPowerChange={onPowerChange}
                />
                <MessageListView messages={load.messages} />
            </StyledCardContent>
        </StyledCard>
    );
}