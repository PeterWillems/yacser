import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, Query, RealisationModule, RealisationModuleInput} from './types';
import {ALL_REALISATION_MODULES, CREATE_REALISATION_MODULE, DELETE_REALISATION_MODULE, UPDATE_REALISATION_MODULE} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class RealisationModuleService {
  public selectedRealisationModule: RealisationModule;
  public allRealisationModulesUpdated = new EventEmitter<Array<RealisationModule>>();
  public realisationModuleCreated = new EventEmitter<RealisationModule>();
  public realisationModuleDeleted = new EventEmitter<RealisationModule>();

  constructor(private apollo: Apollo) {
  }

  public queryAllRealisationModules(datasetId: number) {
    console.log('queryAllRealisationModules ' + datasetId);
    this.apollo.watchQuery<Query>({
      query: ALL_REALISATION_MODULES,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value) => this.allRealisationModulesUpdated.emit(value.data.allRealisationModules));
  }

  public createRealisationModule(realisationModuleInput: RealisationModuleInput) {
    console.log('createRealisationModule');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_REALISATION_MODULE,
      variables: {
        datasetId: realisationModuleInput.datasetId,
        uri: realisationModuleInput.uri,
        label: realisationModuleInput.label
      },
      refetchQueries: [{
        query: ALL_REALISATION_MODULES, variables: {
          datasetId: realisationModuleInput.datasetId
        }
      }]
    }).subscribe((value) => this.realisationModuleCreated.emit(value.data.createRealisationModule));
  }

  public mutateRealisationModule(realisationModuleInput: RealisationModuleInput) {
    console.log('mutateRealisationModule: ' + 'label=' + realisationModuleInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_REALISATION_MODULE,
      variables: {
        requirementInput: {
          datasetId: realisationModuleInput.datasetId,
          uri: realisationModuleInput.uri,
          label: realisationModuleInput.label,
          assembly: realisationModuleInput.assembly,
          parts: realisationModuleInput.parts,
        }
      },
      refetchQueries: [{
        query: ALL_REALISATION_MODULES, variables: {
          datasetId: realisationModuleInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteRealisationModule(datasetId: number, uri: string) {
    console.log('deleteRealisationModule');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_REALISATION_MODULE,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_REALISATION_MODULES, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.realisationModuleDeleted.emit(value.data.deleteRealisationModule));
  }

  public cloneRealisationModuleInput(selectedRealisationModule: RealisationModule): RealisationModuleInput {
    const realisationModuleInput =
      new RealisationModuleInput(selectedRealisationModule.datasetId, selectedRealisationModule.uri, selectedRealisationModule.label,
        selectedRealisationModule.assembly ? selectedRealisationModule.assembly.uri : null);

    if (selectedRealisationModule.assembly) {
      realisationModuleInput.assembly = selectedRealisationModule.assembly.uri;
    }
    realisationModuleInput.parts = [];
    if (selectedRealisationModule.parts) {
      for (let index = 0; index < selectedRealisationModule.parts.length; index++) {
        realisationModuleInput.parts.push(selectedRealisationModule.parts[index].uri);
      }
    }
    realisationModuleInput.performances = [];
    if (selectedRealisationModule.performances) {
      for (let index = 0; index < selectedRealisationModule.performances.length; index++) {
        realisationModuleInput.performances.push(selectedRealisationModule.performances[index].uri);
      }
    }
    return realisationModuleInput;
  }

}
