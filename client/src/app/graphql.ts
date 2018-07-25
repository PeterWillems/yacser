import gql from 'graphql-tag';

export const ALL_DATASETS = gql`
  query allDatasets {
    allDatasets {
      datasetId
      filepath
    }
  }
`;

export const ALL_SYSTEM_SLOTS = gql`
       query allSystemSlots($datasetId: Int) {
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
          }
        }
`;

export const ONE_SYSTEM_SLOT = gql`
       query oneSystemSlot($datasetId: Int, $uri: ID) {
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

export const UPDATE_SYSTEM_SLOT = gql`
      mutation updateSystemSlot($systemSlotInput: SystemSlotInput!) {
        updateSystemSlot (systemSlot: $systemSlotInput) {
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

export const ALL_FUNCTIONS = gql`
       query allFunctions($datasetId: Int) {
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

export const ALL_REQUIREMENTS = gql`
       query allRequirements($datasetId: Int) {
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
            }
            maxValue {
              uri
              label
            }
          }
        }
`;

export const ALL_SYSTEM_INTERFACES = gql`
       query allSystemInterfaces($datasetId: Int) {
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
            requirements {
              uri
              label
            }
          }
        }
`;
