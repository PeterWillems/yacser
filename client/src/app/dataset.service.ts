import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Dataset, Query} from './types';
import {ALL_DATASETS} from './graphql';

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
    return this.selectedDataset;
  }

  public setSelectedDataset(dataset: Dataset): void {
    console.log('DatasetService:setDataset: ' + dataset.datasetId);
    this.selectedDataset = dataset;
    this.datasetSelected.emit(this.selectedDataset);
  }
}
