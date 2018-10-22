import {Component, Input, OnInit} from '@angular/core';
import {CoinsProperty} from '../../types';
import {SeObjectComponent} from '../../se-object-component';

@Component({
  selector: 'app-coinsproperty',
  templateUrl: './coinsproperty.component.html',
  styleUrls: ['./coinsproperty.component.css']
})
export class CoinspropertyComponent extends SeObjectComponent implements OnInit {
  @Input() selectedProperty: CoinsProperty;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  onSessionEnded(propertyValue: string, propertyLabel: string) {
  }

}
