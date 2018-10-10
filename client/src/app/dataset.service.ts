import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CoinsObjectInput, Dataset, DatasetInput, Function, FunctionInput, Mutation, Query} from './types';
import {ALL_DATASETS, ALL_FUNCTIONS, SAVE_DATASET, UPDATE_DATASET, UPDATE_FUNCTION} from './graphql';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  datasetsUpdated = new EventEmitter<Dataset[]>();
  selectedDataset: Dataset;
  datasetSelected = new EventEmitter<Dataset>();

  constructor(private _apollo: Apollo) {
  }

  public queryAllDatasets() {
    this._apollo.watchQuery<Query>({query: ALL_DATASETS}).valueChanges
      .subscribe((response) => this.datasetsUpdated.emit(response.data.allDatasets));

  }

  public getSelectedDataset(): Dataset {
    console.log('Dataset uri: ' + (this.selectedDataset ? this.selectedDataset.uri : null));
    return this.selectedDataset;
  }

  public setSelectedDataset(dataset: Dataset): void {
    this.selectedDataset = dataset;
    this.datasetSelected.emit(this.selectedDataset);
  }

  public mutateDataset(datasetInput: DatasetInput) {
    console.log('mutateDataset: ' + 'versionInfo=' + datasetInput.versionInfo);
    this._apollo.mutate<Mutation>({
      mutation: UPDATE_DATASET, variables: {
        datasetInput: {
          datasetId: datasetInput.datasetId,
          uri: datasetInput.uri,
          versionInfo: datasetInput.versionInfo
        }
      },
      refetchQueries: [{
        query: ALL_DATASETS, variables: {
          datasetId: datasetInput.datasetId
        }
      }]
    }).subscribe();
  }

  public saveDataset(datasetId: number) {
    console.log('saveDataset: ' + 'datasetId=' + datasetId);
    this._apollo.mutate<Mutation>({
      mutation: SAVE_DATASET, variables: {
          datasetId: datasetId
      }
    }).subscribe();
  }

  public cloneDatasetInput(selectedDataset: Dataset): DatasetInput {
    const functionInput = new DatasetInput(selectedDataset.datasetId, selectedDataset.uri, selectedDataset.versionInfo);

    return functionInput;
  }
}
