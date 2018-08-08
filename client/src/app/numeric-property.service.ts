import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, NumericProperty, NumericPropertyInput, Performance, PerformanceInput, Query} from './types';
import {
  ALL_NUMERIC_PROPERTIES,
  ALL_PERFORMANCES, ALL_REQUIREMENTS,
  CREATE_NUMERIC_PROPERTY,
  DELETE_NUMERIC_PROPERTY, UPDATE_NUMERIC_PROPERTY
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class NumericPropertyService {
  public allNumericPropertiesUpdated = new EventEmitter<Array<NumericProperty>>();
  public numericPropertyCreated = new EventEmitter<NumericProperty>();
  public numericPropertyDeleted = new EventEmitter<NumericProperty>();

  constructor(private apollo: Apollo) {
  }

  public queryAllNumericProperties(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_NUMERIC_PROPERTIES,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => this.allNumericPropertiesUpdated.emit(value.data.allNumericProperties))
    );
  }

  public createNumericProperty(datasetId: number, uri: string, label: string) {
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_NUMERIC_PROPERTY,
      variables: {
        datasetId: datasetId,
        uri: uri,
        label: label
      },
      refetchQueries: [{
        query: ALL_NUMERIC_PROPERTIES, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.numericPropertyCreated.emit(value.data.createNumericProperty));
  }

  public mutateNumericProperty(numericPropertyInput: NumericPropertyInput) {
    console.log('mutateNumericProperty: ' + 'label=' + numericPropertyInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_NUMERIC_PROPERTY,
      variables: {
        numericPropertyInput: {
          datasetId: numericPropertyInput.datasetId,
          uri: numericPropertyInput.uri,
          label: numericPropertyInput.label,
          datatypeValue: numericPropertyInput.datatypeValue
        }
      },
      refetchQueries: [{
        query: ALL_NUMERIC_PROPERTIES, variables: {
          datasetId: numericPropertyInput.datasetId
        }
      }, {
        query: ALL_PERFORMANCES, variables: {
          datasetId: numericPropertyInput.datasetId
        }
      }, {
        query: ALL_REQUIREMENTS, variables: {
          datasetId: numericPropertyInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteNumericProperty(datasetId: number, uri: string) {
    console.log('deleteNumericProperty');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_NUMERIC_PROPERTY,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_NUMERIC_PROPERTIES, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.numericPropertyDeleted.emit(value.data.deleteNumericProperty));
  }

  public cloneNumericPropertyInput(selectedNumericProperty: NumericProperty): NumericPropertyInput {
    const numericPropertyInput =
      new NumericPropertyInput(selectedNumericProperty.datasetId, selectedNumericProperty.uri, selectedNumericProperty.label);

    if (selectedNumericProperty.datatypeValue) {
      numericPropertyInput.datatypeValue = selectedNumericProperty.datatypeValue;
    }
    return numericPropertyInput;
  }
}
