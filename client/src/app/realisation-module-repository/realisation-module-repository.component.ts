import {Component, OnInit} from '@angular/core';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Dataset, RealisationModule, RealisationModuleInput, Requirement, RequirementInput} from '../types';
import {DatasetService} from '../dataset.service';
import {RequirementService} from '../requirement.service';
import {RealisationModuleService} from '../realisation-module.service';
import {Subscription} from 'apollo-client/util/Observable';

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
              private _realisationModuleService: RealisationModuleService) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._realisationModuleService.allRealisationModulesUpdated.subscribe((allRealisationModules) => {
        this.allRealisationModules = allRealisationModules;
        this.selectedRealisationModule =
          <RealisationModule>this.resetSelected(this._realisationModuleService.selectedRealisationModule, allRealisationModules);
      });
      this._realisationModuleService.queryAllRealisationModules(this.selectedDataset.datasetId);
    }
  }

  onSelect(index: number): void {
    this.selectedRealisationModule = this.allRealisationModules[index];
    this._realisationModuleService.selectedRealisationModule = this.selectedRealisationModule;
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
}
