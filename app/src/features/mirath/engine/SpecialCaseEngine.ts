import { EngineState } from './types';
import { AwlProcessor } from './processors/AwlProcessor';
import { RaddProcessor } from './processors/RaddProcessor';
import { MissingPersonProcessor } from './processors/MissingPersonProcessor';
import { PregnancyProcessor } from './processors/PregnancyProcessor';
import { KhunthaProcessor } from './processors/KhunthaProcessor';
import { UmariyyataynProcessor } from './processors/UmariyyataynProcessor';
import { MushtarakahProcessor } from './processors/MushtarakahProcessor';
import { AkdariyyahProcessor } from './processors/AkdariyyahProcessor';
import { MuqasamahProcessor } from './processors/MuqasamahProcessor';

export class SpecialCaseEngine {
  static process(state: EngineState): EngineState {
    // 1. Structural Exceptions (Run BEFORE Awl/Radd)
    let newState = UmariyyataynProcessor.process(state);
    newState = MushtarakahProcessor.process(newState);
    newState = AkdariyyahProcessor.process(newState);
    newState = MuqasamahProcessor.process(newState);
    newState = MissingPersonProcessor.process(newState);
    newState = PregnancyProcessor.process(newState);
    newState = KhunthaProcessor.process(newState);
    
    // Future exceptions can be injected here
    // newState = AkdariyyahProcessor.process(newState);

    // 2. Balancing Exceptions
    newState = AwlProcessor.process(newState);
    newState = RaddProcessor.process(newState);

    return newState;
  }
}
