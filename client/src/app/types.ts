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

export interface NumericProperty {
  datasetId: number;
  uri: string;
  label: string;
}

export interface Requirement extends SeObject {
  assembly: Requirement;
  parts: Requirement[];
  minValue: NumericProperty;
  maxValue: NumericProperty;
}

export interface SystemInterface extends SeObject {
  assembly: SystemInterface;
  parts: SystemInterface[];
  requirements: Requirement;
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

export class FunctionInput {
  parts: string[];
  requirements: string[];
  input: string;
  output: string;

  constructor(public datasetId: number, public uri: string, public label: string, public assembly: string) {
  }
}

export interface Query {
  allDatasets: Dataset[];
  allSystemSlots: SystemSlot[];
  oneSystemSlot: SystemSlot;
  allFunctions: Function[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];
}

export interface SystemSlotInput {
  datasetId: number;
  uri: string;
  label: string;
}

export interface Mutation {
  updateSystemSlot: SystemSlot;
  updateFunction: Function;
}

