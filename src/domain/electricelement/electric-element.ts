import { Wire } from "../wire/wire";
import { CurrentTable } from "../currenttable/CurrentTable";
import { ElementMessage, MessageKey, type MessageTypeVal, MESSAGE_TYPE_VALUES } from "../elementmessage/element-message";
import { ArrayUtils } from "../../utils/array-utils";
import { type ElectricElementContext, type ElectricElementIdPair, type ElectricElementType, EMPTY_CONTEXT, TYPE_TO_DEFAULT_LABEL } from "./types";
import Optional from "optional-js";
import { TerminalType } from "./concrete/terminal/terminal-type";
import { WireDiameter } from "../currenttable/enums/WireDiameter";
import type { CreateAbstractElementDto, ReadAbstractElementDto, UpdateAbstractElementDto } from "../../api/api";


export class ElectricElement {
    constructor(
        public id: string,
        public x: number,
        public y: number,
        public parentId: string | undefined,
        public type: ElectricElementType,

        public wire: Wire,
        public label: string,

        public messages: ElementMessage[],
        public children: ElectricElement[],
        public context: ElectricElementContext,
    ) {
    }

    static empty(parentId?: string, existingCount?: number) {
        return new ElectricElement(
            '',
            0,
            0,
            parentId,
            'UNKNOWN',
            Wire.empty(),
            `${TYPE_TO_DEFAULT_LABEL.UNKNOWN}${existingCount ?? ''}`,
            [],
            [],
            EMPTY_CONTEXT(),
        );
    }

    static createFromDB(data: ReadAbstractElementDto) {
        return new ElectricElement(
            data.id ?? '',
            data.x ?? 0,
            data.y ?? 0,
            data.parentId,
            'UNKNOWN',
            data.wire ? Wire.createFromDB(data.wire) : Wire.empty(),
            data.label ?? '???',
            [],
            [],
            EMPTY_CONTEXT(),
        );
    }

    static createFromRaw(data: any) {
        return new ElectricElement(
            data.id,
            data.x,
            data.y,
            data.parentId,
            'UNKNOWN',
            Wire.createFromRaw(data.wire),
            data.label,
            data.messages ?? [],
            (data.children ?? []).map((v: ElectricElement) => v.clone()),
            { ...data.context },
        );
    }

    toCreateDto(projectId: string): CreateAbstractElementDto {
        return {
            x: 0,
            y: 0,
            label: this.label,
            parentId: this.parentId,
            projectId,
            wire: this.wire.toCreate(),
        }
    }

    toUpdateDto(): UpdateAbstractElementDto {
        return {
            x: 0,
            y: 0,
            label: this.label,
            parentId: this.parentId,
            wire: this.wire.toUpdate(),
        }
    }

    addChild(element: ElectricElement) {
        ArrayUtils.putById(this.children, element);
        element.parentId = this.id;
    }

    clone(): ElectricElement {
        return new ElectricElement(
            this.id,
            this.x,
            this.y,
            this.parentId,
            this.type,
            Wire.createFromRaw(this.wire),
            this.label,
            this.messages,
            this.children.map(v => v.clone()),
            { ...this.context },
        );
    }

    // imageSource() {
    //     return require('./../../assets/images/react-logo.png');
    // }

    visualHeight() {
        return 100;
    }

    protected recalculateContextByType(parentContext: ElectricElementContext | undefined) {
        this.context.closestOp = parentContext?.closestOp;
        this.context.terminalType = parentContext?.terminalType ?? TerminalType.TN_C;
    }

    private recalculateContext(parentContext: ElectricElementContext | undefined) {
        //parent part
        if (parentContext) {
            this.context.parentVoltageDrop = parentContext.ownVoltageDrop + parentContext.parentVoltageDrop;
            this.context.parentShortImpedance = parentContext.ownShortImpedance + parentContext.parentShortImpedance;
            this.context.parentLength = parentContext.ownLength + parentContext.parentLength;
            this.context.closestOp = parentContext.closestOp;
            this.context.terminalType = parentContext.terminalType;
        } else {
            this.context.parentVoltageDrop = 0;
            this.context.parentShortImpedance = 0;
            this.context.parentLength = 0;
        }

        this.recalculateContextByType(parentContext);

        //own part
        this.context.ownVoltageDrop = this.voltageDrop();
        this.context.noLoad = this.getTotalCurrent() === 0;
        this.context.ownShortImpedance = this.wire.shortImpedance() ?? 0;
        this.context.ownLength = this.wire.length ?? 0;

        this.children.forEach(v => v.recalculateContext(this.context));
    }

