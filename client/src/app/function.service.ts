import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Query, Function, FunctionInput, Mutation, Requirement, RequirementInput, CoinsObjectInput} from './types';
import {ALL_FUNCTIONS, CREATE_FUNCTION, DELETE_FUNCTION, UPDATE_FUNCTION} from './graphql';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  public allFunctionsUpdated = new EventEmitter<Array<Function>>();
  public functionCreated = new EventEmitter<Function>();
  public functionDeleted = new EventEmitter<Function>();
  public selectedFunction: Function;

  constructor(private apollo: Apollo) {
  }

  public queryAllFunctions(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_FUNCTIONS,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => this.allFunctionsUpdated.emit(value.data.allFunctions))
    );
  }

  public createFunction(functionInput: FunctionInput) {
    console.log('createFunction');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_FUNCTION,
      variables: {
        datasetId: functionInput.datasetId,
        uri: functionInput.uri,
        label: functionInput.label
      },
      refetchQueries: [{
        query: ALL_FUNCTIONS, variables: {
          datasetId: functionInput.datasetId
        }
      }]
    }).subscribe((value) => this.functionCreated.emit(value.data.createFunction));
  }

  public mutateFunction(functionInput: FunctionInput, coinsObject: CoinsObjectInput) {
    console.log('mutateFunction: ' + 'label=' + functionInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_FUNCTION, variables: {
        functionInput: {
          datasetId: functionInput.datasetId,
          uri: functionInput.uri,
          label: functionInput.label,
          assembly: functionInput.assembly,
          parts: functionInput.parts,
          requirements: functionInput.requirements,
          input: functionInput.input,
          output: functionInput.output
        },
        coinsObjectInput: {
          name: coinsObject.name,
          userID: coinsObject.userID,
          description: coinsObject.description,
          creationDate: coinsObject.creationDate
        }
      },
      refetchQueries: [{
        query: ALL_FUNCTIONS, variables: {
          datasetId: functionInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteFunction(datasetId: number, uri: string) {
    console.log('deleteFunction');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_FUNCTION,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_FUNCTIONS, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.functionDeleted.emit(value.data.deleteFunction));
  }

  public cloneFunctionInput(selectedFunction: Function): FunctionInput {
    const functionInput = new FunctionInput(selectedFunction.datasetId, selectedFunction.uri, selectedFunction.label,
      selectedFunction.assembly ? selectedFunction.assembly.uri : null);

    if (selectedFunction.assembly) {
      functionInput.assembly = selectedFunction.assembly.uri;
    }
    if (selectedFunction.parts) {
      functionInput.parts = [];
      for (let index = 0; index < selectedFunction.parts.length; index++) {
        functionInput.parts.push(selectedFunction.parts[index].uri);
      }
    }
    if (selectedFunction.requirements) {
      functionInput.requirements = [];
      for (let index = 0; index < selectedFunction.requirements.length; index++) {
        functionInput.requirements.push(selectedFunction.requirements[index].uri);
      }
    }
    if (selectedFunction.input) {
      functionInput.input = selectedFunction.input.uri;
    }
    if (selectedFunction.output) {
      functionInput.output = selectedFunction.output.uri;
    }
    return functionInput;
  }

}
