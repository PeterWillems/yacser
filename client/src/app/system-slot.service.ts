import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, Query, SeObject, SystemSlot, SystemSlotInput} from './types';
import {ALL_SYSTEM_SLOTS, CREATE_SYSTEM_SLOT, DELETE_SYSTEM_SLOT, ONE_SYSTEM_SLOT, UPDATE_SYSTEM_SLOT} from './graphql';
// import {convertRuleOptions} from 'tslint/lib/configuration';

@Injectable({
  providedIn: 'root'
})
export class SystemSlotService {
  public selectedSystemSlot: SystemSlot;
  public allSystemSlotsUpdated = new EventEmitter<Array<SystemSlot>>();
  public systemSlotCreated = new EventEmitter<SystemSlot>();
  public systemSlotDeleted = new EventEmitter<SystemSlot>();
  public systemSlotUpdated = new EventEmitter<SystemSlot>();

  constructor(private apollo: Apollo) {
  }

  public queryAllSystemSlots(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_SYSTEM_SLOTS,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => this.allSystemSlotsUpdated.emit(value.data.allSystemSlots))
    );
  }

  public queryOneSystemSlot(datasetId: number, uri: string) {
    this.apollo.watchQuery<Query>({
      query: ONE_SYSTEM_SLOT,
      variables: {
        datasetId: datasetId,
        uri: uri
      }
    })
      .valueChanges.subscribe((value => this.systemSlotUpdated.emit(value.data.oneSystemSlot))
    );
  }

  public createSystemSlot(systemSlotInput: SystemSlotInput) {
    console.log('createSystemSlot');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_SYSTEM_SLOT,
      variables: {
        datasetId: systemSlotInput.datasetId,
        uri: systemSlotInput.uri,
        label: systemSlotInput.label
      },
      refetchQueries: [{
        query: ALL_SYSTEM_SLOTS, variables: {
          datasetId: systemSlotInput.datasetId
        }
      }]
    }).subscribe((value) => this.systemSlotCreated.emit(value.data.createSystemSlot));
  }

  public mutateSystemSlot(systemSlot: SystemSlotInput) {
    console.log('mutateSystemSlot: ' + 'label=' + systemSlot.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_SYSTEM_SLOT, variables: {
        systemSlotInput: {
          datasetId: systemSlot.datasetId,
          uri: systemSlot.uri,
          label: systemSlot.label,
          assembly: systemSlot.assembly,
          parts: systemSlot.parts,
          functions: systemSlot.functions,
          requirements: systemSlot.requirements,
          interfaces: systemSlot.interfaces
        }
      },
      // update: (proxy, {data: {updateSystemSlot}}) => {
      //   const data = proxy.readQuery<Query>({
      //     query: ALL_SYSTEM_SLOTS, variables: {
      //       datasetId: updateSystemSlot.datasetId
      //     }
      //   });
      //   for (let index = 0; index < data.allSystemSlots.length; index++) {
      //     if (data.allSystemSlots[index].uri === updateSystemSlot.uri) {
      //       data.allSystemSlots[index] = updateSystemSlot;
      //     } else if (data.allSystemSlots[index].assembly && data.allSystemSlots[index].assembly.uri === updateSystemSlot.uri) {
      //       data.allSystemSlots[index].assembly.uri = updateSystemSlot.uri;
      //       data.allSystemSlots[index].assembly.label = updateSystemSlot.label;
      //     }
      //   }
      //   proxy.writeQuery({
      //     query: ALL_SYSTEM_SLOTS, variables: {
      //       datasetId: updateSystemSlot.datasetId
      //     }, data: data
      //   });
      // },
      refetchQueries: [{
        query: ALL_SYSTEM_SLOTS, variables: {
          datasetId: systemSlot.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteSystemSlot(datasetId: number, uri: string) {
    console.log('deleteSystemSlot');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_SYSTEM_SLOT,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_SYSTEM_SLOTS, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.systemSlotDeleted.emit(value.data.deleteSystemSlot));
  }

  public cloneSystemSlotInput(systemSlot: SystemSlot): SystemSlotInput {
    const systemSlotInput = new SystemSlotInput(systemSlot.datasetId, systemSlot.uri, systemSlot.label,
      systemSlot.assembly ? systemSlot.assembly.uri : null);

    if (systemSlot.assembly) {
      systemSlotInput.assembly = systemSlot.assembly.uri;
    }
    if (systemSlot.parts) {
      systemSlotInput.parts = [];
      for (let index = 0; index < systemSlot.parts.length; index++) {
        systemSlotInput.parts.push(systemSlot.parts[index].uri);
      }
    }
    if (systemSlot.functions) {
      systemSlotInput.functions = [];
      for (let index = 0; index < systemSlot.functions.length; index++) {
        systemSlotInput.functions.push(systemSlot.functions[index].uri);
      }
    }
    if (systemSlot.requirements) {
      systemSlotInput.requirements = [];
      for (let index = 0; index < systemSlot.requirements.length; index++) {
        systemSlotInput.requirements.push(systemSlot.requirements[index].uri);
      }
    }
    if (systemSlot.interfaces) {
      systemSlotInput.interfaces = [];
      for (let index = 0; index < systemSlot.interfaces.length; index++) {
        systemSlotInput.interfaces.push(systemSlot.interfaces[index].uri);
      }
    }
    return systemSlotInput;
  }

  public show(object: SeObject): string {
    return object ? object.label : '';
  }

  public showList(list: Array<SeObject>): string {
    let showString = '';
    if (list) {
      showString += '[ ';
      for (let index = 0; index < list.length; index++) {
        showString += list[index].label;
        if (index < list.length - 1) {
          showString += ', ';
        }
      }
      showString += ' ]';
    }
    return showString;
  }

}
