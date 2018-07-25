import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Query, Requirement} from './types';
import {ALL_REQUIREMENTS} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  public allRequirementsUpdated = new EventEmitter<Array<Requirement>>();

  constructor(private apollo: Apollo) {
  }

  public queryAllRequirements(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_REQUIREMENTS,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => this.allRequirementsUpdated.emit(value.data.allRequirements))
    );
  }

}
