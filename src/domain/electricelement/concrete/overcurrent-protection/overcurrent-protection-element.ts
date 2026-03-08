import { ElectricElement } from "../../electric-element";
import { type ElectricElementContext, EMPTY_CONTEXT, TYPE_TO_DEFAULT_LABEL } from "../../types";
import { OvercurrentProtectionType } from "./overcurrent-protection-type";
import { type OvercurrentPredefinedValue, type OvercurrentRangeResult, CLASS_TO_AMPERAGE_VALUES, OVERCURRENT_PREDEFINED_MAP } from "./types";
import Optional from "optional-js";
import { CommonUtils } from "../../../../utils/common-utils";
import { CurrentTable } from "../../../currenttable/CurrentTable";
import { ElementMessage, MessageKey } from "../../../elementmessage/element-message";
import { Wire } from "../../../wire/wire";
import cloneDeep from 'lodash.clonedeep';

export type CreateEmptyOvercurrentElement = {
    parentId?: string;
    existingCount?: number;
    predefinedValue?: OvercurrentPredefinedValue;
};

export class OvercurrentProtectionElement extends ElectricElement {
    constructor(
        public id: string,
        public parentId: string | undefined,

        public wire: Wire,

        public label: string,
        public messages: ElementMessage[],
        public children: ElectricElement[],
        public context: ElectricElementContext,

        public overCurrentProtectionType: OvercurrentProtectionType,
        public amperage: number,
    ) {
        super(id, parentId, 'OVER_CURRENT_PROTECTION', wire, label, messages, children, context);
    }

    static predefined({
        parentId,
        existingCount,
        predefinedValue = 'OVERCURRENT_SOCKET',
    }: CreateEmptyOvercurrentElement) {
        const predefinedValues = OVERCURRENT_PREDEFINED_MAP[predefinedValue];
        return new OvercurrentProtectionElement(
            '',
            parentId,
            Wire.empty(),
            `${TYPE_TO_DEFAULT_LABEL.OVER_CURRENT_PROTECTION}${existingCount ?? ''}`,
            [],
            [],
            EMPTY_CONTEXT(),
            predefinedValues.overCurrentProtectionType,
            predefinedValues.amperage,
        );
    }

    static createFromDB(data: any) {
        return new OvercurrentProtectionElement(
            data.id,
            data.parentId,
            Wire.createFromDB(data),
            data.label,
            [],
            [],
            EMPTY_CONTEXT(),
            OvercurrentProtectionType.of(data.overcurrent_protection_type) ?? data.overcurrent_protection_type,
            data.amperage,
        );
    }

    static createFromRaw(data: any) {
        return new OvercurrentProtectionElement(
            data.id,
            data.parentId,
            Wire.createFromRaw(data.wire),
            data.label,
            data.messages ?? [],
            (data.children ?? []).map((v: ElectricElement) => v.clone()),
            { ...data.context },
            data.overCurrentProtectionType,
            data.amperage,
        );
    }

    clone(): ElectricElement {
        return new OvercurrentProtectionElement(
            this.id,
            this.parentId,
            Wire.createFromRaw(this.wire),
            this.label,
            this.messages,
            this.children.map(v => v.clone()),
            { ...this.context },
            this.overCurrentProtectionType,
            this.amperage,
        );
    }

    // imageSource() {
    //     return require('./../../../../assets/images/wylacznik_nadpradowy.png');
    // }

    /**
     * This is current that guarantees to fire op in relatively small time. According to
     * time charts under 1s, so we assume 'fast'. Cause Idraw = Iop says, that time will
     * take more than 10 000s ~ 3h to fire.
     */
    getFireCurrentByClass() {
        return this.amperage * this.overCurrentProtectionType.onValue;
    }

    protected recalculateContextByType(): void {
        this.context.closestOp = OvercurrentProtectionElement.createFromRaw({
            ...cloneDeep(this),
            children: [], //without children, cause there is no point
        });
    }

