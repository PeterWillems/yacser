import {Component, OnInit} from '@angular/core';
import {SeObjectRepositoryComponent} from '../se-object-repository.component';
import {Dataset, Function, FunctionInput, Hamburger, HamburgerInput} from '../types';
import {DatasetService} from '../dataset.service';
import {HamburgerService} from '../hamburger.service';
import {Subscription} from 'apollo-client/util/Observable';

@Component({
  selector: 'app-hamburger-repository',
  templateUrl: './hamburger-repository.component.html',
  styleUrls: ['./hamburger-repository.component.css']
})
export class HamburgerRepositoryComponent extends SeObjectRepositoryComponent implements OnInit {
  selectedDataset: Dataset;
  selectedHamburger: Hamburger;
  allHamburgers: Hamburger[];

  constructor(private _datasetService: DatasetService,
              private _hamburgerService: HamburgerService) {
    super();
  }

  ngOnInit() {
    this.selectedDataset = this._datasetService.getSelectedDataset();
    if (this.selectedDataset) {
      this._hamburgerService.allHamburgersUpdated.subscribe((hamburgers) => {
        this.allHamburgers = hamburgers;
        this.selectedHamburger = <Hamburger>this.resetSelected(this._hamburgerService.selectedHamburger, hamburgers);
      });
      this._hamburgerService.queryAllHamburgers(this.selectedDataset.datasetId);
    }
  }

  onSelect(index: number): void {
    this.selectedHamburger = this.allHamburgers[index];
    this._hamburgerService.selectedHamburger = this.selectedHamburger;
  }

  onCreate(): void {
    const subscription = <Subscription>this._hamburgerService.hamburgerCreated.subscribe((value) => {
      this.selectedHamburger = value;
      this._hamburgerService.selectedHamburger = this.selectedHamburger;
      subscription.unsubscribe();
    });
    this._hamburgerService.createHamburger(new HamburgerInput(this.selectedDataset.datasetId, 'uri', 'label', null));
  }

  onDelete(index: number): void {
    const subscription = <Subscription>this._hamburgerService.hamburgerDeleted.subscribe((value) => {
      this.selectedHamburger = null;
      this._hamburgerService.selectedHamburger = this.selectedHamburger;
      subscription.unsubscribe();
    });
    this._hamburgerService.deleteHamburger(this.allHamburgers[index].datasetId, this.allHamburgers[index].uri);
  }
}
