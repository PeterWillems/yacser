import gql from 'graphql-tag';

export const ALL_DATASETS = gql`
  query allDatasets {
    allDatasets {
      datasetId
      filepath
    }
  }
`;


export const ALL_FUNCTIONS = gql`
       query allFunctions($datasetId: Int!) {
          allFunctions(datasetId: $datasetId) {
            datasetId
            uri
            label
            assembly {
              uri
              label
            }
            parts {
              uri
              label
            }
            requirements {
              uri
              label
            }
            input {
              uri
              label
            }
            output {
              uri
              label
            }
          }
        }
`;

export const CREATE_FUNCTION = gql`
  mutation createFunction($datasetId: Int!, $uri: String!, $label: String!) {
    createFunction (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_FUNCTION = gql`
      mutation updateFunction($functionInput: FunctionInput!) {
        updateFunction (functionInput: $functionInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          requirements {
            uri
            label
          }
          input {
            uri
            label
          }
          output {
            uri
            label
          }
        }
      }
`;

export const DELETE_FUNCTION = gql`
  mutation deleteFunction($datasetId: Int!, $uri: String!) {
    deleteFunction (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const ALL_HAMBURGERS = gql`
       query allHamburgers($datasetId: Int!) {
          allHamburgers(datasetId: $datasetId) {
            datasetId
            uri
            label
            assembly {
              uri
              label
            }
            parts {
              uri
              label
            }
            functionalUnit {
              uri
              label
              interfaces {
                uri
                label
              }
            }
            technicalSolution {
              uri
              label
              ports {
                uri
                label
              }
            }
            portRealisations {
              uri
              label
              assembly {
                uri
                label
              }
              parts {
                uri
                label
              }
              interface {
                uri
                label
              }
              port {
                uri
                label
              }
            }
          }
        }
`;

export const ONE_HAMBURGER = gql`
       query oneHamburger($datasetId: Int!, $uri: String!) {
          oneHamburger(datasetId: $datasetId, uri: $uri) {
            datasetId
            uri
            label
            assembly {
              uri
              label
              portRealisations {
                uri
                label
              }
            }
            parts {
              uri
              label
              portRealisations {
                uri
                label
              }
            }
            functionalUnit {
              uri
              label
              interfaces {
                uri
                label
              }
            }
            technicalSolution {
              uri
              label
              ports {
                uri
                label
              }
            }
            portRealisations {
              uri
              label
              assembly {
                uri
                label
              }
              parts {
                uri
                label
              }
              interface {
                uri
                label
              }
              port {
                uri
                label
              }
            }
          }
        }
`;

export const CREATE_HAMBURGER = gql`
  mutation createHamburger($datasetId: Int!, $uri: String!, $label: String!) {
    createHamburger (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_HAMBURGER = gql`
      mutation updateHamburger($hamburgerInput: HamburgerInput!) {
        updateHamburger (hamburgerInput: $hamburgerInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          functionalUnit {
            uri
            label
          }
          technicalSolution {
            uri
            label
          }
          portRealisations {
            uri
            label
          }
        }
      }
`;

export const DELETE_HAMBURGER = gql`
  mutation deleteHamburger($datasetId: Int!, $uri: String!) {
    deleteHamburger (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const ALL_NUMERIC_PROPERTIES = gql`
       query allNumericProperties($datasetId: Int!) {
          allNumericProperties(datasetId: $datasetId) {
            datasetId
            uri
            label
            datatypeValue
            type
            unit
          }
        }
`;

export const CREATE_NUMERIC_PROPERTY = gql`
  mutation createNumericProperty($datasetId: Int!, $uri: String!, $label: String!) {
    createNumericProperty (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_NUMERIC_PROPERTY = gql`
      mutation updateNumericProperty($numericPropertyInput: NumericPropertyInput!) {
        updateNumericProperty (numericPropertyInput: $numericPropertyInput) {
          datasetId
          uri
          label
          datatypeValue
          type
          unit
        }
      }
`;
export const DELETE_NUMERIC_PROPERTY = gql`
  mutation deleteNumericProperty($datasetId: Int!, $uri: String!) {
    deleteNumericProperty (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
      datatypeValue
      type
      unit
    }
  }
`;

export const ALL_PERFORMANCES = gql`
       query allPerformances($datasetId: Int!) {
          allPerformances(datasetId: $datasetId) {
            datasetId
            uri
            label
            assembly {
              uri
              label
            }
            parts {
              uri
              label
            }
            value {
              uri
              label
              datatypeValue
              type
              unit
            }
          }
        }
`;

export const CREATE_PERFORMANCE = gql`
  mutation createPerformance($datasetId: Int!, $uri: String!, $label: String!) {
    createPerformance (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_PERFORMANCE = gql`
      mutation updatePerformance($performanceInput: PerformanceInput!) {
        updatePerformance (performanceInput: $performanceInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          value {
            uri
            label
            datatypeValue
            type
            unit
          }
        }
      }
`;

export const DELETE_PERFORMANCE = gql`
  mutation deletePerformance($datasetId: Int!, $uri: String!) {
    deletePerformance (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const CREATE_PORT_REALISATION = gql`
  mutation createPortRealisation($datasetId: Int!, $uri: String!, $label: String!) {
    createPortRealisation (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_PORT_REALISATION = gql`
      mutation updatePortRealisation($portRealisationInput: PortRealisationInput!) {
        updatePortRealisation (portRealisationInput: $portRealisationInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          interface {
            uri
            label
          }
          port {
            uri
            label
          }
        }
      }
`;

export const DELETE_PORT_REALISATION = gql`
  mutation deletePortRealisation($datasetId: Int!, $uri: String!) {
    deletePortRealisation(datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const ALL_REALISATION_MODULES = gql`
   query allRealisationModules($datasetId: Int!) {
          allRealisationModules(datasetId: $datasetId) {
      datasetId
      uri
      label
      assembly {
        uri
        label
      }
      parts {
        uri
        label
      }
      performances {
        uri
        label
      }
      ports {
        uri
        label
        assembly {
          uri
          label
        }
        parts {
          uri
          label
        }
      }
      hamburgers {
        uri
        label
      }
    }
  }
`;

export const ONE_REALISATION_MODULE = gql`
       query oneRealisationModule($datasetId: Int!, $uri: String!) {
          oneRealisationModule(datasetId: $datasetId, uri: $uri) {
            datasetId
            uri
            label
            assembly {
              uri
              label
              ports {
                uri
                label
              }
            }
            parts {
              uri
              label
              ports {
                uri
                label
              }
            }
            ports {
              uri
              label
              assembly {
                uri
                label
              }
              parts {
                uri
                label
              }
              performances {
                uri
                label
              }
            }
          }
        }
`;

export const CREATE_REALISATION_MODULE = gql`
  mutation createRealisationModule($datasetId: Int!, $uri: String!, $label: String!) {
    createRealisationModule (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_REALISATION_MODULE = gql`
  mutation updateRealisationModule($realisationModuleInput: RealisationModuleInput!) {
     updateRealisationModule (realisationModuleInput: $realisationModuleInput) {
        datasetId
        uri
        label
        assembly {
          uri
          label
        }
        parts {
          uri
          label
        }
        performances {
          uri
          label
        }
     }
  }
`;

export const DELETE_REALISATION_MODULE = gql`
  mutation deleteRealisationModule($datasetId: Int!, $uri: String!) {
    deleteRealisationModule (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const CREATE_REALISATION_PORT = gql`
  mutation createRealisationPort($datasetId: Int!, $uri: String!, $label: String!) {
    createRealisationPort (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_REALISATION_PORT = gql`
      mutation updateRealisationPort($realisationPortInput: RealisationPortInput!) {
        updateRealisationPort (realisationPortInput: $realisationPortInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          performances {
            uri
            label
          }
        }
      }
`;

export const DELETE_REALISATION_PORT = gql`
  mutation deleteRealisationPort($datasetId: Int!, $uri: String!) {
    deleteRealisationPort(datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const ALL_REQUIREMENTS = gql`
       query allRequirements($datasetId: Int!) {
          allRequirements(datasetId: $datasetId) {
            datasetId
            uri
            label
            assembly {
              uri
              label
            }
            parts {
              uri
              label
            }
            minValue {
              uri
              label
              datatypeValue
              type
              unit
            }
            maxValue {
              uri
              label
              datatypeValue
              type
              unit
            }
          }
        }
`;

export const CREATE_REQUIREMENT = gql`
  mutation createRequirement($datasetId: Int!, $uri: String!, $label: String!) {
    createRequirement (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_REQUIREMENT = gql`
      mutation updateRequirement($requirementInput: RequirementInput!) {
        updateRequirement (requirementInput: $requirementInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          minValue {
            uri
            label
            datatypeValue
            type
            unit
          }
          maxValue {
            uri
            label
            datatypeValue
            type
            unit
          }
        }
      }
`;

export const DELETE_REQUIREMENT = gql`
  mutation deleteRequirement($datasetId: Int!, $uri: String!) {
    deleteRequirement (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const ALL_SYSTEM_INTERFACES = gql`
       query allSystemInterfaces($datasetId: Int!) {
          allSystemInterfaces(datasetId: $datasetId) {
            datasetId
            uri
            label
            assembly {
              uri
              label
            }
            parts {
              uri
              label
            }
            systemSlot0 {
              uri
              label
            }
            systemSlot1 {
              uri
              label
            }
            requirements {
              uri
              label
            }
          }
        }
`;

export const CREATE_SYSTEM_INTERFACE = gql`
  mutation createSystemInterface($datasetId: Int!, $uri: String!, $label: String!) {
    createSystemInterface (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_SYSTEM_INTERFACE = gql`
      mutation updateSystemInterface($systemInterfaceInput: SystemInterfaceInput!) {
        updateSystemInterface (systemInterfaceInput: $systemInterfaceInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          systemSlot0 {
            uri
            label
          }
          systemSlot1 {
            uri
            label
          }
          requirements {
            uri
            label
          }
        }
     }
`;

export const DELETE_SYSTEM_INTERFACE = gql`
  mutation deleteSystemInterface($datasetId: Int!, $uri: String!) {
    deleteSystemInterface (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;

export const ALL_SYSTEM_SLOTS = gql`
       query allSystemSlots($datasetId: Int!) {
          allSystemSlots(datasetId: $datasetId) {
            datasetId
            uri
            label
            assembly {
              uri
              label
            }
            parts {
              uri
              label
            }
            functions {
              uri
              label
            }
            requirements {
              uri
              label
            }
            interfaces {
              uri
              label
            }
            hamburgers {
              uri
              label
            }
          }
        }
`;

export const ONE_SYSTEM_SLOT = gql`
       query oneSystemSlot($datasetId: Int!, $uri: ID) {
          oneSystemSlot(datasetId: $datasetId, uri: $uri) {
            datasetId
            uri
            label
            assembly {
              uri
            }
            parts {
              uri
            }
            functions {
              uri
            }
            requirements {
              uri
            }
            interfaces {
              uri
            }
          }
        }
`;

export const CREATE_SYSTEM_SLOT = gql`
  mutation createSystemSlot($datasetId: Int!, $uri: String!, $label: String!) {
    createSystemSlot (datasetId: $datasetId, uri: $uri, label: $label) {
      datasetId
      uri
      label
    }
  }
`;

export const UPDATE_SYSTEM_SLOT = gql`
      mutation updateSystemSlot($systemSlotInput: SystemSlotInput!) {
        updateSystemSlot (systemSlotInput: $systemSlotInput) {
          datasetId
          uri
          label
          assembly {
            uri
            label
          }
          parts {
            uri
            label
          }
          functions {
            uri
            label
          }
          requirements {
            uri
            label
          }
          interfaces {
            uri
            label
          }
        }
      }
`;

export const DELETE_SYSTEM_SLOT = gql`
  mutation deleteSystemSlot($datasetId: Int!, $uri: String!) {
    deleteSystemSlot (datasetId: $datasetId, uri: $uri) {
      datasetId
      uri
      label
    }
  }
`;