    check(withChildren = false): void {
        if (this.parentId === undefined || this.parentId === null) { // from DB it comes with null value
            this.recalculateContext(undefined);
        }

        this.wrongWireRule();
        this.tooBigWireRule();
        this.voltageDropRule();
        this.selfTurnOffRule();
        this.descendingLoadCapacity();

        if (withChildren) {
            this.children.forEach(v => v.check(withChildren));
        }
    }

    getTotalCurrent(): number {
        return this.children
            .map(v => v.getTotalCurrent())
            .reduce((acc, next) => acc + next, 0);
    }

    getTotalPower(): number {
        return this.children
            .map(v => v.getTotalPower())
            .reduce((acc, next) => acc + next, 0)
    }

    putMessage(key: MessageKey, params: Record<string, string>) {
        const message = ElementMessage.create(key, params);
        ArrayUtils.putByPredicate(this.messages, message, v => v.id === message.id);
    }

    removeMessage(key: MessageKey) {
        ArrayUtils.removeByPredicate(this.messages, v => v.id === key.id);
    }

    is3Phase() {
        return this.wire.phase.id === 'THREE';
    }

    getChildrenVisualHeight(topMargin = 0): number {
        const thisChildrenHeight = this.children
            .map(v => v.visualHeight() + topMargin)
            .reduce((acc, next) => acc + next, 0);

        return this.children.reduce((acc, next) => acc + next.getChildrenVisualHeight(), thisChildrenHeight);
    }

    getAllChildrenIdPairs(): ElectricElementIdPair[] {
        const pairs: ElectricElementIdPair[] = this.children.map(v => ({ ...v }));
        pairs.push(...this.children.flatMap(v => v.getAllChildrenIdPairs()))
        return pairs;
    }

    getMessageSummary(): Record<MessageTypeVal, number> {
        return this.messages
            .sort((a, b) => MESSAGE_TYPE_VALUES.indexOf(a.key.type.value) - MESSAGE_TYPE_VALUES.indexOf(b.key.type.value))
            .reduce((acc, next) => {
                if (acc[next.key.type.value] === undefined)
                    acc[next.key.type.value] = 0;

                acc[next.key.type.value] += 1;

                return acc;
            }, {} as Record<MessageTypeVal, number>);
    }

    voltageDrop(): number {
        return this.wire.voltageDrop(this.getTotalPower()) ?? 0;
    }

    findElementById(childId: string | undefined): Optional<ElectricElement> {
        if (childId === undefined) return Optional.empty();
        if (childId === this.id) return Optional.of(this);

        for (const child of this.children) {
            if (child.id === childId) return Optional.of(child);

            const tmp = child.findElementById(childId);
            if (tmp.isPresent()) return tmp;
        }

        return Optional.empty();
    }

    wirePowerLoss(): number {
        return this.wire.powerLoss(this.getTotalCurrent()) ?? 0;
    }

    shortCurrent(): number {
        return 0.95 * 230 / (this.context.parentShortImpedance + this.context.ownShortImpedance);
    }

    protected powerForCurrent(current: number) {
        return current * (this.wire.phaseVoltageCoefficient() ?? 0);
    }

    private wrongWireRule() {
        if (this.wire) {
            const optional = CurrentTable.findMinDiameterForLoad(this.wire, this);
            const wireDiameterValid = optional
                .map(v => v <= (this.wire.diameter.value ?? 0))
                .orElse(false);

            const matchingDiameter = optional.map(v => v + 'mm\u00B2').orElse('???');
            const maxPower = CurrentTable.findLoadCapacityByWire(this.wire)
                .map(v => this.powerForCurrent(v).toFixed(2))
                .orElse('???');
            this.handleMessage(wireDiameterValid, MessageKey.WRONG_WIRE_DIAMETER, { matchingDiameter, maxPower });
        }
    }

