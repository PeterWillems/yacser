import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CoinsObject, CoinsObjectInput, NumericProperty, Requirement} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {RequirementService} from '../requirement.service';
import {NumericPropertyService} from '../numeric-property.service';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent extends SeObjectComponent implements OnInit, OnChanges {
  @Input() selectedRequirement: Requirement;
  allRequirements: Requirement[];
  selectedNumericProperty: NumericProperty;
  selectedCoinsObject: CoinsObject;

  constructor(private _requirementService: RequirementService,
              private _numericPropertyService: NumericPropertyService) {
    super();
  }

  ngOnInit() {
    this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this.selectedRequirement.datasetId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRequirement']) {
      if (this.selectedNumericProperty) {
        let selectedNumericPropertyUpdated = false;
        if (this.selectedRequirement.maxValue) {
          if (this.selectedNumericProperty.uri === this.selectedRequirement.maxValue.uri) {
            this.selectedNumericProperty = this.selectedRequirement.maxValue;
            selectedNumericPropertyUpdated = true;
          }
        } else if (this.selectedRequirement.minValue) {
          if (this.selectedNumericProperty.uri === this.selectedRequirement.minValue.uri) {
            this.selectedNumericProperty = this.selectedRequirement.minValue;
            selectedNumericPropertyUpdated = true;
          }
        }
        if (!selectedNumericPropertyUpdated) {
          this.selectedNumericProperty = null;
        }
      }
      if (this.selectedCoinsObject) {
        this.selectedCoinsObject = this.selectedRequirement.coins;
      }
    }
  }

  onSelectedObject(object: any, label: string): void {
    console.log('RequirementComponent:onSelectedObject ' + label);
    switch (label) {
      case 'minValue':
      case 'maxValue':
        if (this.selectedNumericProperty && this.selectedNumericProperty.uri === object.uri) {
          this.selectedNumericProperty = null;
        } else {
          this.selectedNumericProperty = <NumericProperty>object;
        }
        break;
      case 'coins':
        if (this.selectedCoinsObject) {
          this.selectedCoinsObject = null;
        } else {
          this.selectedCoinsObject = <CoinsObject>object;
        }
        console.log('RequirementComponent:onSelectedObject this.selectedCoinsObject ' + this.selectedCoinsObject);
        break;
    }
  }

  onSessionEnded(propertyValue: any, propertyLabel: string) {
    console.log('onSessionEnded value: ' + (propertyValue ? propertyValue : '<null>') + ' propertyLabel: ' + propertyLabel);
    switch (propertyLabel) {
      case 'label':
        if (this.selectedRequirement['label'] === propertyValue) {
          return;
        }
        break;
      case 'assembly':
        if (this.selectedRequirement['assembly'] !== null && this.selectedRequirement['assembly'].uri === propertyValue) {
          return;
        }
        break;
      case 'minValue':
        if (this.selectedRequirement['minValue'] !== null && this.selectedRequirement['minValue'].uri === propertyValue) {
          return;
        }
        break;
      case 'maxValue':
        if (this.selectedRequirement['maxValue'] !== null && this.selectedRequirement['maxValue'].uri === propertyValue) {
          return;
        }
        break;
    }
    const requirementInput = this._requirementService.cloneRequirementInput(this.selectedRequirement);
    const coinsObjectInput = propertyLabel === 'coins' ? propertyValue
      : new CoinsObjectInput(this.selectedRequirement.coins.name,
        this.selectedRequirement.coins.userID, this.selectedRequirement.coins.description, this.selectedRequirement.coins.creationDate);
    requirementInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (requirementInput[propertyLabel] ? requirementInput[propertyLabel] : '<null>'));
    this._requirementService.mutateRequirement(requirementInput, coinsObjectInput);
    this.propertyEdited = null;
  }

  onCreateObjectRequested(label: string): void {
    const subscription = <Subscription>this._numericPropertyService.numericPropertyCreated.subscribe((numericProperty) => {
      console.log('numericPropertyCreated');
      const requirementInput = this._requirementService.cloneRequirementInput(this.selectedRequirement);
      requirementInput[label] = numericProperty.uri;
      this._requirementService.mutateRequirement(requirementInput, new CoinsObjectInput(this.selectedRequirement.coins.name,
        this.selectedRequirement.coins.userID, this.selectedRequirement.coins.description, this.selectedRequirement.coins.creationDate));
      subscription.unsubscribe();
    });
    console.log('onCreateObjectRequested datasetId=' + this.selectedRequirement.datasetId);
    this._numericPropertyService.createNumericProperty(this.selectedRequirement.datasetId, 'uri', 'label');
  }

  onDeleteObjectRequested(label: string): void {
    const subscription = <Subscription>this._numericPropertyService.numericPropertyDeleted.subscribe((numericProperty) => {
      console.log('numericPropertyDeleted');
      const requirementInput = this._requirementService.cloneRequirementInput(this.selectedRequirement);
      requirementInput[label] = null;
      this._requirementService.mutateRequirement(requirementInput, new CoinsObjectInput(this.selectedRequirement.coins.name,
        this.selectedRequirement.coins.userID, this.selectedRequirement.coins.description, this.selectedRequirement.coins.creationDate));
      subscription.unsubscribe();
    });
    this._numericPropertyService.deleteNumericProperty(this.selectedRequirement.datasetId, this.selectedRequirement[label].uri);
  }
}
