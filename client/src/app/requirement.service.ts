import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CoinsObjectInput, Mutation, Query, Requirement, RequirementInput} from './types';
import {
  ALL_REQUIREMENTS,
  CREATE_REQUIREMENT,
  DELETE_REQUIREMENT,
  UPDATE_REQUIREMENT
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  public selectedRequirement: Requirement;
  public allRequirementsUpdated = new EventEmitter<Array<Requirement>>();
  public requirementCreated = new EventEmitter<Requirement>();
  public requirementDeleted = new EventEmitter<Requirement>();

  constructor(private apollo: Apollo) {
  }

  public queryAllRequirements(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_REQUIREMENTS,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => {
        const requirements = <Requirement[]>[];
        for (let i = 0; i < value.data.allRequirements.length; i++) {
          requirements.push(value.data.allRequirements[i]);
        }
        this.allRequirementsUpdated.emit(requirements);
      })
    );
  }

  public createRequirement(requirementInput: RequirementInput) {
    console.log('createRequirement');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_REQUIREMENT,
      variables: {
        datasetId: requirementInput.datasetId,
        uri: requirementInput.uri,
        label: requirementInput.label
      },
      refetchQueries: [{
        query: ALL_REQUIREMENTS, variables: {
          datasetId: requirementInput.datasetId
        }
      }]
    }).subscribe((value) => this.requirementCreated.emit(value.data.createRequirement));
  }

  public mutateRequirement(requirementInput: RequirementInput, coinsObject: CoinsObjectInput) {
    console.log('mutateRequirement: ' + 'label=' + requirementInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_REQUIREMENT,
      variables: {
        requirementInput: {
          datasetId: requirementInput.datasetId,
          uri: requirementInput.uri,
          label: requirementInput.label,
          assembly: requirementInput.assembly,
          parts: requirementInput.parts,
          minValue: requirementInput.minValue,
          maxValue: requirementInput.maxValue
        },
        coinsObjectInput: {
          name: coinsObject.name,
          userID: coinsObject.userID,
          description: coinsObject.description,
          creationDate: coinsObject.creationDate
        }
      },
      refetchQueries: [{
        query: ALL_REQUIREMENTS, variables: {
          datasetId: requirementInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteRequirement(datasetId: number, uri: string) {
    console.log('deleteRequirement');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_REQUIREMENT,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_REQUIREMENTS, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.requirementDeleted.emit(value.data.deleteRequirement));
  }

  public cloneRequirementInput(selectedRequirement: Requirement): RequirementInput {
    const requirementInput = new RequirementInput(selectedRequirement.datasetId, selectedRequirement.uri, selectedRequirement.label,
      selectedRequirement.assembly ? selectedRequirement.assembly.uri : null);

    if (selectedRequirement.assembly) {
      requirementInput.assembly = selectedRequirement.assembly.uri;
    }
    requirementInput.parts = [];
    if (selectedRequirement.parts) {
      for (let index = 0; index < selectedRequirement.parts.length; index++) {
        requirementInput.parts.push(selectedRequirement.parts[index].uri);
      }
    }
    if (selectedRequirement.minValue) {
      requirementInput.minValue = selectedRequirement.minValue.uri;
    }
    if (selectedRequirement.maxValue) {
      requirementInput.maxValue = selectedRequirement.maxValue.uri;
    }
    return requirementInput;
  }

}
