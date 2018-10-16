export class CoinsObject {
  name: string;
  userID: string;
  description: string;
  creationDate: string;
}

export class CoinsObjectInput {
  constructor(public name: string, public userID: string, public description: string, public creationDate: string) {
  }
}

export interface Dataset {
  datasetId: number;
  label: string;
  filepath: string;
  uri: string;
  ontologyUri: string;
  imports: string[];
  versionInfo: string;
}

export class DatasetInput {

  constructor(public datasetId: number, public label: string, public uri: string, public versionInfo: string) {
  }

}

export interface SeObject {
  coins: CoinsObject;
  label: string;
  datasetId: number;
  uri: string;
}

export interface Function extends SeObject {
  assembly: Function;
  parts: Function[];
  requirements: Requirement[];
  input: SystemInterface;
  output: SystemInterface;
}

export class FunctionInput {
  parts: string[];
  requirements: string[];
  input: string;
  output: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface Hamburger extends SeObject {
  assembly: Hamburger;
  parts: Hamburger[];
  functionalUnit: SystemSlot;
  technicalSolution: RealisationModule;
  portRealisations: PortRealisation[];
  startDate: string;
  endDate: string;
}

export class HamburgerInput {
  parts: string[];
  functionalUnit: string;
  technicalSolution: string;
  portRealisations: string[];
  startDate: string;
  endDate: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface NumericProperty {
  datasetId: number;
  uri: string;
  label: string;
  datatypeValue: number;
  type: string;
  unit: string;
}

export class NumericPropertyInput {
  datatypeValue: number;

  constructor(public datasetId: number, public uri: string, public label: string) {
  }
}

export interface Performance extends SeObject {
  assembly: Performance;
  parts: Performance[];
  value: NumericProperty;
}

export class PerformanceInput {
  parts: string[];
  value: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface PortRealisation extends SeObject {
  assembly: PortRealisation;
  parts: PortRealisation[];
  interface: SystemInterface;
  port: RealisationPort;
}

export class PortRealisationInput {
  parts: string[];
  interface: string;
  port: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface RealisationModule extends SeObject {
  assembly: RealisationModule;
  parts: RealisationModule[];
  performances: Performance[];
  ports: RealisationPort[];
  hamburgers: Hamburger[];
}

export class RealisationModuleInput {
  parts: string[];
  performances: string[];
  ports: string[];

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface RealisationPort extends SeObject {
  assembly: RealisationPort;
  parts: RealisationPort[];
  performances: Performance[];
}

export class RealisationPortInput {
  parts: string[];
  performances: string[];

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface Requirement extends SeObject {
  assembly: Requirement;
  parts: Requirement[];
  minValue: NumericProperty;
  maxValue: NumericProperty;
}

export class RequirementInput {
  parts: string[];
  minValue: string;
  maxValue: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface SystemInterface extends SeObject {
  assembly: SystemInterface;
  parts: SystemInterface[];
  systemSlot0: SystemSlot;
  systemSlot1: SystemSlot;
  requirements: Requirement[];
}

export class SystemInterfaceInput {
  parts: string[];
  systemSlot0: string;
  systemSlot1: string;
  requirements: string[];

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface SystemSlot extends SeObject {
  assembly: SystemSlot;
  parts: SystemSlot[];
  functions: Function[];
  requirements: Requirement[];
  interfaces: SystemInterface[];
  hamburgers: Hamburger[];
}

export class SystemSlotInput {
  parts: string[];
  functions: string[];
  requirements: string[];
  interfaces: string[];

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface Query {
  allDatasets: Dataset[];
  allFunctions: Function[];
  allHamburgers: Hamburger[];
  allNumericProperties: NumericProperty[];
  allPerformances: Performance[];
  allRealisationModules: RealisationModule[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];
  allSystemSlots: SystemSlot[];
  oneHamburger: Hamburger;
  oneRealisationModule: RealisationModule;
  oneSystemSlot: SystemSlot;
}

export interface Mutation {
  createFunction: Function;
  createHamburger: Hamburger;
  createPerformance: Performance;
  createPortRealisation: PortRealisation;
  createRealisationModule: RealisationModule;
  createRealisationPort: RealisationPort;
  createRequirement: Requirement;
  createSystemInterface: SystemInterface;
  createSystemSlot: SystemSlot;
  deleteFunction: Function;
  deleteHamburger: Hamburger;
  deletePerformance: Performance;
  deletePortRealisation: PortRealisation;
  deleteRealisationModule: RealisationModule;
  deleteRequirement: Requirement;
  deleteSystemInterface: SystemInterface;
  deleteSystemSlot: SystemSlot;
  updateFunction: Function;
  updateHamburger: Hamburger;
  updatePerformance: Performance;
  updatePortRealisation: PortRealisation;
  updateRealisationModule: RealisationModule;
  updateRequirement: Requirement;
  updateSystemInterface: SystemInterface;
  updateSystemSlot: SystemSlot;
}