    check(withChildren?: boolean): void {
        super.check(withChildren);

        this.matchingOpRule();
        this.checkSplitRule();
    }

    /**
     * General rule says that Idraw &#8804; Iop &#8804; Icapacity. Meaning that total drawing current of op every child must be
     * less than nominal current of op (if it will be higher, we risk that it will be triggered every time we turn on
     * load). Also nominal current of op must be less than wire max capacity (otherwise there is risk that load current
     * not triggering op fire will damage wire itself).
     * 
     * Second condition is actually verified additionally by {@link ElectricElement wrongWireRule} rule, so we know it will
     * be satisfied.
     * 
     * So actually Idraw &#8804; Iop. With this we are guaranteed that op will never fire for given load. Actually according
     * to time charts of op, Idraw equal to 1.13Iop is min current for which op can ever fire. Range [1.13Iop; 1.45Iop] is
     * underterminate. Op will fire, but actual time depends on Idraw level. For lower it may take several hundred seconds. 
     * For higher it may be shorted i.e. several seconds. Value 1.45Iop enters region when it's guaranteed to fire, but again
     * actual time is not determined.
     * 
     * Which value we should take is actually discusional. When we take Iop as is, according to time charts op will fire after
     * 10000s ~ 3h. So it's actually 'too long'. When we take 1.13Iop, time will be less that this. If we take value 1.45Iop we
     * have same upper limit, but with guarantee that it will fire. If we take 2Iop op will fire after 200s ~ 3min. If we take
     * 3Iop op will fire under 1s, which is ok.
     * 
     * But if we take 3Iop, then 2.5kW resistive load will draw 11.8A, so we would need 35.4A op to protect that, which is too
     * much. So actually op role is just to sit between Idraw and Icapacity. Op may pass even higher currents (over it's Iop)
     * as long as that Idraw &#8804; Icapacity. Main goal of op is just to protect against shorts, and in case of short op is
     * guaranteed to fire, as Idraw is at least 10 times of Iop (according to time chart, it will fire in miliseconds).
     */
    private matchingOpRule() {
        const result = this.matchingOpRuleHelper(this);
        const valid = result.lower <= this.amperage && this.amperage <= result.upper;

        const isCorrectValueAvailable = CLASS_TO_AMPERAGE_VALUES[this.overCurrentProtectionType.name]?.some(v => result.lower <= v && v <= result.upper);
        this.handleMessage(valid, MessageKey.WRONG_OVERCURRENT_PROTECTION, { lower: result.lower.toFixed(2), upper: result.upper.toFixed(2) });
        this.handleMessage(isCorrectValueAvailable, MessageKey.NO_MATCHING_OP, {});
    }

    private matchingOpRuleHelper(element: ElectricElement): OvercurrentRangeResult {
        const drawCurrent = element.getTotalCurrent();
        const maxCapacity = Optional.ofNullable(element.wire).flatMap(v => CurrentTable.findLoadCapacityByWire(v)).orElse(-1);

        return ({
            lower: drawCurrent,
            upper: maxCapacity,
            elementLabel: element.label,
        });
    }

    private checkSplitRule() {
        const ranges: OvercurrentRangeResult[] = [];
        this.children
            .filter(v => v.getTotalCurrent() > 0)
            .map(v => this.matchingOpRuleHelper(v))
            .forEach(v => ranges.push(v));

        const valid = ranges.length === 0 || ranges.every(v => CommonUtils.rangeOverlap(
            [ranges[0].lower, ranges[0].upper],
            [v.lower, v.upper],
        ));
        this.handleMessage(valid, MessageKey.OVERCURRENT_SPLIT_POSSIBLE, {
            rangeListString: ranges
                .map(v => `${v.elementLabel}: [${v.lower.toFixed(2)}, ${v.upper.toFixed(2)}]`)
                .filter((v, i, array) => array.indexOf(v) === i)
                .join(','),
        });
    }
}