    private tooBigWireRule() {
        if (this.wire) {
            const optional = CurrentTable.findSmallerWirePossible(this.wire, this);

            this.handleMessage(!optional.isPresent(), MessageKey.TOO_BIG_WIRE_DIAMETER,
                { matchingDiameter: optional.map(v => v + 'mm\u00B2').orElse('???') });
        }
    }

    private voltageDropRule() {
        const totalDrop = this.context.ownVoltageDrop + this.context.parentVoltageDrop;
        if (this.wire && totalDrop > 3) {
            const parentDrop = this.context.parentVoltageDrop;
            if (parentDrop >= 3) {
                this.putMessage(MessageKey.TOO_BIG_VOLTAGE_DROP_PREV, { parentVoltageDrop: parentDrop.toFixed(2) });
                this.removeMessage(MessageKey.TOO_BIG_VOLTAGE_DROP_THIS);
            } else {
                const totalPower = this.getTotalPower();
                const matchingDiameter = this.wire.diameterForDrop(totalPower, 3 - parentDrop)
                    .map(v => v.value + 'mm\u00B2')
                    .orElse('???');
                const maxLength = this.wire.lengthForDrop(totalPower, 3 - parentDrop).toFixed(2);
                this.putMessage(MessageKey.TOO_BIG_VOLTAGE_DROP_THIS, {
                    ownVoltageDrop: this.context.ownVoltageDrop.toFixed(2) + '',
                    matchingDiameter,
                    maxLength,
                });
                this.removeMessage(MessageKey.TOO_BIG_VOLTAGE_DROP_PREV);
            }
        } else {
            this.removeMessage(MessageKey.TOO_BIG_VOLTAGE_DROP_PREV);
            this.removeMessage(MessageKey.TOO_BIG_VOLTAGE_DROP_THIS);
        }
    }

    private selfTurnOffRule() {
        const closestOp = this.context.closestOp;
        if (this.wire && closestOp !== undefined && this.getTotalCurrent() > 0) {
            const opFireCurrent = closestOp.getFireCurrentByClass();
            const maxShortImpedance = 230 / opFireCurrent;
            const valid = this.context.ownShortImpedance + this.context.parentShortImpedance <= maxShortImpedance;

            const correctMaxOwnImpedance = maxShortImpedance - this.context.parentShortImpedance;
            const maxLength = this.wire.lengthForShortImpedance(correctMaxOwnImpedance);
            const minDiameter = this.wire.diameterForShortImpedance(correctMaxOwnImpedance).map(v => `${v.value}`).orElse('???');

            this.handleMessage(valid, MessageKey.SELF_TURN_OFF,
                {
                    maxLength: maxLength.toFixed(2),
                    minDiameter,
                    closestOpName: `${closestOp.label}, Zmax=${maxShortImpedance.toFixed(2)}[\u2126]`
                }
            );
        }
    }

    private descendingLoadCapacity() {
        if (this.wire) {
            const loadCapactity = CurrentTable.findLoadCapacityByWire(this.wire).orElse(-1);

            const childrenWithGreaterCapacity = this.children
                .filter(v => CurrentTable.findLoadCapacityByWire(v.wire)
                    .map(v => loadCapactity < v)
                    .orElse(false));

            if (childrenWithGreaterCapacity.length === 0) {
                this.removeMessage(MessageKey.DESCENDING_CAPACITY);
            } else {
                const minDiameter = WireDiameter.nextGteThan(childrenWithGreaterCapacity
                    .map(v => v.wire.diameter)
                    .sort((a, b) => b.value - a.value)[0])
                    .map(v => `${v.value}`)
                    .orElse('N/A');
                this.putMessage(MessageKey.DESCENDING_CAPACITY, { minDiameter })
            }
        }
    }

    handleMessage(valid: boolean,
        key: MessageKey,
        params: Record<string, string>) {
        if (!valid) {
            this.putMessage(key, params);
        } else {
            this.removeMessage(key);
        }
    }
}