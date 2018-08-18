import {Component, OnInit} from '@angular/core';
import {Dataset, Requirement, RequirementInput, SystemSlot} from '../types';
import {DatasetService} from '../dataset.service';
import {RequirementService} from '../requirement.service';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Subscription} from 'apollo-client/util/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnSortedEvent} from '../sort.service';

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
    private _requirementService: RequirementService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._requirementService.allRequirementsUpdated.subscribe((requirements) => {
        this.allRequirements = requirements;
        this.onSorted({sortDirection: 'asc', sortColumn: 'label'});
        this.route.params.subscribe(params => this.setSelectedRequirement(params['id']));
      });
      this._requirementService.queryAllRequirements(this.selectedDataset.datasetId);
    }
  }

  setSelectedRequirement(requirementUri: string) {
    console.log('setSelectedRequirement requirementUri=' + requirementUri);
    if (requirementUri) {
      const element = document.getElementById(requirementUri);
      if (element && !this.isInViewport(element)) {
        element.scrollIntoView();
      }
      for (let index = 0; index < this.allRequirements.length; index++) {
        if (this.allRequirements[index].uri === requirementUri) {
          this.selectedRequirement = this.allRequirements[index];
          this._requirementService.selectedRequirement = this.selectedRequirement;
          break;
        }
      }
    } else {
      this.selectedRequirement = <Requirement>this.resetSelected(this._requirementService.selectedRequirement, this.allRequirements);
    }
  }

  onSelect(index: number): void {
    console.log('onSelect index=' + index);
    this.selectedRequirement = this.allRequirements[index];
    this._requirementService.selectedRequirement = this.selectedRequirement;
    this.router.navigate(['/requirements', {id: this.selectedRequirement.uri}]);
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

  onSorted(criteria: ColumnSortedEvent): void {
    this.allRequirements = this.allRequirements.sort((a, b) => {
      if (criteria.sortDirection === 'desc') {
        switch (criteria.sortColumn) {
          case 'label':
            return (a.label < b.label) ? 1 : -1;
          case 'localName':
            return (this.localName(a) < this.localName(b)) ? 1 : -1;
          case 'assembly':
            return (this.show(a.assembly) < this.show(b.assembly)) ? 1 : -1;
        }
      } else {
        switch (criteria.sortColumn) {
          case 'label':
            return (a.label > b.label) ? 1 : -1;
          case 'localName':
            return (this.localName(a) > this.localName(b)) ? 1 : -1;
          case 'assembly':
            return (this.show(a.assembly) > this.show(b.assembly)) ? 1 : -1;
        }
      }
    });
  }
}
