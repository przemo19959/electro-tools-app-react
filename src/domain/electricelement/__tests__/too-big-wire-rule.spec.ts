import { PhaseType } from "../../currenttable/enums/PhaseType";
import { WireDiameter } from "../../currenttable/enums/WireDiameter";
import { MessageKey } from "../../elementmessage/element-message";
import { Wire } from "../../wire/wire";
import { LoadElement } from "../concrete/load/load-element";

describe('TooBigWireRule', () => {
    it(`should not add ${MessageKey.TOO_BIG_WIRE_DIAMETER.id} when wire is ok`, () => {
      const wire = new Wire(WireDiameter.D_40, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, 5);
      const load = LoadElement.empty();
      load.wire = wire;
      load.drawPower = 15870;
  
      load.check();
  
      expect(load.messages.length).toEqual(1);
      expect(load.messages[0].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
    });
  
    it(`should add ${MessageKey.TOO_BIG_WIRE_DIAMETER.id} when wire is not ok`, () => {
      const wire = new Wire(WireDiameter.D_100, 'IN_PIPE_ON_WALL', 'ONE_WIRE', PhaseType.THREE, 5);
      const load = LoadElement.empty();
      load.wire = wire;
      load.drawPower = 15870;
  
      load.check();
      
      expect(load.messages.length).toEqual(2);
      expect(load.messages[0].id).toEqual(MessageKey.TOO_BIG_WIRE_DIAMETER.id);
      expect(load.messages[0].params).toEqual({matchingDiameter: '4mm\u00B2'});
      expect(load.messages[1].id).toEqual(MessageKey.NO_ZEROING_TNC.id);
    });
  });