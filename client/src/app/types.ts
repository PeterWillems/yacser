export interface Dataset {
  datasetId: number;
  filepath: string;
}

export interface SeObject {
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
}

export class HamburgerInput {
  parts: string[];
  functionalUnit: string;
  technicalSolution: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface NumericProperty {
  datasetId: number;
  uri: string;
  label: string;
  datatypeValue: number;
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

export interface RealisationModule extends SeObject {
  assembly: RealisationModule;
  parts: RealisationModule[];
  performances: Performance[];
}

export class RealisationModuleInput {
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
  requirements: Requirement[];
}

export interface SystemSlot extends SeObject {
  assembly: SystemSlot;
  parts: SystemSlot[];
  functions: Function[];
  requirements: Requirement[];
  interfaces: SystemInterface[];
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
  oneSystemSlot: SystemSlot;
}

export interface Mutation {
  createFunction: Function;
  createHamburger: Hamburger;
  createPerformance: Performance;
  createRealisationModule: RealisationModule;
  createRequirement: Requirement;
  createSystemSlot: SystemSlot;
  deleteFunction: Function;
  deleteHamburger: Hamburger;
  deletePerformance: Performance;
  deleteRealisationModule: RealisationModule;
  deleteRequirement: Requirement;
  deleteSystemSlot: SystemSlot;
  updateFunction: Function;
  updateHamburger: Hamburger;
  updatePerformance: Performance;
  updateRealisationModule: RealisationModule;
  updateRequirement: Requirement;
  updateSystemSlot: SystemSlot;
}

