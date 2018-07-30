import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, Query, Performance, PerformanceInput} from './types';
import {
  ALL_PERFORMANCES,
  CREATE_PERFORMANCE,
  DELETE_PERFORMANCE,
  UPDATE_PERFORMANCE
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  public selectedPerformance: Performance;
  public allPerformancesUpdated = new EventEmitter<Array<Performance>>();
  public performanceCreated = new EventEmitter<Performance>();
  public performanceDeleted = new EventEmitter<Performance>();

  constructor(private apollo: Apollo) {
  }

  public queryAllPerformances(datasetId: number) {
    console.log('queryAllPerformances');
    this.apollo.watchQuery<Query>({
      query: ALL_PERFORMANCES,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value) => this.allPerformancesUpdated.emit(value.data.allPerformances));
  }

  public createPerformance(performanceInput: PerformanceInput) {
    console.log('createPerformance');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_PERFORMANCE,
      variables: {
        datasetId: performanceInput.datasetId,
        uri: performanceInput.uri,
        label: performanceInput.label
      },
      refetchQueries: [{
        query: ALL_PERFORMANCES, variables: {
          datasetId: performanceInput.datasetId
        }
      }]
    }).subscribe((value) => this.performanceCreated.emit(value.data.createPerformance));
  }

  public mutatePerformance(performanceInput: PerformanceInput) {
    console.log('mutatePerformance: ' + 'label=' + performanceInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_PERFORMANCE,
      variables: {
        performanceInput: {
          datasetId: performanceInput.datasetId,
          uri: performanceInput.uri,
          label: performanceInput.label,
          assembly: performanceInput.assembly,
          parts: performanceInput.parts,
          value: performanceInput.value
        }
      },
      refetchQueries: [{
        query: ALL_PERFORMANCES, variables: {
          datasetId: performanceInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deletePerformance(datasetId: number, uri: string) {
    console.log('deletePerformance');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_PERFORMANCE,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_PERFORMANCES, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.performanceDeleted.emit(value.data.deletePerformance));
  }

  public clonePerformanceInput(selectedPerformance: Performance): PerformanceInput {
    const performanceInput = new PerformanceInput(selectedPerformance.datasetId, selectedPerformance.uri, selectedPerformance.label,
      selectedPerformance.assembly ? selectedPerformance.assembly.uri : null);

    if (selectedPerformance.assembly) {
      performanceInput.assembly = selectedPerformance.assembly.uri;
    }
    performanceInput.parts = [];
    if (selectedPerformance.parts) {
      for (let index = 0; index < selectedPerformance.parts.length; index++) {
        performanceInput.parts.push(selectedPerformance.parts[index].uri);
      }
    }
    if (selectedPerformance.value) {
      performanceInput.value = selectedPerformance.value.uri;
    }
    return performanceInput;
  }

}
