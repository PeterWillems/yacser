import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NumericProperty, Requirement, SeObject} from '../types';
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
  // allNumericProperties: NumericProperty[];
  selectedNumericProperty: NumericProperty;

  constructor(private _requirementService: RequirementService,
              private _numericPropertyService: NumericPropertyService) {
    super();
  }

  ngOnInit() {
    this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this.selectedRequirement.datasetId);
    // this._numericPropertyService.allNumericPropertiesUpdated
    //   .subscribe((numericProperties) => this.allNumericProperties = numericProperties);
    // this._numericPropertyService.queryAllNumericProperties(this.selectedRequirement.datasetId);
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
    }
  }

  onSelectedObject(seObject: SeObject): void {
    console.log('RequirementComponent:onSelectedObject');
    if (this.selectedNumericProperty && this.selectedNumericProperty.uri === seObject.uri) {
      this.selectedNumericProperty = null;
    } else {
      this.selectedNumericProperty = <NumericProperty>seObject;
    }
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
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
    requirementInput[propertyLabel] = (propertyValue ? propertyValue : null);
    console.log('propertyLabel=' + propertyLabel + ' ' + (requirementInput[propertyLabel] ? requirementInput[propertyLabel] : '<null>'));
    this._requirementService.mutateRequirement(requirementInput);
    this.propertyEdited = null;
  }

  onCreateObjectRequested(label: string): void {
    const subscription = <Subscription>this._numericPropertyService.numericPropertyCreated.subscribe((numericProperty) => {
      console.log('numericPropertyCreated');
      const requirementInput = this._requirementService.cloneRequirementInput(this.selectedRequirement);
      requirementInput[label] = numericProperty.uri;
      this._requirementService.mutateRequirement(requirementInput);
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
      this._requirementService.mutateRequirement(requirementInput);
      subscription.unsubscribe();
    });
    this._numericPropertyService.deleteNumericProperty(this.selectedRequirement.datasetId, this.selectedRequirement[label].uri);
  }
}
