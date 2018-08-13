import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SeObject} from '../types';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit, OnChanges {
  @Input() editMode: boolean;
  @Input() value: any;
  @Input() iri: boolean;
  @Input() label: string;
  @Input() options: SeObject[];
  selectedOption: SeObject;
  @Input() list: boolean;
  @Input() route: string;
  @Input() disabled: boolean;
  @Output() sessionStarted = new EventEmitter();
  @Output() sessionEnded = new EventEmitter();
  @Output() selectedObject = new EventEmitter<SeObject>();
  @Output() createObjectRequested = new EventEmitter();
  @Output() deleteObjectRequested = new EventEmitter();
  private _sessionRunning: boolean;

  constructor() {
    this.editMode = false;
    this.iri = false;
    this._sessionRunning = false;
    this.list = false;
    this.disabled = false;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editMode']) {
      console.log('editMode=' + this.editMode + ' sessionRunning=' + this._sessionRunning);
      if (!this.editMode && this._sessionRunning) {
        this._sessionRunning = false;
        if (this.list) {
          this.sessionEnded.emit(this.uriList(this.value));
        } else {
          this.sessionEnded.emit(this.value);
        }
      }
      if (this.editMode) {
        this._sessionRunning = true;
      }
    }
  }

  onEditModeChanged(): void {
    console.log('PropertyComponent:onEditModeChanged');
    if (!this.disabled) {
      this.editMode = !this.editMode;
      this._sessionRunning = true;
      this.sessionStarted.emit(this.editMode);
    }
  }

  onKey(event: any) {
    if (event.key === 'Enter') {
      this._sessionRunning = false;
      this.sessionEnded.emit(this.value);
    }
  }

  onSelectionChange(event: any) {
    console.log('onSelectionChange 1 =' + (this.value !== null ? this.value : '<null>'));
    if (this.value) {
      for (let index = 0; index < this.options.length; index++) {
        if (this.options[index].uri === this.value) {
          this.label = this.options[index].label;
          console.log('onSelectionChange 2 =' + this.value);
          this._sessionRunning = false;
          this.sessionEnded.emit(this.value);
          break;
        }
      }
    } else {
      this.label = ' ';
      console.log('onSelectionChange 3 =' + this.value);
      this._sessionRunning = false;
      console.log('onSelectionChange value: ' + (this.value ? this.value : '<null>'));
      this.sessionEnded.emit(this.value);
    }
  }

  onLocalLink(object: SeObject): void {
    this.selectedObject.emit(object);
  }

  showList(list: Array<SeObject>): string {
    let showString = '';
    if (list) {
      showString += '[ ';
      for (let index = 0; index < list.length; index++) {
        showString += list[index].label;
        if (index < list.length - 1) {
          showString += ', ';
        }
      }
      showString += ' ]';
    }
    return showString;
  }

  uriList(list: Array<SeObject>): string[] {
    const uri_list = [];
    if (list) {
      for (let index = 0; index < list.length; index++) {
        uri_list.push(list[index].uri);
      }
    }
    return uri_list;
  }

  remove(object: SeObject): void {
    const tmpValues = <SeObject[]>[];
    for (let i = 0; i < this.value.length; i++) {
      if (this.value[i].uri !== object.uri) {
        tmpValues.push(this.value[i]);
      }
    }
    this.value = tmpValues;
  }

  add(): void {
    const tmpValues = <SeObject[]>[];
    if (this.value) {
      for (let i = 0; i < this.value.length; i++) {
        tmpValues.push(this.value[i]);
      }
    }
    tmpValues.push(this.selectedOption);
    this.value = tmpValues;
    this.selectedOption = null;
  }

  create(): void {
    this.createObjectRequested.emit();
  }

  delete(object: SeObject): void {
    this.deleteObjectRequested.emit(object);
  }
}
