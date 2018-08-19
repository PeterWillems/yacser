import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
  CoinsObjectInput,
  FunctionInput,
  Mutation, Performance, PortRealisation,
  PortRealisationInput,
  Query,
  RealisationModule,
  RealisationModuleInput,
  RealisationPort,
  RealisationPortInput
} from './types';
import {
  ALL_HAMBURGERS,
  ALL_REALISATION_MODULES, CREATE_PORT_REALISATION,
  CREATE_REALISATION_MODULE, CREATE_REALISATION_PORT, DELETE_PORT_REALISATION,
  DELETE_REALISATION_MODULE, DELETE_REALISATION_PORT,
  ONE_HAMBURGER, ONE_REALISATION_MODULE, UPDATE_PORT_REALISATION,
  UPDATE_REALISATION_MODULE, UPDATE_REALISATION_PORT
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class RealisationModuleService {
  public selectedRealisationModule: RealisationModule;
  public allRealisationModulesUpdated = new EventEmitter<Array<RealisationModule>>();
  public realisationModuleCreated = new EventEmitter<RealisationModule>();
  public realisationModuleMutated = new EventEmitter<RealisationModule>();
  public realisationModuleDeleted = new EventEmitter<RealisationModule>();
  public oneRealisationModuleUpdated = new EventEmitter<RealisationModule>();
  public realisationPortCreated = new EventEmitter<RealisationPort>();
  public realisationPortMutated = new EventEmitter<RealisationPort>();
  public realisationPortDeleted = new EventEmitter<RealisationPort>();

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
      .valueChanges.subscribe(value => {
        const realisationModules = <RealisationModule[]>[];
        for (let i = 0; i < value.data.allRealisationModules.length; i++) {
          realisationModules.push(value.data.allRealisationModules[i]);
        }
        this.allRealisationModulesUpdated.emit(realisationModules);
      }
    );
  }

  public queryOneRealisationModule(datasetId: number, uri: string) {
    console.log('queryOneRealisationModule');
    this.apollo.watchQuery<Query>({
      query: ONE_REALISATION_MODULE,
      variables: {
        datasetId: datasetId,
        uri: uri
      }
    }).valueChanges.subscribe(value => this.oneRealisationModuleUpdated.emit(value.data.oneRealisationModule)
    );
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

  public mutateRealisationModule(realisationModuleInput: RealisationModuleInput, coinsObject: CoinsObjectInput) {
    console.log('mutateRealisationModule: ' + 'label=' + realisationModuleInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_REALISATION_MODULE,
      variables: {
        realisationModuleInput: {
          datasetId: realisationModuleInput.datasetId,
          uri: realisationModuleInput.uri,
          label: realisationModuleInput.label,
          assembly: realisationModuleInput.assembly,
          parts: realisationModuleInput.parts,
          performances: realisationModuleInput.performances,
          ports: realisationModuleInput.ports
        },
        coinsObjectInput: {
          name: coinsObject.name,
          userID: coinsObject.userID,
          description: coinsObject.description,
          creationDate: coinsObject.creationDate
        }
      },
      refetchQueries: [{
        query: ALL_REALISATION_MODULES, variables: {
          datasetId: realisationModuleInput.datasetId
        }
      }]
    }).subscribe((value) => this.realisationModuleMutated.emit(value.data.mutateRealisationModule));
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
    console.log('cloneRealisationModuleInput datasetId=' + selectedRealisationModule.datasetId + ' label=' + selectedRealisationModule.label);
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
    realisationModuleInput.ports = [];
    if (selectedRealisationModule.ports) {
      for (let index = 0; index < selectedRealisationModule.ports.length; index++) {
        realisationModuleInput.ports.push(selectedRealisationModule.ports[index].uri);
      }
    }
    return realisationModuleInput;
  }

  public createRealisationPort(realisationPortInput: RealisationPortInput) {
    console.log('createRealisationPort');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_REALISATION_PORT,
      variables: {
        datasetId: realisationPortInput.datasetId,
        uri: realisationPortInput.uri,
        label: realisationPortInput.label
      }
    }).subscribe((value) => this.realisationPortCreated.emit(value.data.createRealisationPort));
  }

  public mutateRealisationPort(realisationPortInput: RealisationPortInput) {
    console.log('mutateRealisationPort: '
      + 'datasetId=' + realisationPortInput.datasetId
      + ' uri=' + realisationPortInput.uri
      + ' label=' + realisationPortInput.label
      + ' assembly=' + realisationPortInput.assembly
      + ' parts=' + realisationPortInput.parts);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_REALISATION_PORT,
      variables: {
        realisationPortInput: {
          datasetId: realisationPortInput.datasetId,
          uri: realisationPortInput.uri,
          label: realisationPortInput.label,
          assembly: realisationPortInput.assembly,
          parts: realisationPortInput.parts,
          performances: realisationPortInput.performances
        }
      },
      refetchQueries: [{
        query: ALL_REALISATION_MODULES, variables: {
          datasetId: realisationPortInput.datasetId
        }
      }]
    }).subscribe((value) => this.realisationPortMutated.emit(value.data.mutateRealisationPort));
  }

  public deleteRealisationPort(datasetId: number, uri: string) {
    console.log('deleteRealisationPort');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_REALISATION_PORT,
      variables: {
        datasetId: datasetId,
        uri: uri
      }
    }).subscribe((value) => this.realisationPortDeleted.emit(value.data.deleteRealisationPort));
  }

  public cloneRealisationPortInput(selectedRealisationPort: RealisationPort): RealisationPortInput {
    const realisationPortInput =
      new RealisationPortInput(selectedRealisationPort.datasetId, selectedRealisationPort.uri, selectedRealisationPort.label,
        selectedRealisationPort.assembly ? selectedRealisationPort.assembly.uri : null);

    if (selectedRealisationPort.assembly) {
      realisationPortInput.assembly = selectedRealisationPort.assembly.uri;
    }
    realisationPortInput.parts = [];
    if (selectedRealisationPort.parts) {
      for (let index = 0; index < selectedRealisationPort.parts.length; index++) {
        realisationPortInput.parts.push(selectedRealisationPort.parts[index].uri);
      }
    }
    realisationPortInput.performances = [];
    if (selectedRealisationPort.performances) {
      for (let index = 0; index < selectedRealisationPort.performances.length; index++) {
        realisationPortInput.performances.push(selectedRealisationPort.performances[index].uri);
      }
    }

    return realisationPortInput;
  }

}
