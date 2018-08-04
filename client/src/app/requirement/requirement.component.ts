import {Component, Input, OnInit} from '@angular/core';
import {NumericProperty, Requirement} from '../types';
import {SeObjectComponent} from '../se-object-component';
import {RequirementService} from '../requirement.service';
import {NumericPropertyService} from '../numeric-property.service';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent extends SeObjectComponent implements OnInit {
  @Input() selectedRequirement: Requirement;
  allRequirements: Requirement[];
  allNumericProperties: NumericProperty[];

  constructor(private _requirementService: RequirementService,
              private _numericPropertyService: NumericPropertyService) {
    super();
  }

  ngOnInit() {
    this._requirementService.allRequirementsUpdated.subscribe((requirements) => this.allRequirements = requirements);
    this._requirementService.queryAllRequirements(this.selectedRequirement.datasetId);
    this._numericPropertyService.allNumericPropertiesUpdated
      .subscribe((numericProperties) => this.allNumericProperties = numericProperties);
    this._numericPropertyService.queryAllNumericProperties(this.selectedRequirement.datasetId);
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

}
