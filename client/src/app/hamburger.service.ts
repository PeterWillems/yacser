import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, Query, Hamburger, HamburgerInput, PortRealisation, PortRealisationInput} from './types';
import {
  ALL_HAMBURGERS, ALL_REALISATION_MODULES, ALL_SYSTEM_SLOTS,
  CREATE_HAMBURGER, CREATE_PORT_REALISATION,
  DELETE_HAMBURGER, DELETE_PORT_REALISATION, ONE_HAMBURGER,
  UPDATE_HAMBURGER, UPDATE_PORT_REALISATION
} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class HamburgerService {
  public selectedHamburger: Hamburger;
  public allHamburgersUpdated = new EventEmitter<Array<Hamburger>>();
  public oneHamburgerUpdated = new EventEmitter<Hamburger>();
  public hamburgerCreated = new EventEmitter<Hamburger>();
  public hamburgerMutated = new EventEmitter<Hamburger>();
  public hamburgerDeleted = new EventEmitter<Hamburger>();
  public portRealisationCreated = new EventEmitter<PortRealisation>();
  public portRealisationMutated = new EventEmitter<PortRealisation>();
  public portRealisationDeleted = new EventEmitter<PortRealisation>();

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

  public queryOneHamburger(datasetId: number, uri: string) {
    console.log('queryOneHamburger');
    this.apollo.watchQuery<Query>({
      query: ONE_HAMBURGER,
      variables: {
        datasetId: datasetId,
        uri: uri
      }
    }).valueChanges.subscribe(value => this.oneHamburgerUpdated.emit(value.data.oneHamburger)
    );
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
          technicalSolution: hamburgerInput.technicalSolution,
          portRealisations: hamburgerInput.portRealisations
        }
      },
      refetchQueries: [{
        query: ALL_HAMBURGERS,
        variables: {datasetId: hamburgerInput.datasetId}
      }, {
        query: ALL_REALISATION_MODULES,
        variables: {datasetId: hamburgerInput.datasetId}
      }, {
        query: ALL_SYSTEM_SLOTS,
        variables: {datasetId: hamburgerInput.datasetId}
      }]
    }).subscribe((value) => this.hamburgerMutated.emit(value.data.mutateHamburger));
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
    hamburgerInput.portRealisations = [];
    if (selectedHamburger.portRealisations) {
      for (let index = 0; index < selectedHamburger.portRealisations.length; index++) {
        hamburgerInput.portRealisations.push(selectedHamburger.portRealisations[index].uri);
      }
    }

    return hamburgerInput;
  }

  public createPortRealisation(portRealisationInput: PortRealisationInput) {
    console.log('createPortRealisation');
    this.apollo.mutate<Mutation>({
      mutation:
      CREATE_PORT_REALISATION,
      variables: {
        datasetId: portRealisationInput.datasetId,
        uri: portRealisationInput.uri,
        label: portRealisationInput.label
      }
    }).subscribe((value) => this.portRealisationCreated.emit(value.data.createPortRealisation));
  }

  public mutatePortRealisation(portRealisationInput: PortRealisationInput) {
    console.log('mutatePortRealisation: '
      + 'datasetId=' + portRealisationInput.datasetId
      + ' uri=' + portRealisationInput.uri
      + ' label=' + portRealisationInput.label
      + ' assembly=' + portRealisationInput.assembly
      + ' parts=' + portRealisationInput.parts);
    this.apollo.mutate<Mutation>({
      mutation: UPDATE_PORT_REALISATION,
      variables: {
        portRealisationInput: {
          datasetId: portRealisationInput.datasetId,
          uri: portRealisationInput.uri,
          label: portRealisationInput.label,
          assembly: portRealisationInput.assembly,
          parts: portRealisationInput.parts,
          systemInterface: portRealisationInput.systemInterface
        }
      },
      refetchQueries: [{
        query: ALL_HAMBURGERS, variables: {
          datasetId: portRealisationInput.datasetId
        }
      }]
    }).subscribe((value) => this.portRealisationMutated.emit(value.data.mutatePortRealisation));
  }

  public deletePortRealisation(datasetId: number, uri: string) {
    console.log('deletePortRealisation');
    this.apollo.mutate<Mutation>({
      mutation:
      DELETE_PORT_REALISATION,
      variables: {
        datasetId: datasetId,
        uri: uri
      },
      // refetchQueries: [{
      //   query: ALL_HAMBURGERS, variables: {
      //     datasetId: datasetId
      //   }
      // }]
    }).subscribe((value) => this.portRealisationDeleted.emit(value.data.deletePortRealisation));
  }

  public clonePortRealisationInput(selectedPortRealisation: PortRealisation): PortRealisationInput {
    const portRealisationInput =
      new PortRealisationInput(selectedPortRealisation.datasetId, selectedPortRealisation.uri, selectedPortRealisation.label,
        selectedPortRealisation.assembly ? selectedPortRealisation.assembly.uri : null);

    if (selectedPortRealisation.assembly) {
      portRealisationInput.assembly = selectedPortRealisation.assembly.uri;
    }
    portRealisationInput.parts = [];
    if (selectedPortRealisation.parts) {
      for (let index = 0; index < selectedPortRealisation.parts.length; index++) {
        portRealisationInput.parts.push(selectedPortRealisation.parts[index].uri);
      }
    }
    if (selectedPortRealisation.systemInterface) {
      portRealisationInput.systemInterface = selectedPortRealisation.systemInterface.uri;
    }

    return portRealisationInput;
  }

}
