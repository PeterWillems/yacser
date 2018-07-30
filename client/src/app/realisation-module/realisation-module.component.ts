import {Component, Input, OnInit} from '@angular/core';
import {RealisationModule} from '../types';
import {RealisationModuleService} from '../realisation-module.service';
import {SeObjectComponent} from '../se-object-component';
import {PerformanceService} from '../performance.service';

@Component({
  selector: 'app-realisation-module',
  templateUrl: './realisation-module.component.html',
  styleUrls: ['./realisation-module.component.css']
})
export class RealisationModuleComponent extends SeObjectComponent implements OnInit {
  @Input() selectedRealisationModule: RealisationModule;
  allRealisationModules: RealisationModule[];
  allPerformances: Performance[];

  constructor(private _realisationModuleService: RealisationModuleService,
              private _performanceService: PerformanceService) {
    super();
  }

  ngOnInit() {
    this._realisationModuleService.allRealisationModulesUpdated
      .subscribe((allRealisationModules) => this.allRealisationModules = allRealisationModules);
    this._realisationModuleService.queryAllRealisationModules(this.selectedRealisationModule.datasetId);
    this._performanceService.allPerformancesUpdated.subscribe((allPerformances) => this.allPerformances = allPerformances);
    this._performanceService.queryAllPerformances(this.selectedRealisationModule.datasetId);
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
  }

}
