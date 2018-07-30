import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, Query, Hamburger, HamburgerInput} from './types';
import {
  ALL_HAMBURGERS,
  CREATE_HAMBURGER,
  DELETE_HAMBURGER,
  UPDATE_HAMBURGER
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class HamburgerService {
  public selectedHamburger: Hamburger;
  public allHamburgersUpdated = new EventEmitter<Array<Hamburger>>();
  public hamburgerCreated = new EventEmitter<Hamburger>();
  public hamburgerDeleted = new EventEmitter<Hamburger>();

  constructor(private apollo: Apollo) {
  }

  public queryAllHamburgers(datasetId: number) {
    console.log('queryAllHamburgers');
    this.apollo.watchQuery<Query>({
      query: ALL_HAMBURGERS,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value) => this.allHamburgersUpdated.emit(value.data.allHamburgers));
  }

  public createHamburger(hamburgerInput: HamburgerInput) {
    console.log('createHamburger');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_HAMBURGER,
      variables: {
        datasetId: hamburgerInput.datasetId,
        uri: hamburgerInput.uri,
        label: hamburgerInput.label
      },
      refetchQueries: [{
        query: ALL_HAMBURGERS, variables: {
          datasetId: hamburgerInput.datasetId
        }
      }]
    }).subscribe((value) => this.hamburgerCreated.emit(value.data.createHamburger));
  }

  public mutateHamburger(hamburgerInput: HamburgerInput) {
    console.log('mutateHamburger: ' + 'label=' + hamburgerInput.label);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_HAMBURGER,
      variables: {
        hamburgerInput: {
          datasetId: hamburgerInput.datasetId,
          uri: hamburgerInput.uri,
          label: hamburgerInput.label,
          assembly: hamburgerInput.assembly,
          parts: hamburgerInput.parts,
          functionalUnit: hamburgerInput.functionalUnit,
          technicalSolution: hamburgerInput.technicalSolution
        }
      },
      refetchQueries: [{
        query: ALL_HAMBURGERS, variables: {
          datasetId: hamburgerInput.datasetId
        }
      }]
    }).subscribe();
  }

  public deleteHamburger(datasetId: number, uri: string) {
    console.log('deleteHamburger');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_HAMBURGER,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      refetchQueries: [{
        query: ALL_HAMBURGERS, variables: {
          datasetId: datasetId
        }
      }]
    }).subscribe((value) => this.hamburgerDeleted.emit(value.data.deleteHamburger));
  }

  public cloneHamburgerInput(selectedHamburger: Hamburger): HamburgerInput {
    const hamburgerInput = new HamburgerInput(selectedHamburger.datasetId, selectedHamburger.uri, selectedHamburger.label,
      selectedHamburger.assembly ? selectedHamburger.assembly.uri : null);

    if (selectedHamburger.assembly) {
      hamburgerInput.assembly = selectedHamburger.assembly.uri;
    }
    hamburgerInput.parts = [];
    if (selectedHamburger.parts) {
      for (let index = 0; index < selectedHamburger.parts.length; index++) {
        hamburgerInput.parts.push(selectedHamburger.parts[index].uri);
      }
    }
    if (selectedHamburger.functionalUnit) {
      hamburgerInput.functionalUnit = selectedHamburger.functionalUnit.uri;
    }
    if (selectedHamburger.technicalSolution) {
      hamburgerInput.technicalSolution = selectedHamburger.technicalSolution.uri;
    }
    return hamburgerInput;
  }

}
