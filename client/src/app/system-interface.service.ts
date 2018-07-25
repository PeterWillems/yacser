import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Query, SystemInterface} from './types';
import {ALL_SYSTEM_INTERFACES} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class SystemInterfaceService {
  public allSystemInterfacesUpdated = new EventEmitter<Array<SystemInterface>>();

  constructor(private apollo: Apollo) {
  }

  public queryAllSystemInterfaces(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_SYSTEM_INTERFACES,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => this.allSystemInterfacesUpdated.emit(value.data.allSystemInterfaces))
    );
  }

}
