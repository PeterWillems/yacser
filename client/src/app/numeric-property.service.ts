import {EventEmitter, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Mutation, NumericProperty, Query, Requirement, RequirementInput} from './types';
import {ALL_NUMERIC_PROPERTIES, ALL_REQUIREMENTS, CREATE_REQUIREMENT, DELETE_REQUIREMENT, UPDATE_REQUIREMENT} from './graphql';


@Injectable({
  providedIn: 'root'
})
export class NumericPropertyService {
  public selectedNumericProperty: NumericProperty;
  public allNumericPropertiesUpdated = new EventEmitter<Array<NumericProperty>>();
  public numericPropertyCreated = new EventEmitter<NumericProperty>();
  public numericPropertyDeleted = new EventEmitter<NumericProperty>();

  constructor(private apollo: Apollo) {
  }

  public queryAllNumericProperties(datasetId: number) {
    this.apollo.watchQuery<Query>({
      query: ALL_NUMERIC_PROPERTIES,
      variables: {
        datasetId: datasetId
      }
    })
      .valueChanges.subscribe((value => this.allNumericPropertiesUpdated.emit(value.data.allNumericProperties))
    );
  }
}
