import {Component, OnInit} from '@angular/core';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Dataset, RealisationModule, RealisationModuleInput, Requirement, RequirementInput, SystemSlot} from '../types';
import {DatasetService} from '../dataset.service';
import {RequirementService} from '../requirement.service';
import {RealisationModuleService} from '../realisation-module.service';
import {Subscription} from 'apollo-client/util/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {ColumnSortedEvent} from '../sort.service';

@Component({
  selector: 'app-realisation-module-repository',
  templateUrl: './realisation-module-repository.component.html',
  styleUrls: ['./realisation-module-repository.component.css']
})
export class RealisationModuleRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  selectedRealisationModule: RealisationModule;
  allRealisationModules: RealisationModule[];

  constructor(private _datasetService: DatasetService,
              private _realisationModuleService: RealisationModuleService,
              private route: ActivatedRoute,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._realisationModuleService.allRealisationModulesUpdated.subscribe((allRealisationModules) => {
        this.allRealisationModules = allRealisationModules;
        this.onSorted({sortDirection: 'asc', sortColumn: 'label'});
        this.route.params.subscribe(params => this.setSelectedRealisationModule(params['id']));
      });
      this._realisationModuleService.queryAllRealisationModules(this.selectedDataset.datasetId);
    }
  }

  setSelectedRealisationModule(realisationModuleUri: string) {
    if (realisationModuleUri) {
      const element = document.getElementById(realisationModuleUri);
      if (element && !this.isInViewport(element)) {
        element.scrollIntoView();
      }
      for (let index = 0; index < this.allRealisationModules.length; index++) {
        if (this.allRealisationModules[index].uri === realisationModuleUri) {
          this.selectedRealisationModule = this.allRealisationModules[index];
          this._realisationModuleService.selectedRealisationModule = this.selectedRealisationModule;
          break;
        }
      }
    } else {
      this.selectedRealisationModule =
        <RealisationModule>this.resetSelected(this._realisationModuleService.selectedRealisationModule, this.allRealisationModules);
    }
  }

  onSelect(index: number): void {
    this.selectedRealisationModule = this.allRealisationModules[index];
    this._realisationModuleService.selectedRealisationModule = this.selectedRealisationModule;
    this.router.navigate(['/realisationmodules', {id: this.selectedRealisationModule.uri}]);
  }

  onCreate(): void {
    const subscription = <Subscription>this._realisationModuleService.realisationModuleCreated.subscribe((value) => {
      this.selectedRealisationModule = value;
      this._realisationModuleService.selectedRealisationModule = this.selectedRealisationModule;
      subscription.unsubscribe();
    });
    this._realisationModuleService
      .createRealisationModule(new RealisationModuleInput(this.selectedDataset.datasetId, 'uri', 'label', null));
  }

  onDelete(index: number): void {
    const subscription = <Subscription>this._realisationModuleService.realisationModuleDeleted.subscribe((value) => {
      this.selectedRealisationModule = null;
      this._realisationModuleService.selectedRealisationModule = this.selectedRealisationModule;
      subscription.unsubscribe();
    });
    this._realisationModuleService
      .deleteRealisationModule(this.allRealisationModules[index].datasetId, this.allRealisationModules[index].uri);
  }

  onSorted(criteria: ColumnSortedEvent): void {
    this.allRealisationModules = this.allRealisationModules.sort((a, b) => {
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
