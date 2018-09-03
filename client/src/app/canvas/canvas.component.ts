import {Component, OnInit} from '@angular/core';
import {SystemSlotService} from '../system-slot.service';
import {DatasetService} from '../dataset.service';
import {
  Function,
  Hamburger, NumericProperty,
  Performance, PortRealisation,
  RealisationModule,
  RealisationPort,
  Requirement,
  SeObject,
  SystemInterface,
  SystemSlot
} from '../types';
import {SystemInterfaceService} from '../system-interface.service';
import {HamburgerService} from '../hamburger.service';
import {RealisationModuleService} from '../realisation-module.service';
import {FunctionService} from '../function.service';
import {RequirementService} from '../requirement.service';
import {PerformanceService} from '../performance.service';
import {Router} from '@angular/router';
import {NumericPropertyService} from '../numeric-property.service';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let windowX = 0;
let windowY = 0;

let currentScale = 1;
const minScale = .2;
const maxScale = 3;
const scaleIncrement = .1;

let widgets = new Map<string, Node>();
const seObjects = new Map<string, SeObject>();

let zIndex = 1;

let cursorX: number;
let cursorY: number;

let drawList: Shape[] = [];


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  objectTypes = ['Function', 'Hamburger', 'Performance', 'RealisationModule', 'Requirement', 'SystemInterface', 'SystemSlot'];
  selectedObjectType = 'SystemSlot';
  allFunctions: Function[];
  allHamburgers: Hamburger[];
  allNumericProperties: NumericProperty[];
  allPerformances: Performance[];
  allRealisationModules: RealisationModule[];
  allRequirements: Requirement[];
  allSystemInterfaces: SystemInterface[];
  allSystemSlots: SystemSlot[];
  options: SeObject[];
  selectedOption: SeObject;

  constructor(private _datasetService: DatasetService,
              private _functionService: FunctionService,
              private _hamburgerService: HamburgerService,
              private _numericPropertyService: NumericPropertyService,
              private _performanceService: PerformanceService,
              private _realisationModuleService: RealisationModuleService,
              private _requirementService: RequirementService,
              private _systemInterfaceService: SystemInterfaceService,
              private _systemSlotService: SystemSlotService,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log('ngOnInit CanvasComponent drawList=' + drawList.length + ' widgets=' + widgets.size + ' seObjects=' + seObjects.size);
    const dataset = this._datasetService.getSelectedDataset();
    this._functionService.allFunctionsUpdated
      .subscribe(allFunctions => {
        this.allFunctions = allFunctions;
        for (let i = 0; i < allFunctions.length; i++) {
          seObjects.set(allFunctions[i].uri, allFunctions[i]);
        }
      });
    this._functionService.queryAllFunctions(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._hamburgerService.allHamburgersUpdated
      .subscribe(allHamburgers => {
        this.allHamburgers = allHamburgers;
        for (let i = 0; i < allHamburgers.length; i++) {
          seObjects.set(allHamburgers[i].uri, allHamburgers[i]);
          if (allHamburgers[i].portRealisations) {
            for (let j = 0; j < allHamburgers[i].portRealisations.length; j++) {
              seObjects.set(allHamburgers[i].portRealisations[j].uri, allHamburgers[i].portRealisations[j]);
            }
          }
        }
      });
    this._hamburgerService.queryAllHamburgers(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._numericPropertyService.allNumericPropertiesUpdated
      .subscribe(allNumericProperties => {
        this.allNumericProperties = allNumericProperties;
        for (let i = 0; i < allNumericProperties.length; i++) {
          seObjects.set(allNumericProperties[i].uri, allNumericProperties[i]);
        }
      });
    this._numericPropertyService.queryAllNumericProperties(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._realisationModuleService.allRealisationModulesUpdated
      .subscribe(allRealisationModules => {
        this.allRealisationModules = allRealisationModules;
        for (let i = 0; i < allRealisationModules.length; i++) {
          seObjects.set(allRealisationModules[i].uri, allRealisationModules[i]);
          if (allRealisationModules[i].ports) {
            for (let j = 0; j < allRealisationModules[i].ports.length; j++) {
              seObjects.set(allRealisationModules[i].ports[j].uri, allRealisationModules[i].ports[j]);
            }
          }
        }
      });
    this._realisationModuleService.queryAllRealisationModules(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._performanceService.allPerformancesUpdated
      .subscribe(allPerformances => {
        this.allPerformances = allPerformances;
        for (let i = 0; i < allPerformances.length; i++) {
          seObjects.set(allPerformances[i].uri, allPerformances[i]);
        }
      });
    this._performanceService.queryAllPerformances(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._systemInterfaceService.allSystemInterfacesUpdated
      .subscribe(allSystemInterfaces => {
        this.allSystemInterfaces = allSystemInterfaces;
        for (let i = 0; i < allSystemInterfaces.length; i++) {
          seObjects.set(allSystemInterfaces[i].uri, allSystemInterfaces[i]);
        }
      });
    this._requirementService.queryAllRequirements(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._requirementService.allRequirementsUpdated
      .subscribe(allRequirements => {
        this.allRequirements = allRequirements;
        for (let i = 0; i < allRequirements.length; i++) {
          seObjects.set(allRequirements[i].uri, allRequirements[i]);
        }
      });
    this._systemInterfaceService.queryAllSystemInterfaces(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._systemSlotService.allSystemSlotsUpdated
      .subscribe(allSystemSlots => {
        this.allSystemSlots = allSystemSlots;
        for (let i = 0; i < allSystemSlots.length; i++) {
          seObjects.set(allSystemSlots[i].uri, allSystemSlots[i]);
        }
        this.setOptions();
      });
    this._systemSlotService.queryAllSystemSlots(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);

    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    console.log('widgets: ' + widgets.size);
    widgets.forEach((widget) => {
      canvas.addEventListener('mousedown', (e) => {
        widget.mouseDown(e);
      }, false);
      canvas.addEventListener('mouseup', (e) => {
        widget.mouseUp(e);
      }, false);
      canvas.addEventListener('contextmenu', (e) => {
        widget.contextmenu(e);
      }, false);

    });
    ctx = canvas.getContext('2d');
    windowX = 0;
    windowY = 0;
    document.onmousemove = (event: MouseEvent) => {
      cursorX = (event.x - canvas.offsetLeft + window.pageXOffset) / currentScale;
      cursorY = (event.y - canvas.offsetTop + window.pageYOffset) / currentScale;
    };
    ctx.save();
    gameloop();
  }

  setOptions() {
    const objectTypeSelector = document.getElementById('objectTypeSelector');
    console.log('setOptions: ' + objectTypeSelector);
    if (objectTypeSelector) {
      switch (this.selectedObjectType) {
        case 'Function':
          this.options = this.allFunctions;
          objectTypeSelector.style.backgroundColor = 'Plum';
          break;
        case 'Hamburger':
          this.options = this.allHamburgers;
          objectTypeSelector.style.backgroundColor = 'LightSalmon';
          break;
        case 'Performance':
          this.options = this.allPerformances;
          objectTypeSelector.style.backgroundColor = 'YellowGreen';
          break;
        case 'RealisationModule':
          this.options = this.allRealisationModules;
          objectTypeSelector.style.backgroundColor = 'LightGreen';
          break;
        case 'Requirement':
          this.options = this.allRequirements;
          objectTypeSelector.style.backgroundColor = 'Gold';
          break;
        case 'SystemInterface':
          this.options = this.allSystemInterfaces;
          objectTypeSelector.style.backgroundColor = 'DarkGray';
          break;
        case 'SystemSlot':
          this.options = this.allSystemSlots;
          objectTypeSelector.style.backgroundColor = 'LightBlue';
          break;
      }
    }
  }

  createSample(): void {
    const zitvoorziening = new SystemSlotWidget(200, 200, 'Zitvoorziening');
    drawList.push(zitvoorziening);
    const fundatiesysteem = new SystemSlotWidget(150, 300, 'Fundatiesysteem');
    drawList.push(fundatiesysteem);
    const zitsysteem = new SystemSlotWidget(250, 300, 'Zitsysteem');
    drawList.push(zitsysteem);
    const zitbank = new RealisationModuleWidget(900, 200, 'Zitbank');
    drawList.push(zitbank);
    const steunlinks = new RealisationModuleWidget(800, 300, 'Steun links');
    drawList.push(steunlinks);
    const ligger = new RealisationModuleWidget(900, 300, 'Ligger');
    drawList.push(ligger);
    const steunrechts = new RealisationModuleWidget(1000, 300, 'Steun rechts');
    drawList.push(steunrechts);
    const hamburger_1 = new HamburgerWidget(550, 200, 'Zitvoorziening realis.');
    drawList.push(hamburger_1);
    const hamburger_1_1 = new HamburgerWidget(450, 300, 'Fundatiesysteem realis. 1');
    drawList.push(hamburger_1_1);
    const hamburger_1_2 = new HamburgerWidget(550, 300, 'Zitsysteem realis.');
    drawList.push(hamburger_1_2);
    const hamburger_1_3 = new HamburgerWidget(650, 300, 'Fundatiesysteem realis. 2');
    drawList.push(hamburger_1_3);
    drawList.push(new Edge('functional unit', hamburger_1, zitvoorziening));
    drawList.push(new Edge('technical solution', hamburger_1, zitbank));
    drawList.push(new Edge('functional unit', hamburger_1_1, fundatiesysteem));
    drawList.push(new Edge('technical solution', hamburger_1_1, steunlinks));
    drawList.push(new Edge('functional unit', hamburger_1_2, zitsysteem));
    drawList.push(new Edge('technical solution', hamburger_1_2, ligger));
    drawList.push(new Edge('functional unit', hamburger_1_3, fundatiesysteem));
    drawList.push(new Edge('technical solution', hamburger_1_3, steunrechts));
    drawList.push(new Edge('assembly/parts', fundatiesysteem, zitvoorziening));
    drawList.push(new Edge('assembly/parts', zitsysteem, zitvoorziening));
    drawList.push(new Edge('assembly/parts', steunlinks, zitbank));
    drawList.push(new Edge('assembly/parts', ligger, zitbank));
    drawList.push(new Edge('assembly/parts', steunrechts, zitbank));
  }

  clear(): void {
    drawList = [];
    widgets = new Map<string, Node>();
  }

  add(): void {
    console.log('add ' + this.selectedOption.label);
    let widget: Node;
    switch (this.selectedObjectType) {
      case 'Function':
        widget = new FunctionWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
      case 'Hamburger':
        widget = new HamburgerWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
      case 'Performance':
        widget = new PerformanceWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
      case 'RealisationModule':
        widget = new RealisationModuleWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
      case 'Requirement':
        widget = new RequirementWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
      case 'SystemInterface':
        widget = new SystemInterfaceWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
      case 'SystemSlot':
        widget = new SystemSlotWidget(400, 200, this.selectedOption.label, this.selectedOption.uri, this.router);
        break;
    }
    //   widget.seObject = this.selectedOption;
    //   widget.uri = this.selectedOption.uri;
    drawList.push(widget);
//    widgets.set(widget.uri, widget);
  }
}

function gameloop(): void {
  requestAnimationFrame(gameloop);
  ctx.fillStyle = 'lightgrey';
  ctx.fillRect(-windowX, -windowY, 1600, 800);
  ctx.save();
  ctx.scale(currentScale, currentScale);
  draw();
  ctx.restore();

}

function draw(): void {
  drawList.sort((a, b) => {
    return a.zIndex > b.zIndex ? 1 : -1;
  });
  for (let shapeIndex = 0; shapeIndex < drawList.length; shapeIndex++) {
    drawList[shapeIndex].draw();
  }
}

document.onkeydown = (e) => {

  // e = e ? e : window.event;
  console.log(e.keyCode + 'down');

  switch (e.keyCode) {
    case 38:
      // up
      windowY -= 10;
      ctx.translate(0, -10);
      break;
    case 40:
      // down
      windowY += 10;
      ctx.translate(0, 10);
      break;
    case 37:
      // left
      windowX -= 10;
      ctx.translate(-10, 0);
      break;
    case 39:
      // right
      windowX += 10;
      ctx.translate(10, 0);
      break;
    case 109:
      // -
      currentScale -= scaleIncrement;
      if (currentScale < minScale) {
        currentScale = minScale;
      }
      console.log('zoom out: currentScale=' + currentScale);
      break;
    case 107:
      // +
      currentScale += scaleIncrement;
      if (currentScale > maxScale) {
        currentScale = maxScale;
      }
      console.log('zoom in: currentScale=' + currentScale);
      break;
  }

};

export abstract class Shape {
  public x: number;
  public y: number;
  public zIndex: number;
  protected color: string;
  protected lineWidth: number;

  constructor() {
    this.zIndex = zIndex++;
  }

  public abstract draw(): void;
}

export class Circle extends Shape {
  constructor(public x: number,
              public y: number,
              private radius: number,
              protected color: string = 'red',
              protected lineWidth: number = 2) {
    super();
  }

  public draw(): void {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
}

export abstract class Node extends Shape {
  static selectedNode: Node;
  public typename: string;
//  public seObject: SeObject;
  public down = false;
  protected _halfWidth: number;
  protected _halfHeight: number;
  protected _anchorX = 0;
  protected _anchorY = 0;
  protected font_size: number;

  constructor(public  x: number,
              public  y: number,
              protected width: number,
              protected height: number,
              protected text: string,
              public uri?: string
  ) {
    super();
    if (this.uri) {
      widgets.set(this.uri, this);
    }
    this._halfWidth = width / 2;
    this._halfHeight = height / 2;
    this.font_size = 12;

    canvas.addEventListener('mousedown', (e) => {
      this.mouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', (e) => {
      this.mouseUp(e);
    }, false);
    canvas.addEventListener('contextmenu', (e) => {
      this.contextmenu(e);
    }, false);
  }

  public draw(): void {
    if (this.down === true && this === Node.selectedNode) {
      this.x = cursorX - this._anchorX;
      this.y = cursorY - this._anchorY;
    }

    if (this.uri) {
      this.text = this.getSeObject().label;
    }
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(this.x - this._halfWidth + 2, this.y - this._halfHeight + 2, this.width, this.height);
      ctx.fillRect(this.x - this._halfWidth + 2, this.y - this._halfHeight + 2, this.width, this.height);
    } else {
      ctx.strokeRect(this.x - this._halfWidth, this.y - this._halfHeight, this.width, this.height);
      ctx.fillRect(this.x - this._halfWidth, this.y - this._halfHeight, this.width, this.height);
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = this.font_size + 'px Verdana';
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      if (ctx.measureText(this.text).width < this.width) {
        ctx.fillText(this.text, this.x + 2, this.y + 2);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x + 2, this.y - this.height / 4 + 2);
        ctx.fillText(secondPart, this.x + 2, this.y + this.height / 4 + 2);
      }
    } else {
      if (ctx.measureText(this.text).width < this.width) {
        ctx.fillText(this.text, this.x, this.y);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x, this.y - this.height / 4);
        ctx.fillText(secondPart, this.x, this.y + this.height / 4);
      }
    }
    ctx.restore();
  }

  public getSeObject(): SeObject {
    return this.uri ? seObjects.get(this.uri) : null;
  }

  public isHit(x: number, y: number): boolean {
    console.log('x=' + x + ' this.x=' + this.x + ' this._halfWidth=' + this._halfWidth + ' windowX=' + windowX);
    return x > this.x - this._halfWidth
      && y > this.y - this._halfHeight
      && x < this.x + this._halfWidth
      && y < this.y + this._halfHeight;
  }

  public mouseDown(event: MouseEvent): void {
    console.log('event.x=' + event.x + ' event.y=' + event.y);
    if (event.button === 2) {
      return;
    }

    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;
    console.log('x=' + x + ' y=' + y + ' windowX=' + windowX + ' windowY=' + windowY);

    if (this.isHit(x, y)) {
      this._anchorX = x - this.x + windowX / currentScale;
      this._anchorY = y - this.y + windowY / currentScale;
      this.zIndex = zIndex++;
      if (Node.selectedNode) {
        if (Node.selectedNode !== this && this.zIndex > Node.selectedNode.zIndex) {
          Node.selectedNode = this;
        }
      } else {
        Node.selectedNode = this;
      }
      this.down = true;
    }
  }

  public mouseUp(event: MouseEvent): void {
    this.down = false;
  }

  public abstract contextmenu(event: MouseEvent): void ;
}

function clearMenu(menuElenent: HTMLElement): void {
  let last = menuElenent.lastChild;
  while (last = menuElenent.lastChild) {
    menuElenent.removeChild(last);
  }
}

function addMenuItem(parentElement: HTMLElement, itemName: string, action: () => void, enabled: boolean = true): void {
  const childNode = document.createElement('A');
  const textNode = document.createTextNode(itemName);
  childNode.appendChild(textNode);
  if (enabled) {
    childNode.setAttribute('style', 'color: black; padding: 4px 4px 4px 4px; ' +
      'text-decoration: none; display: block; background-color: transparent; ');
    childNode.onmouseenter = (e: MouseEvent) => {
      childNode.setAttribute('style', 'color: black; padding: 4px 4px 4px 4px; ' +
        'text-decoration: none; display: block; background-color: #ddd');
    };
    childNode.onmouseleave = (e: MouseEvent) => {
      childNode.setAttribute('style', 'color: black; padding: 4px 4px 4px 4px; ' +
        'text-decoration: none; display: block; background-color: transparent');
    };
    childNode.onclick = action;
  } else {
    childNode.setAttribute('style', 'color: grey; padding: 4px 4px 4px 4px; ' +
      'text-decoration: none; display: block; background-color: transpar[link]nt; ');
  }
  parentElement.appendChild(childNode);
}

export class Edge extends Shape {
  constructor(private label: string, private startNode: Node, private endNode: Node, private font_size: number = 10) {
    super();
    this.zIndex = 0;
  }

  draw(): void {
    // this.x = this.startNode.x + ((this.endNode.x - this.startNode.x) / 2) + canvas.offsetLeft + window.pageXOffset;
    // this.y = this.startNode.y + ((this.endNode.y - this.startNode.y) / 2) + canvas.offsetTop + window.pageYOffset;
    this.x = this.startNode.x + ((this.endNode.x - this.startNode.x) * 4 / 9);
    this.y = this.startNode.y + ((this.endNode.y - this.startNode.y) * 4 / 9);

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.moveTo(this.startNode.x, this.startNode.y);
    ctx.lineTo(this.endNode.x, this.endNode.y);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'LightGrey';
    ctx.font = this.font_size + 'px Verdana';
    const halfTxtLength = ctx.measureText(this.label).width / 2 + 2;
    ctx.fillRect(this.x - halfTxtLength, this.y - 5, 2 * halfTxtLength, 10);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(this.label, this.x, this.y);
    ctx.restore();

  }
}

export class SystemSlotWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 120, 120, label, uri);
    this.typename = 'SystemSlot';
    this.color = 'LightBlue';
  }

  public draw() {
    if (this.down === true) {
      this.x = cursorX - this._anchorX;
      this.y = cursorY - this._anchorY;
    }

    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    const numberOfSides = 8,
      size = 60,
      Xcenter = this.x,
      Ycenter = this.y;
    ctx.translate(Xcenter, Ycenter);
    ctx.rotate(Math.PI / numberOfSides);
    ctx.beginPath();
    ctx.moveTo(size * Math.cos(0), size * Math.sin(0));
    if (this.down === true) {
      ctx.globalAlpha = 0.5;
      for (let i = 1; i <= numberOfSides; i += 1) {
        ctx.lineTo(size * Math.cos(i * 2 * Math.PI / numberOfSides) + 2,
          size * Math.sin(i * 2 * Math.PI / numberOfSides) + 2);
      }
      ctx.stroke();
      ctx.closePath(); // automatically moves back to bottom left corner
      ctx.fill();
    } else {
      for (let i = 1; i <= numberOfSides; i += 1) {
        ctx.lineTo(size * Math.cos(i * 2 * Math.PI / numberOfSides),
          size * Math.sin(i * 2 * Math.PI / numberOfSides));
      }
      ctx.stroke();
      ctx.closePath(); // automatically moves back to bottom left corner
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = this.font_size + 'px Verdana';
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      if (ctx.measureText(this.text).width < this.width) {
        ctx.fillText(this.text, this.x + 2, this.y + 2);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x + 2, this.y - this.height / 8 + 2);
        ctx.fillText(secondPart, this.x + 2, this.y + this.height / 8 + 2);
      }
    } else {
      if (ctx.measureText(this.text).width < this.width) {
        ctx.fillText(this.text, this.x, this.y);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x, this.y - this.height / 8);
        ctx.fillText(secondPart, this.x, this.y + this.height / 8);
      }
    }
    ctx.restore();
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<SystemSlot>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<SystemSlot>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'functions', this.getFunctions, (<SystemSlot>this.getSeObject()).functions != null);
      addMenuItem(myDropDown, 'requirements', this.getRequirements, (<SystemSlot>this.getSeObject()).requirements != null);
      addMenuItem(myDropDown, 'interfaces', this.getInterfaces, (<SystemSlot>this.getSeObject()).interfaces != null);
      addMenuItem(myDropDown, 'hamburgers', this.getHamburgers, (<SystemSlot>this.getSeObject()).hamburgers != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/systemslots', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<SystemSlot>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const systemSlotWidget =
          new SystemSlotWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, systemSlotWidget));
        drawList.push(systemSlotWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<SystemSlot>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const systemSlotWidget =
            new SystemSlotWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, systemSlotWidget));
          drawList.push(systemSlotWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getFunctions = () => {
    const functions = (<SystemSlot>this.getSeObject()).functions;
    if (functions && functions.length > 0) {
      for (let i = 0; i < functions.length; i++) {
        if (widgets.has(functions[i].uri)) {
          drawList.push(new Edge('function', this, widgets.get(functions[i].uri)));
        } else {
          const functionWidget =
            new FunctionWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, functions[i].label, functions[i].uri, this.router);
          drawList.push(new Edge('function', this, functionWidget));
          drawList.push(functionWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getRequirements = () => {
    const requirements = (<SystemSlot>this.getSeObject()).requirements;
    if (requirements && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        if (widgets.has(requirements[i].uri)) {
          drawList.push(new Edge('requirement', this, widgets.get(requirements[i].uri)));
        } else {
          const requirementWidget =
            new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, requirements[i].label, requirements[i].uri, this.router);
          drawList.push(new Edge('requirement', this, requirementWidget));
          drawList.push(requirementWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getInterfaces = () => {
    const interfaces = (<SystemSlot>this.getSeObject()).interfaces;
    if (interfaces && interfaces.length > 0) {
      for (let i = 0; i < interfaces.length; i++) {
        if (widgets.has(interfaces[i].uri)) {
          drawList.push(new Edge('interface', this, widgets.get(interfaces[i].uri)));
        } else {
          const systemInterfaceWidget =
            new SystemInterfaceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, interfaces[i].label, interfaces[i].uri, this.router);
          drawList.push(new Edge('interface', this, systemInterfaceWidget));
          drawList.push(systemInterfaceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getHamburgers = () => {
    const hamburgers = (<SystemSlot>this.getSeObject()).hamburgers;
    if (hamburgers && hamburgers.length > 0) {
      for (let i = 0; i < hamburgers.length; i++) {
        if (widgets.has(hamburgers[i].uri)) {
          drawList.push(new Edge('hamburger', this, widgets.get(hamburgers[i].uri)));
        } else {
          const hamburgerWidget =
            new HamburgerWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, hamburgers[i].label, hamburgers[i].uri, this.router);
          drawList.push(new Edge('hamburger', this, hamburgerWidget));
          drawList.push(hamburgerWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class SystemInterfaceWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 160, 50, label, uri);
    this.typename = 'SystemInterface';
    this.color = 'DarkGrey';
  }

  contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<SystemInterface>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<SystemInterface>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'systemslots', this.getSystemSlots,
        (<SystemInterface>this.getSeObject()).systemSlot0 != null || (<SystemInterface>this.getSeObject()).systemSlot1 != null);
      addMenuItem(myDropDown, 'requirements', this.getRequirements, (<SystemInterface>this.getSeObject()).requirements != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/systeminterfaces', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<SystemInterface>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const systemInterfaceWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, systemInterfaceWidget));
        drawList.push(systemInterfaceWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<SystemInterface>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const systemInterfaceWidget =
            new SystemInterfaceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, systemInterfaceWidget));
          drawList.push(systemInterfaceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getSystemSlots = () => {
    const systemSlot0 = (<SystemInterface>this.getSeObject()).systemSlot0;
    const systemSlot1 = (<SystemInterface>this.getSeObject()).systemSlot1;
    if (systemSlot0) {
      if (widgets.get(systemSlot0.uri)) {
        drawList.push(new Edge('systemslot', this, widgets.get(systemSlot0.uri)));
      } else {
        const systemSlot0Widget =
          new SystemSlotWidget(this.x + 100, this.y + 100, systemSlot0.label, systemSlot0.uri, this.router);
        drawList.push(new Edge('systemslot', this, systemSlot0Widget));
        drawList.push(systemSlot0Widget);
      }
    }
    if (systemSlot1) {
      if (widgets.get(systemSlot1.uri)) {
        drawList.push(new Edge('systemslot', this, widgets.get(systemSlot1.uri)));
      } else {
        const systemSlot0Widget = new SystemSlotWidget(this.x + 100, this.y + 100, systemSlot1.label, systemSlot1.uri, this.router);
        drawList.push(new Edge('systemslot', this, systemSlot0Widget));
        drawList.push(systemSlot0Widget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getRequirements = () => {
    const requirements = (<SystemInterface>this.getSeObject()).requirements;
    if (requirements && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        if (widgets.has(requirements[i].uri)) {
          drawList.push(new Edge('requirement', this, widgets.get(requirements[i].uri)));
        } else {
          const requirementWidget =
            new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, requirements[i].label, requirements[i].uri, this.router);
          drawList.push(new Edge('requirement', this, requirementWidget));
          drawList.push(requirementWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class FunctionWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 160, 50, label, uri);
    this.typename = 'Function';
    this.color = 'Plum';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Function>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Function>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'input', this.getInput, (<Function>this.getSeObject()).input != null);
      addMenuItem(myDropDown, 'output', this.getOutput, (<Function>this.getSeObject()).output != null);
      addMenuItem(myDropDown, 'requirements', this.getRequirements, (<Function>this.getSeObject()).requirements != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/functions', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Function>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const functionWidget = new FunctionWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, functionWidget));
        drawList.push(functionWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Function>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const functionWidget = new FunctionWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, functionWidget));
          drawList.push(functionWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getInput = () => {
    const input = (<Function>this.getSeObject()).input;
    if (input) {
      if (widgets.get(input.uri)) {
        drawList.push(new Edge('input', this, widgets.get(input.uri)));
      } else {
        const inputWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, input.label, input.uri, this.router);
        drawList.push(new Edge('input', this, inputWidget));
        drawList.push(inputWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getOutput = () => {
    const output = (<Function>this.getSeObject()).output;
    if (output) {
      if (widgets.get(output.uri)) {
        drawList.push(new Edge('output', this, widgets.get(output.uri)));
      } else {
        const outputWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, output.label, output.uri, this.router);
        drawList.push(new Edge('output', this, outputWidget));
        drawList.push(outputWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getRequirements = () => {
    const requirements = (<Function>this.getSeObject()).requirements;
    if (requirements && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        if (widgets.has(requirements[i].uri)) {
          drawList.push(new Edge('requirement', this, widgets.get(requirements[i].uri)));
        } else {
          const requirementWidget =
            new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, requirements[i].label, requirements[i].uri, this.router);
          drawList.push(new Edge('requirement', this, requirementWidget));
          drawList.push(requirementWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class RequirementWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 160, 50, label, uri);
    this.typename = 'Requirment';
    this.color = 'Gold';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Requirement>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Requirement>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'min value', this.getMinValue, (<Requirement>this.getSeObject()).minValue != null);
      addMenuItem(myDropDown, 'max value', this.getMaxValue, (<Requirement>this.getSeObject()).maxValue != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/requirements', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Requirement>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const requirementWidget = new RequirementWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, requirementWidget));
        drawList.push(requirementWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Requirement>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const requirementWidget =
            new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, requirementWidget));
          drawList.push(requirementWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getMinValue = () => {
    const minValue = (<Requirement>this.getSeObject()).minValue;
    if (minValue) {
      if (widgets.get(minValue.uri)) {
        drawList.push(new Edge('min value', this, widgets.get(minValue.uri)));
      } else {
        const numericValueWidget = new NumericValueWidget(this.x + 100, this.y + 100, minValue.label, minValue.uri, this.router);
        drawList.push(new Edge('min value', this, numericValueWidget));
        drawList.push(numericValueWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getMaxValue = () => {
    const maxValue = (<Requirement>this.getSeObject()).maxValue;
    if (maxValue) {
      if (widgets.get(maxValue.uri)) {
        drawList.push(new Edge('max value', this, widgets.get(maxValue.uri)));
      } else {
        const numericValueWidget = new NumericValueWidget(this.x + 100, this.y + 100, maxValue.label, maxValue.uri, this.router);
        drawList.push(new Edge('max value', this, numericValueWidget));
        drawList.push(numericValueWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class RealisationModuleWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 110, 110, label, uri);
    this.typename = 'RealisationModule';
    this.color = 'LightGreen';
  }

  public draw(): void {
    if (this.down === true && this === Node.selectedNode) {
      this.x = cursorX - this._anchorX;
      this.y = cursorY - this._anchorY;
    }

    if (this.uri) {
      this.text = this.getSeObject().label;
    }
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.x + 2, this.y + 2, this.width / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = this.font_size + 'px Verdana';
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, this.x + 2, this.y + 2);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x + 2, this.y - this.height / 6 + 2);
        ctx.fillText(secondPart, this.x + 2, this.y + this.height / 6 + 2);
      }
    } else {
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, this.x, this.y);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x, this.y - this.height / 6);
        ctx.fillText(secondPart, this.x, this.y + this.height / 6);
      }
    }
    ctx.restore();
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<RealisationModule>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<RealisationModule>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'ports', this.getPorts, (<RealisationModule>this.getSeObject()).ports != null);
      addMenuItem(myDropDown, 'performances', this.getPerformances, (<RealisationModule>this.getSeObject()).performances != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/realisationmodules', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<RealisationModule>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const realisationModuleWidget = new RealisationModuleWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, realisationModuleWidget));
        drawList.push(realisationModuleWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<RealisationModule>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const realisationModuleWidget =
            new RealisationModuleWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, realisationModuleWidget));
          drawList.push(realisationModuleWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPorts = () => {
    const ports = (<RealisationModule>this.getSeObject()).ports;
    if (ports && ports.length > 0) {
      for (let i = 0; i < ports.length; i++) {
        if (widgets.has(ports[i].uri)) {
          drawList.push(new Edge('port', this, widgets.get(ports[i].uri)));
        } else {
          const realisationPortWidget =
            new RealisationPortWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, ports[i].label, ports[i].uri, this.router);
          drawList.push(new Edge('port', this, realisationPortWidget));
          drawList.push(realisationPortWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPerformances = () => {
    const performances = (<RealisationModule>this.getSeObject()).performances;
    if (performances && performances.length > 0) {
      for (let i = 0; i < performances.length; i++) {
        if (widgets.has(performances[i].uri)) {
          drawList.push(new Edge('performance', this, widgets.get(performances[i].uri)));
        } else {
          const performanceWidget =
            new PerformanceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, performances[i].label, performances[i].uri, this.router);
          drawList.push(new Edge('performance', this, performanceWidget));
          drawList.push(performanceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class RealisationPortWidget extends Node {
  public rotateState = 0;

  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 90, 90, label, uri);
    this.typename = 'RealisationPort';
    this.color = 'LightGreen';
  }

  public draw(): void {
    if (this.down === true && this === Node.selectedNode) {
      this.x = cursorX - this._anchorX;
      this.y = cursorY - this._anchorY;
    }

    if (this.uri) {
      this.text = this.getSeObject().label;
    }
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    const rotation = this.rotateState * Math.PI / 2;
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.x + 2, this.y + 2, this.width / 2, Math.PI + rotation, Math.PI * 2 + rotation);
      switch (this.rotateState) {
        case 0:
          ctx.moveTo(this.x - this._halfWidth + 2, this.y + 2);
          ctx.lineTo(this.x + this._halfWidth + 2, this.y + 2);
          break;
        case 1:
          ctx.moveTo(this.x + 2, this.y - this._halfHeight + 2);
          ctx.lineTo(this.x + 2, this.y + this._halfHeight + 2);
          break;
        case 2:
          ctx.moveTo(this.x - this._halfWidth + 2, this.y + 2);
          ctx.lineTo(this.x + this._halfWidth + 2, this.y + 2);
          break;
        case 3:
          ctx.moveTo(this.x + 2, this.y - this._halfHeight + 2);
          ctx.lineTo(this.x + 2, this.y + this._halfHeight + 2);
          break;
      }
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, Math.PI + rotation, Math.PI * 2 + rotation);
      switch (this.rotateState) {
        case 0:
          ctx.moveTo(this.x - this._halfWidth, this.y);
          ctx.lineTo(this.x + this._halfWidth, this.y);
          break;
        case 1:
          ctx.moveTo(this.x, this.y - this._halfHeight);
          ctx.lineTo(this.x, this.y + this._halfHeight);
          break;
        case 2:
          ctx.moveTo(this.x - this._halfWidth, this.y);
          ctx.lineTo(this.x + this._halfWidth, this.y);
          break;
        case 3:
          ctx.moveTo(this.x, this.y - this._halfHeight);
          ctx.lineTo(this.x, this.y + this._halfHeight);
          break;
      }
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = (this.font_size - 2) + 'px Verdana';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotateState !== 2 ? this.rotateState * Math.PI / 2 : 0);
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, 2, (this.rotateState !== 2 ? this.height / -6 : this.height / 6) + 2);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        // ctx.fillText(firstPart, this.x + 2, this.y - this.height / 3 + 2);
        // ctx.fillText(secondPart, this.x + 2, this.y - this.height / 6 + 2);
        ctx.fillText(firstPart, 2, (this.rotateState !== 2 ? this.height / -3 : this.height / 6) + 2);
        ctx.fillText(secondPart, 2, (this.rotateState !== 2 ? this.height / -6 : this.height / 3) + 2);
      }
    } else {
      if (ctx.measureText(this.text).width < this.width - 4) {
        // ctx.fillText(this.text, this.x, this.y);
        ctx.fillText(this.text, 0, this.rotateState !== 2 ? this.height / -6 : this.height / 6);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        // ctx.fillText(firstPart, this.x, this.y - this.height / 3);
        // ctx.fillText(secondPart, this.x, this.y - this.height / 6);
        ctx.fillText(firstPart, 0, this.rotateState !== 2 ? this.height / -3 : this.height / 6);
        ctx.fillText(secondPart, 0, this.rotateState !== 2 ? this.height / -6 : this.height / 3);
      }
    }
    ctx.restore();
  }

  contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<RealisationPort>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<RealisationPort>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'performances', null, (<RealisationModule>this.getSeObject()).performances != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, 'rotate', this.rotate, true);
      myDropDown.classList.toggle('show');
    }
  }

  rotate = () => {
    this.rotateState++;
    if (this.rotateState > 3) {
      this.rotateState = 0;
    }
  };

  getAssembly = () => {
    const assembly = (<RealisationPort>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const realisationPortWidget = new RealisationPortWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, realisationPortWidget));
        drawList.push(realisationPortWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<RealisationPort>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const realisationPortWidget =
            new RealisationPortWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, realisationPortWidget));
          drawList.push(realisationPortWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPerformances = () => {
    const performances = (<RealisationPort>this.getSeObject()).performances;
    if (performances && performances.length > 0) {
      for (let i = 0; i < performances.length; i++) {
        if (widgets.has(performances[i].uri)) {
          drawList.push(new Edge('performance', this, widgets.get(performances[i].uri)));
        } else {
          const performanceWidget =
            new PerformanceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, performances[i].label, performances[i].uri, this.router);
          drawList.push(new Edge('performance', this, performanceWidget));
          drawList.push(performanceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class HamburgerWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 110, 110, label, uri);
    this.typename = 'Hamburger';
    this.color = 'LightSalmon';
  }

  public draw(): void {
    if (this.down === true && this === Node.selectedNode) {
      this.x = cursorX - this._anchorX;
      this.y = cursorY - this._anchorY;
    }

    if (this.uri) {
      this.text = this.getSeObject().label;
    }
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.x + 2, this.y + 2, this.width / 2, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + 2, this.y + 2, this.width / 2, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'LightBlue';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'LightBlue';
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = this.font_size + 'px Verdana';
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, this.x + 2, this.y + 2);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x + 2, this.y - this.height / 6 + 2);
        ctx.fillText(secondPart, this.x + 2, this.y + this.height / 6 + 2);
      }
    } else {
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, this.x, this.y);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x, this.y - this.height / 6);
        ctx.fillText(secondPart, this.x, this.y + this.height / 6);
      }
    }
    ctx.restore();
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Hamburger>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Hamburger>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'functional unit', this.getFunctionalUnit, (<Hamburger>this.getSeObject()).functionalUnit != null);
      addMenuItem(myDropDown, 'technical solution', this.getTechnicalSolution, (<Hamburger>this.getSeObject()).technicalSolution != null);
      addMenuItem(myDropDown, 'port realisations', this.getPortRealisations, (<Hamburger>this.getSeObject()).portRealisations != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/hamburgers', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Hamburger>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const hamburgerWidget = new HamburgerWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, hamburgerWidget));
        drawList.push(hamburgerWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Hamburger>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const hamburgerWidget =
            new HamburgerWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, hamburgerWidget));
          drawList.push(hamburgerWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getFunctionalUnit = () => {
    const functionalUnit = (<Hamburger>this.getSeObject()).functionalUnit;
    if (functionalUnit) {
      if (widgets.get(functionalUnit.uri)) {
        drawList.push(new Edge('functional unit', this, widgets.get(functionalUnit.uri)));
      } else {
        const systemSlotWidget = new SystemSlotWidget(this.x + 100, this.y + 100, functionalUnit.label, functionalUnit.uri, this.router);
        drawList.push(new Edge('functional unit', this, systemSlotWidget));
        drawList.push(systemSlotWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getTechnicalSolution = () => {
    const technicalSolution = (<Hamburger>this.getSeObject()).technicalSolution;
    if (technicalSolution) {
      if (widgets.get(technicalSolution.uri)) {
        drawList.push(new Edge('technical solution', this, widgets.get(technicalSolution.uri)));
      } else {
        const realisationModuleWidget =
          new RealisationModuleWidget(this.x + 100, this.y + 100, technicalSolution.label, technicalSolution.uri, this.router);
        drawList.push(new Edge('technical solution', this, realisationModuleWidget));
        drawList.push(realisationModuleWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPortRealisations = () => {
    const portRealisations = (<Hamburger>this.getSeObject()).portRealisations;
    if (portRealisations && portRealisations.length > 0) {
      for (let i = 0; i < portRealisations.length; i++) {
        if (widgets.has(portRealisations[i].uri)) {
          drawList.push(new Edge('port realisation', this, widgets.get(portRealisations[i].uri)));
        } else {
          const portRealisationWidget =
            new PortRealisationWidget(this.x + 100 + i * 8, this.y + 100 + i * 8,
              portRealisations[i].label, portRealisations[i].uri, this.router);
          drawList.push(new Edge('port realisation', this, portRealisationWidget));
          drawList.push(portRealisationWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class PortRealisationWidget extends Node {

  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 90, 90, label, uri);
    this.typename = 'PortRealisation';
    this.color = 'LightSalmon';
  }

  public draw(): void {
    if (this.down === true && this === Node.selectedNode) {
      this.x = cursorX - this._anchorX;
      this.y = cursorY - this._anchorY;
    }

    if (this.uri) {
      this.text = this.getSeObject().label;
    }
    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.x + 2, this.y + 2, this.width / 2, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + 2, this.y + 2, this.width / 2, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'DarkGrey';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'LightGreen';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'DarkGrey';
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.font = (this.font_size - 2) + 'px Verdana';
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, this.x + 2, this.y + 2);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x + 2, this.y - this.height / 6 + 2);
        ctx.fillText(secondPart, this.x + 2, this.y + this.height / 6 + 2);
      }
    } else {
      if (ctx.measureText(this.text).width < this.width - 4) {
        ctx.fillText(this.text, this.x, this.y);
      } else {
        const firstPart = this.text.substring(0, this.text.length / 2);
        const secondPart = this.text.substring(this.text.length / 2);
        ctx.fillText(firstPart, this.x, this.y - this.height / 6);
        ctx.fillText(secondPart, this.x, this.y + this.height / 6);
      }
    }
    ctx.restore();
  }

  contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<PortRealisation>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<PortRealisation>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'interface', this.getInterface, (<PortRealisation>this.getSeObject()).interface != null);
      addMenuItem(myDropDown, 'port', this.getPort, (<PortRealisation>this.getSeObject()).port != null);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<PortRealisation>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const portRealisationWidget =
          new PortRealisationWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, portRealisationWidget));
        drawList.push(portRealisationWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<PortRealisation>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const portRealisationWidget =
            new PortRealisationWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, portRealisationWidget));
          drawList.push(portRealisationWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getInterface = () => {
    const systemInterface = (<PortRealisation>this.getSeObject()).interface;
    if (systemInterface) {
      if (widgets.get(systemInterface.uri)) {
        drawList.push(new Edge('interface', this, widgets.get(systemInterface.uri)));
      } else {
        const systemInterfaceWidget =
          new SystemInterfaceWidget(this.x + 100, this.y + 100, systemInterface.label, systemInterface.uri, this.router);
        drawList.push(new Edge('interface', this, systemInterfaceWidget));
        drawList.push(systemInterfaceWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPort = () => {
    const port = (<PortRealisation>this.getSeObject()).port;
    if (port) {
      if (widgets.get(port.uri)) {
        drawList.push(new Edge('port', this, widgets.get(port.uri)));
      } else {
        const realisationPortWidget = new RealisationPortWidget(this.x + 100, this.y + 100, port.label, port.uri, this.router);
        drawList.push(new Edge('port', this, realisationPortWidget));
        drawList.push(realisationPortWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class PerformanceWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 160, 50, label, uri);
    this.typename = 'Performance';
    this.color = 'YellowGreen';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = (event.x - windowX - canvas.offsetLeft + window.pageXOffset) / currentScale;
    const y: number = (event.y - windowY - canvas.offsetTop + window.pageYOffset) / currentScale;


    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x * currentScale + windowX + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y * currentScale + windowY + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Performance>this.getSeObject()).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Performance>this.getSeObject()).parts != null);
      addMenuItem(myDropDown, 'value', this.getValue, (<Performance>this.getSeObject()).value != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/performances', {id: this.getSeObject().uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Performance>this.getSeObject()).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const performanceWidget = new PerformanceWidget(this.x + 100, this.y + 100, assembly.label, assembly.uri, this.router);
        drawList.push(new Edge('assembly', this, performanceWidget));
        drawList.push(performanceWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Performance>this.getSeObject()).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const performanceWidget =
            new PerformanceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, parts[i].uri, this.router);
          drawList.push(new Edge('part', this, performanceWidget));
          drawList.push(performanceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getValue = () => {
    const value = (<Performance>this.getSeObject()).value;
    if (value) {
      if (widgets.get(value.uri)) {
        drawList.push(new Edge('value', this, widgets.get(value.uri)));
      } else {
        const numericValueWidget = new NumericValueWidget(this.x + 100, this.y + 100, value.label, value.uri, this.router);
        drawList.push(new Edge('value', this, numericValueWidget));
        drawList.push(numericValueWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class NumericValueWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public uri?: string, public router?: Router) {
    super(x, y, 160, 50, label, uri);
    this.typename = 'NumericValue';
    this.color = 'white';
  }

  contextmenu(event: MouseEvent): void {
  }
}
