import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {CoinsObjectInput, Mutation, Query, Requirement, RequirementInput, SystemInterface, SystemInterfaceInput} from './types';
import {
  ALL_FUNCTIONS,
  ALL_SYSTEM_INTERFACES, ALL_SYSTEM_SLOTS,
  CREATE_SYSTEM_INTERFACE, DELETE_SYSTEM_INTERFACE, UPDATE_SYSTEM_INTERFACE,
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class SystemInterfaceService {
  public selectedSystemInterface: SystemInterface;
  public allSystemInterfacesUpdated = new EventEmitter<Array<SystemInterface>>();
  public systemInterfaceCreated = new EventEmitter<SystemInterface>();
  public systemInterfaceDeleted = new EventEmitter<SystemInterface>();

  constructor(private apollo: Apollo) {
  }

  public queryAllSystemInterfaces(datasetId: number) {
    console.log('queryAllSystemInterfaces datasetId=' + datasetId);
    this.apollo.watchQuery<Query>({
      query: ALL_SYSTEM_INTERFACES,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => {
        const systemInterfaces = <SystemInterface[]>[];
        for (let i = 0; i < value.data.allSystemInterfaces.length; i++) {
          systemInterfaces.push(value.data.allSystemInterfaces[i]);
        }
        this.allSystemInterfacesUpdated.emit(systemInterfaces);
      })
    );
  }

  public createSystemInterface(systemInterfaceInput: SystemInterfaceInput) {
    console.log('createSystemInterface label="' + systemInterfaceInput.label + '"');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_SYSTEM_INTERFACE,
      variables: {
        datasetId: systemInterfaceInput.datasetId,
        uri: systemInterfaceInput.uri,
        label: systemInterfaceInput.label
      },
      refetchQueries: [{
        query: ALL_SYSTEM_INTERFACES, variables: {
          datasetId: systemInterfaceInput.datasetId
        }
      }]
    }).subscribe((value) => this.systemInterfaceCreated.emit(value.data.createSystemInterface));
  }

  public mutateSystemInterface(systemInterfaceInput: SystemInterfaceInput, coinsObject: CoinsObjectInput) {
    console.log('mutateSystemInterface: ' + 'label=' + systemInterfaceInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_SYSTEM_INTERFACE, variables: {
        systemInterfaceInput: {
          datasetId: systemInterfaceInput.datasetId,
          uri: systemInterfaceInput.uri,
          label: systemInterfaceInput.label,
          assembly: systemInterfaceInput.assembly,
          parts: systemInterfaceInput.parts,
          systemSlot0: systemInterfaceInput.systemSlot0,
          systemSlot1: systemInterfaceInput.systemSlot1,
          requirements: systemInterfaceInput.requirements
        },
        coinsObjectInput: {
          name: coinsObject.name,
          userID: coinsObject.userID,
          description: coinsObject.description,
          creationDate: coinsObject.creationDate
        }
      },
      refetchQueries: [{
        query: ALL_SYSTEM_INTERFACES, variables: {
          datasetId: systemInterfaceInput.datasetId
        }
      }, {
        query: ALL_SYSTEM_SLOTS, variables: {
          datasetId: systemInterfaceInput.datasetId
        }
      }, {
        query: ALL_FUNCTIONS, variables: {
          datasetId: systemInterfaceInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteSystemInterface(datasetId: number, uri: string) {
    console.log('deleteSystemInterface');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_SYSTEM_INTERFACE,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_SYSTEM_INTERFACES, variables: {
          datasetId: datasetId
        }
      }, {
        query: ALL_SYSTEM_SLOTS, variables: {
          datasetId: datasetId
        }
      }, {
        query: ALL_FUNCTIONS, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.systemInterfaceDeleted.emit(value.data.deleteSystemInterface));
  }

  public cloneSystemInterfaceInput(systemInterface: SystemInterface): SystemInterfaceInput {
    const systemInterfaceInput = new SystemInterfaceInput(systemInterface.datasetId, systemInterface.uri, systemInterface.label,
      systemInterface.assembly ? systemInterface.assembly.uri : null);

    if (systemInterface.assembly) {
      systemInterfaceInput.assembly = systemInterface.assembly.uri;
    }
    if (systemInterface.parts) {
      systemInterfaceInput.parts = [];
      for (let index = 0; index < systemInterface.parts.length; index++) {
        systemInterfaceInput.parts.push(systemInterface.parts[index].uri);
      }
    }
    if (systemInterface.systemSlot0) {
      systemInterfaceInput.systemSlot0 = systemInterface.systemSlot0.uri;
    }
    if (systemInterface.systemSlot1) {
      systemInterfaceInput.systemSlot1 = systemInterface.systemSlot1.uri;
    }
    if (systemInterface.requirements) {
      systemInterfaceInput.requirements = [];
      for (let index = 0; index < systemInterface.requirements.length; index++) {
        systemInterfaceInput.requirements.push(systemInterface.requirements[index].uri);
      }
    }
    return systemInterfaceInput;
  }

}
