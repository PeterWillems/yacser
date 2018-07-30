import {Component, OnInit} from '@angular/core';
import {Dataset, Requirement, RequirementInput} from '../types';
import {DatasetService} from '../dataset.service';
import {RequirementService} from '../requirement.service';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-requirement-repository',
  templateUrl: './requirement-repository.component.html',
  styleUrls: ['./requirement-repository.component.css']
})
export class RequirementRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  selectedRequirement: Requirement;
  allRequirements: Requirement[];

  constructor(
    private _datasetService: DatasetService,
    private _requirementService: RequirementService) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._requirementService.allRequirementsUpdated.subscribe((requirements) => {
        this.allRequirements = requirements;
        this.selectedRequirement = <Requirement>this.resetSelected(this._requirementService.selectedRequirement, requirements);
      });
      this._requirementService.queryAllRequirements(this.selectedDataset.datasetId);
    }
  }

  onSelect(index: number): void {
    this.selectedRequirement = this.allRequirements[index];
    this._requirementService.selectedRequirement = this.selectedRequirement;
  }

  onCreate(): void {
    const subscription = <Subscription>this._requirementService.requirementCreated.subscribe((value) => {
      this.selectedRequirement = value;
      this._requirementService.selectedRequirement = this.selectedRequirement;
      subscription.unsubscribe();
    });
    this._requirementService.createRequirement(new RequirementInput(this.selectedDataset.datasetId, 'uri', 'label', null));
  }

  onDelete(index: number): void {
    const subscription = <Subscription>this._requirementService.requirementDeleted.subscribe((value) => {
      this.selectedRequirement = null;
      this._requirementService.selectedRequirement = this.selectedRequirement;
      subscription.unsubscribe();
    });
    this._requirementService.deleteRequirement(this.allRequirements[index].datasetId, this.allRequirements[index].uri);
  }
}
