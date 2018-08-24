import {Component, OnInit} from '@angular/core';
import {SystemSlotService} from '../system-slot.service';
import {DatasetService} from '../dataset.service';
import {
  Function,
  Hamburger,
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

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
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
        }
      });
    this._hamburgerService.queryAllHamburgers(dataset ? this._datasetService.getSelectedDataset().datasetId : 0);
    this._realisationModuleService.allRealisationModulesUpdated
      .subscribe(allRealisationModules => {
        this.allRealisationModules = allRealisationModules;
        for (let i = 0; i < allRealisationModules.length; i++) {
          seObjects.set(allRealisationModules[i].uri, allRealisationModules[i]);
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
    document.onmousemove = (event: MouseEvent) => {
      cursorX = event.x - canvas.offsetLeft + window.pageXOffset;
      cursorY = event.y - canvas.offsetTop + window.pageYOffset;
    };
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
        widget = new FunctionWidget(400, 200, this.selectedOption.label, this.router);
        break;
      case 'Hamburger':
        widget = new HamburgerWidget(400, 200, this.selectedOption.label, this.router);
        break;
      case 'Performance':
        widget = new PerformanceWidget(400, 200, this.selectedOption.label, this.router);
        break;
      case 'RealisationModule':
        widget = new RealisationModuleWidget(400, 200, this.selectedOption.label, this.router);
        break;
      case 'Requirement':
        widget = new RequirementWidget(400, 200, this.selectedOption.label, this.router);
        break;
      case 'SystemInterface':
        widget = new SystemInterfaceWidget(400, 200, this.selectedOption.label, this.router);
        break;
      case 'SystemSlot':
        widget = new SystemSlotWidget(400, 200, this.selectedOption.label, this.router);
        break;
    }
    widget.seObject = this.selectedOption;
    drawList.push(widget);
    widgets.set(this.selectedOption.uri, widget);
  }
}

function gameloop(): void {
  requestAnimationFrame(gameloop);
  ctx.fillStyle = 'lightgrey';
  ctx.fillRect(0, 0, 1600, 800);

  draw();
}

function draw(): void {
  drawList.sort((a, b) => {
    return a.zIndex > b.zIndex ? 1 : -1;
  });
  for (let shapeIndex = 0; shapeIndex < drawList.length; shapeIndex++) {
    drawList[shapeIndex].draw();
  }
}

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
  public seObject: SeObject;
  public down = false;
  protected _halfWidth: number;
  protected _halfHeight: number;
  protected _anchorX = 0;
  protected _anchorY = 0;

  constructor(public  x: number,
              public  y: number,
              protected width: number,
              protected height: number,
              protected text: string,
              protected font_size: number = 12) {
    super();
    this._halfWidth = width / 2;
    this._halfHeight = height / 2;

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

    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = this.color;
    if (this.down === true && this === Node.selectedNode) {
      ctx.globalAlpha = 0.5;
      ctx.strokeRect(this.x - this._halfWidth + 2, this.y - this._halfHeight + 2, this.width, this.height);
      ctx.rect(this.x - this._halfWidth + 2, this.y - this._halfHeight + 2, this.width, this.height);
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
      ctx.fillText(this.text, this.x + 2, this.y + 2);
    } else {
      ctx.fillText(this.text, this.x, this.y);
    }
    ctx.restore();
  }

  public isHit(x: number, y: number): boolean {
    return x > this.x - this._halfWidth
      && y > this.y - this._halfHeight
      && x < this.x + this._halfWidth
      && y < this.y + this._halfHeight;
  }

  public mouseDown(event: MouseEvent): void {
    console.log('mouseDown');
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;

    if (this.isHit(x, y)) {
      this.down = true;
      this.zIndex = zIndex++;
      if (Node.selectedNode) {
        if (this.zIndex > Node.selectedNode.zIndex) {
          Node.selectedNode = this;
          this._anchorX = x - this.x;
          this._anchorY = y - this.y;
        }
      } else {
        Node.selectedNode = this;
        this._anchorX = x - this.x;
        this._anchorY = y - this.y;
      }
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
    this.x = this.startNode.x + ((this.endNode.x - this.startNode.x) / 3);
    this.y = this.startNode.y + ((this.endNode.y - this.startNode.y) / 3);

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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'SystemSlot';
    this.color = 'LightBlue';
  }

  // public draw() {
  //   if (this.down === true) {
  //     this.x = cursorX - this._anchorX;
  //     this.y = cursorY - this._anchorY;
  //   }
  //
  //   ctx.save();
  //   ctx.lineWidth = 4;
  //   ctx.strokeStyle = 'black';
  //   ctx.fillStyle = this.color;
  //   const numberOfSides = 8,
  //     size = 75,
  //     Xcenter = this.x,
  //     Ycenter = this.y;
  //   ctx.beginPath();
  //   ctx.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0));
  //   if (this.down === true) {
  //     ctx.globalAlpha = 0.5;
  //     for (let i = 1; i <= numberOfSides; i += 1) {
  //       ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides) + 2,
  //         Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides) + 2);
  //     }
  //     ctx.stroke();
  //     ctx.closePath(); // automatically moves back to bottom left corner
  //     ctx.fill();
  //   } else {
  //     for (let i = 1; i <= numberOfSides; i += 1) {
  //       ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides),
  //         Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
  //     }
  //     ctx.stroke();
  //     ctx.closePath(); // automatically moves back to bottom left corner
  //     ctx.fill();
  //   }
  //   ctx.restore();
  //
  //   ctx.save();
  //   ctx.beginPath();
  //   ctx.textAlign = 'center';
  //   ctx.textBaseline = 'middle';
  //   ctx.fillStyle = 'black';
  //   ctx.font = this.font_size + 'px Verdana';
  //   if (this.down === true) {
  //     ctx.globalAlpha = 0.5;
  //     ctx.fillText(this.text, this.x + 2, this.y + 2);
  //   } else {
  //     ctx.fillText(this.text, this.x, this.y);
  //   }
  //   ctx.restore();
  // }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<SystemSlot>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<SystemSlot>this.seObject).parts != null);
      addMenuItem(myDropDown, 'functions', this.getFunctions, (<SystemSlot>this.seObject).functions != null);
      addMenuItem(myDropDown, 'requirements', this.getRequirements, (<SystemSlot>this.seObject).requirements != null);
      addMenuItem(myDropDown, 'interfaces', this.getInterfaces, (<SystemSlot>this.seObject).interfaces != null);
      addMenuItem(myDropDown, 'hamburgers', this.getHamburgers, (<SystemSlot>this.seObject).hamburgers != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/systemslots', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<SystemSlot>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const systemSlotWidget = new SystemSlotWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        systemSlotWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, systemSlotWidget);
        drawList.push(new Edge('assembly', this, systemSlotWidget));
        drawList.push(systemSlotWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<SystemSlot>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const systemSlotWidget = new SystemSlotWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          systemSlotWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, systemSlotWidget);
          drawList.push(new Edge('part', this, systemSlotWidget));
          drawList.push(systemSlotWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getFunctions = () => {
    const functions = (<SystemSlot>this.seObject).functions;
    if (functions && functions.length > 0) {
      for (let i = 0; i < functions.length; i++) {
        if (widgets.has(functions[i].uri)) {
          drawList.push(new Edge('function', this, widgets.get(functions[i].uri)));
        } else {
          const functionWidget = new FunctionWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, functions[i].label, this.router);
          functionWidget.seObject = seObjects.get(functions[i].uri);
          widgets.set(functions[i].uri, functionWidget);
          drawList.push(new Edge('function', this, functionWidget));
          drawList.push(functionWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getRequirements = () => {
    const requirements = (<SystemSlot>this.seObject).requirements;
    if (requirements && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        if (widgets.has(requirements[i].uri)) {
          drawList.push(new Edge('requirement', this, widgets.get(requirements[i].uri)));
        } else {
          const requirementWidget = new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, requirements[i].label, this.router);
          requirementWidget.seObject = seObjects.get(requirements[i].uri);
          widgets.set(requirements[i].uri, requirementWidget);
          drawList.push(new Edge('requirement', this, requirementWidget));
          drawList.push(requirementWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getInterfaces = () => {
    const interfaces = (<SystemSlot>this.seObject).interfaces;
    if (interfaces && interfaces.length > 0) {
      for (let i = 0; i < interfaces.length; i++) {
        if (widgets.has(interfaces[i].uri)) {
          drawList.push(new Edge('interface', this, widgets.get(interfaces[i].uri)));
        } else {
          const systemInterfaceWidget =
            new SystemInterfaceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, interfaces[i].label, this.router);
          systemInterfaceWidget.seObject = seObjects.get(interfaces[i].uri);
          widgets.set(interfaces[i].uri, systemInterfaceWidget);
          drawList.push(new Edge('interface', this, systemInterfaceWidget));
          drawList.push(systemInterfaceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getHamburgers = () => {
    const hamburgers = (<SystemSlot>this.seObject).hamburgers;
    if (hamburgers && hamburgers.length > 0) {
      for (let i = 0; i < hamburgers.length; i++) {
        if (widgets.has(hamburgers[i].uri)) {
          drawList.push(new Edge('hamburger', this, widgets.get(hamburgers[i].uri)));
        } else {
          const hamburgerWidget = new HamburgerWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, hamburgers[i].label, this.router);
          hamburgerWidget.seObject = seObjects.get(hamburgers[i].uri);
          widgets.set(hamburgers[i].uri, hamburgerWidget);
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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'SystemInterface';
    this.color = 'DarkGrey';
  }

  contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + canvas.offsetLeft + 'px';
      myDropDown.style.top = this.y + canvas.offsetTop + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<SystemInterface>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<SystemInterface>this.seObject).parts != null);
      addMenuItem(myDropDown, 'systemslots', this.getSystemSlots,
        (<SystemInterface>this.seObject).systemSlot0 != null || (<SystemInterface>this.seObject).systemSlot1 != null);
      addMenuItem(myDropDown, 'requirements', this.getRequirements, (<SystemInterface>this.seObject).requirements != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/systeminterfaces', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<SystemInterface>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const systemInterfaceWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        systemInterfaceWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, systemInterfaceWidget);
        drawList.push(new Edge('assembly', this, systemInterfaceWidget));
        drawList.push(systemInterfaceWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<SystemInterface>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const systemInterfaceWidget = new SystemInterfaceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          systemInterfaceWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, systemInterfaceWidget);
          drawList.push(new Edge('part', this, systemInterfaceWidget));
          drawList.push(systemInterfaceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getSystemSlots = () => {
    const systemSlot0 = (<SystemInterface>this.seObject).systemSlot0;
    const systemSlot1 = (<SystemInterface>this.seObject).systemSlot1;
    if (systemSlot0) {
      if (widgets.get(systemSlot0.uri)) {
        drawList.push(new Edge('systemslot', this, widgets.get(systemSlot0.uri)));
      } else {
        const systemSlot0Widget = new SystemSlotWidget(this.x + 100, this.y + 100, systemSlot0.label, this.router);
        systemSlot0Widget.seObject = seObjects.get(systemSlot0.uri);
        widgets.set(systemSlot0.uri, systemSlot0Widget);
        drawList.push(new Edge('systemslot', this, systemSlot0Widget));
        drawList.push(systemSlot0Widget);
      }
    }
    if (systemSlot1) {
      if (widgets.get(systemSlot1.uri)) {
        drawList.push(new Edge('systemslot', this, widgets.get(systemSlot1.uri)));
      } else {
        const systemSlot0Widget = new SystemSlotWidget(this.x + 100, this.y + 100, systemSlot1.label, this.router);
        systemSlot0Widget.seObject = seObjects.get(systemSlot1.uri);
        widgets.set(systemSlot1.uri, systemSlot0Widget);
        drawList.push(new Edge('systemslot', this, systemSlot0Widget));
        drawList.push(systemSlot0Widget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getRequirements = () => {
    const requirements = (<SystemInterface>this.seObject).requirements;
    if (requirements && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        if (widgets.has(requirements[i].uri)) {
          drawList.push(new Edge('requirement', this, widgets.get(requirements[i].uri)));
        } else {
          const requirementWidget = new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, requirements[i].label, this.router);
          requirementWidget.seObject = seObjects.get(requirements[i].uri);
          widgets.set(requirements[i].uri, requirementWidget);
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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'Function';
    this.color = 'Plum';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Function>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Function>this.seObject).parts != null);
      addMenuItem(myDropDown, 'input', this.getInput, (<Function>this.seObject).input != null);
      addMenuItem(myDropDown, 'output', this.getOutput, (<Function>this.seObject).output != null);
      addMenuItem(myDropDown, 'requirements', this.getRequirements, (<Function>this.seObject).requirements != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/functions', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Function>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const functionWidget = new FunctionWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        functionWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, functionWidget);
        drawList.push(new Edge('assembly', this, functionWidget));
        drawList.push(functionWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Function>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const functionWidget = new FunctionWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          functionWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, functionWidget);
          drawList.push(new Edge('part', this, functionWidget));
          drawList.push(functionWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getInput = () => {
    const input = (<Function>this.seObject).input;
    if (input) {
      if (widgets.get(input.uri)) {
        drawList.push(new Edge('input', this, widgets.get(input.uri)));
      } else {
        const inputWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, input.label, this.router);
        inputWidget.seObject = seObjects.get(input.uri);
        widgets.set(input.uri, inputWidget);
        drawList.push(new Edge('input', this, inputWidget));
        drawList.push(inputWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getOutput = () => {
    const output = (<Function>this.seObject).output;
    if (output) {
      if (widgets.get(output.uri)) {
        drawList.push(new Edge('output', this, widgets.get(output.uri)));
      } else {
        const outputWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, output.label, this.router);
        outputWidget.seObject = seObjects.get(output.uri);
        widgets.set(output.uri, outputWidget);
        drawList.push(new Edge('output', this, outputWidget));
        drawList.push(outputWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getRequirements = () => {
    const requirements = (<Function>this.seObject).requirements;
    if (requirements && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        if (widgets.has(requirements[i].uri)) {
          drawList.push(new Edge('requirement', this, widgets.get(requirements[i].uri)));
        } else {
          const requirementWidget = new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, requirements[i].label, this.router);
          requirementWidget.seObject = seObjects.get(requirements[i].uri);
          widgets.set(requirements[i].uri, requirementWidget);
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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'Requirment';
    this.color = 'Gold';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Requirement>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Requirement>this.seObject).parts != null);
      addMenuItem(myDropDown, 'min value', this.getMinValue, (<Requirement>this.seObject).minValue != null);
      addMenuItem(myDropDown, 'max value', this.getMaxValue, (<Requirement>this.seObject).maxValue != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/requirements', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Requirement>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const requirementWidget = new RequirementWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        requirementWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, requirementWidget);
        drawList.push(new Edge('assembly', this, requirementWidget));
        drawList.push(requirementWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Requirement>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const requirementWidget = new RequirementWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          requirementWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, requirementWidget);
          drawList.push(new Edge('part', this, requirementWidget));
          drawList.push(requirementWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getMinValue = () => {
    const minValue = (<Requirement>this.seObject).minValue;
    if (minValue) {
      if (widgets.get(minValue.uri)) {
        drawList.push(new Edge('min value', this, widgets.get(minValue.uri)));
      } else {
        const numericValueWidget = new NumericValueWidget(this.x + 100, this.y + 100, minValue.label, this.router);
        numericValueWidget.seObject = seObjects.get(minValue.uri);
        widgets.set(minValue.uri, numericValueWidget);
        drawList.push(new Edge('min value', this, numericValueWidget));
        drawList.push(numericValueWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getMaxValue = () => {
    const maxValue = (<Requirement>this.seObject).maxValue;
    if (maxValue) {
      if (widgets.get(maxValue.uri)) {
        drawList.push(new Edge('max value', this, widgets.get(maxValue.uri)));
      } else {
        const numericValueWidget = new NumericValueWidget(this.x + 100, this.y + 100, maxValue.label, this.router);
        numericValueWidget.seObject = seObjects.get(maxValue.uri);
        widgets.set(maxValue.uri, numericValueWidget);
        drawList.push(new Edge('max value', this, numericValueWidget));
        drawList.push(numericValueWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class RealisationModuleWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'RealisationModule';
    this.color = 'LightGreen';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<RealisationModule>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<RealisationModule>this.seObject).parts != null);
      addMenuItem(myDropDown, 'ports', this.getPorts, (<RealisationModule>this.seObject).ports != null);
      addMenuItem(myDropDown, 'performances', this.getPerformances, (<RealisationModule>this.seObject).performances != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/realisationmodules', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<RealisationModule>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const realisationModuleWidget = new RealisationModuleWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        realisationModuleWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, realisationModuleWidget);
        drawList.push(new Edge('assembly', this, realisationModuleWidget));
        drawList.push(realisationModuleWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<RealisationModule>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const realisationModuleWidget =
            new RealisationModuleWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          realisationModuleWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, realisationModuleWidget);
          drawList.push(new Edge('part', this, realisationModuleWidget));
          drawList.push(realisationModuleWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPorts = () => {
    const ports = (<RealisationModule>this.seObject).ports;
    if (ports && ports.length > 0) {
      for (let i = 0; i < ports.length; i++) {
        if (widgets.has(ports[i].uri)) {
          drawList.push(new Edge('port', this, widgets.get(ports[i].uri)));
        } else {
          const realisationPortWidget = new RealisationPortWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, ports[i].label, this.router);
          realisationPortWidget.seObject = <RealisationPort>ports[i];
          widgets.set(ports[i].uri, realisationPortWidget);
          drawList.push(new Edge('port', this, realisationPortWidget));
          drawList.push(realisationPortWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPerformances = () => {
    const performances = (<RealisationModule>this.seObject).performances;
    if (performances && performances.length > 0) {
      for (let i = 0; i < performances.length; i++) {
        if (widgets.has(performances[i].uri)) {
          drawList.push(new Edge('performance', this, widgets.get(performances[i].uri)));
        } else {
          const performanceWidget = new PerformanceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, performances[i].label, this.router);
          performanceWidget.seObject = seObjects.get(performances[i].uri);
          widgets.set(performances[i].uri, performanceWidget);
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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 100, 50, label);
    this.typename = 'RealisationPort';
    this.color = 'LightGreen';
  }

  contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<RealisationPort>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<RealisationPort>this.seObject).parts != null);
      addMenuItem(myDropDown, 'performances', null, (<RealisationModule>this.seObject).performances != null);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<RealisationPort>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const realisationPortWidget = new RealisationPortWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        realisationPortWidget.seObject = assembly;
        widgets.set(assembly.uri, realisationPortWidget);
        drawList.push(new Edge('assembly', this, realisationPortWidget));
        drawList.push(realisationPortWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<RealisationPort>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const realisationPortWidget = new RealisationPortWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          realisationPortWidget.seObject = parts[i];
          widgets.set(parts[i].uri, realisationPortWidget);
          drawList.push(new Edge('part', this, realisationPortWidget));
          drawList.push(realisationPortWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPerformances = () => {
    const performances = (<RealisationPort>this.seObject).performances;
    if (performances && performances.length > 0) {
      for (let i = 0; i < performances.length; i++) {
        if (widgets.has(performances[i].uri)) {
          drawList.push(new Edge('performance', this, widgets.get(performances[i].uri)));
        } else {
          const performanceWidget = new PerformanceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, performances[i].label, this.router);
          performanceWidget.seObject = seObjects.get(performances[i].uri);
          widgets.set(performances[i].uri, performanceWidget);
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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'Hamburger';
    this.color = 'LightSalmon';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Hamburger>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Hamburger>this.seObject).parts != null);
      addMenuItem(myDropDown, 'functional unit', this.getFunctionalUnit, (<Hamburger>this.seObject).functionalUnit != null);
      addMenuItem(myDropDown, 'technical solution', this.getTechnicalSolution);
      addMenuItem(myDropDown, 'port realisations', this.getPortRealisations, (<Hamburger>this.seObject).portRealisations != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/hamburgers', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Hamburger>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const hamburgerWidget = new HamburgerWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        hamburgerWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, hamburgerWidget);
        drawList.push(new Edge('assembly', this, hamburgerWidget));
        drawList.push(hamburgerWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Hamburger>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const hamburgerWidget = new HamburgerWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          hamburgerWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, hamburgerWidget);
          drawList.push(new Edge('part', this, hamburgerWidget));
          drawList.push(hamburgerWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getFunctionalUnit = () => {
    const functionalUnit = (<Hamburger>this.seObject).functionalUnit;
    if (functionalUnit) {
      if (widgets.get(functionalUnit.uri)) {
        drawList.push(new Edge('functional unit', this, widgets.get(functionalUnit.uri)));
      } else {
        const systemSlotWidget = new SystemSlotWidget(this.x + 100, this.y + 100, functionalUnit.label, this.router);
        systemSlotWidget.seObject = seObjects.get(functionalUnit.uri);
        widgets.set(functionalUnit.uri, systemSlotWidget);
        drawList.push(new Edge('functional unit', this, systemSlotWidget));
        drawList.push(systemSlotWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getTechnicalSolution = () => {
    const technicalSolution = (<Hamburger>this.seObject).technicalSolution;
    if (technicalSolution) {
      if (widgets.get(technicalSolution.uri)) {
        drawList.push(new Edge('technical solution', this, widgets.get(technicalSolution.uri)));
      } else {
        const realisationModuleWidget = new RealisationModuleWidget(this.x + 100, this.y + 100, technicalSolution.label, this.router);
        realisationModuleWidget.seObject = seObjects.get(technicalSolution.uri);
        widgets.set(technicalSolution.uri, realisationModuleWidget);
        drawList.push(new Edge('technical solution', this, realisationModuleWidget));
        drawList.push(realisationModuleWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPortRealisations = () => {
    const portRealisations = (<Hamburger>this.seObject).portRealisations;
    if (portRealisations && portRealisations.length > 0) {
      for (let i = 0; i < portRealisations.length; i++) {
        if (widgets.has(portRealisations[i].uri)) {
          drawList.push(new Edge('port realisation', this, widgets.get(portRealisations[i].uri)));
        } else {
          const portRealisationWidget =
            new PortRealisationWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, portRealisations[i].label, this.router);
          portRealisationWidget.seObject = portRealisations[i];
          widgets.set(portRealisations[i].uri, portRealisationWidget);
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
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 100, 50, label);
    this.typename = 'PortRealisation';
    this.color = 'LightSalmon';
  }

  contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<PortRealisation>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<PortRealisation>this.seObject).parts != null);
      addMenuItem(myDropDown, 'interface', this.getInterface, (<PortRealisation>this.seObject).interface != null);
      addMenuItem(myDropDown, 'port', this.getPort, (<PortRealisation>this.seObject).port != null);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<PortRealisation>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const portRealisationWidget = new PortRealisationWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        portRealisationWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, portRealisationWidget);
        drawList.push(new Edge('assembly', this, portRealisationWidget));
        drawList.push(portRealisationWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<PortRealisation>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const portRealisationWidget = new PortRealisationWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          portRealisationWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, portRealisationWidget);
          drawList.push(new Edge('part', this, portRealisationWidget));
          drawList.push(portRealisationWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getInterface = () => {
    const systemInterface = (<PortRealisation>this.seObject).interface;
    if (systemInterface) {
      if (widgets.get(systemInterface.uri)) {
        drawList.push(new Edge('interface', this, widgets.get(systemInterface.uri)));
      } else {
        const systemInterfaceWidget = new SystemInterfaceWidget(this.x + 100, this.y + 100, systemInterface.label, this.router);
        systemInterfaceWidget.seObject = seObjects.get(systemInterface.uri);
        widgets.set(systemInterface.uri, systemInterfaceWidget);
        drawList.push(new Edge('interface', this, systemInterfaceWidget));
        drawList.push(systemInterfaceWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getPort = () => {
    const port = (<PortRealisation>this.seObject).port;
    if (port) {
      if (widgets.get(port.uri)) {
        drawList.push(new Edge('port', this, widgets.get(port.uri)));
      } else {
        const realisationPortWidget = new RealisationPortWidget(this.x + 100, this.y + 100, port.label, this.router);
        realisationPortWidget.seObject = seObjects.get(port.uri);
        widgets.set(port.uri, realisationPortWidget);
        drawList.push(new Edge('port', this, realisationPortWidget));
        drawList.push(realisationPortWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class PerformanceWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'Performance';
    this.color = 'YellowGreen';
  }

  public contextmenu(event: MouseEvent): void {
    event.preventDefault();
    const x: number = event.x - canvas.offsetLeft + window.pageXOffset;
    const y: number = event.y - canvas.offsetTop + window.pageYOffset;
    console.log('contextmenu: ' + x + ' ' + y);

    if (this.isHit(x, y)) {
      const myDropDown = document.getElementById('myDropdown');
      myDropDown.style.left = this.x + 'px';
      myDropDown.style.top = this.y + 'px';

      clearMenu(myDropDown);
      addMenuItem(myDropDown, 'assembly', this.getAssembly, (<Performance>this.seObject).assembly != null);
      addMenuItem(myDropDown, 'parts', this.getParts, (<Performance>this.seObject).parts != null);
      addMenuItem(myDropDown, 'value', this.getValue, (<Performance>this.seObject).value != null);
      addMenuItem(myDropDown, '', null, false);
      addMenuItem(myDropDown, '=>', () => this.router.navigate(['/performances', {id: this.seObject.uri}]), true);
      myDropDown.classList.toggle('show');
    }
  }

  getAssembly = () => {
    const assembly = (<Performance>this.seObject).assembly;
    if (assembly) {
      if (widgets.get(assembly.uri)) {
        drawList.push(new Edge('assembly', this, widgets.get(assembly.uri)));
      } else {
        const performanceWidget = new PerformanceWidget(this.x + 100, this.y + 100, assembly.label, this.router);
        performanceWidget.seObject = seObjects.get(assembly.uri);
        widgets.set(assembly.uri, performanceWidget);
        drawList.push(new Edge('assembly', this, performanceWidget));
        drawList.push(performanceWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getParts = () => {
    const parts = (<Performance>this.seObject).parts;
    if (parts && parts.length > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (widgets.has(parts[i].uri)) {
          drawList.push(new Edge('part', this, widgets.get(parts[i].uri)));
        } else {
          const performanceWidget = new PerformanceWidget(this.x + 100 + i * 8, this.y + 100 + i * 8, parts[i].label, this.router);
          performanceWidget.seObject = seObjects.get(parts[i].uri);
          widgets.set(parts[i].uri, performanceWidget);
          drawList.push(new Edge('part', this, performanceWidget));
          drawList.push(performanceWidget);
        }
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };

  getValue = () => {
    const value = (<Performance>this.seObject).value;
    if (value) {
      if (widgets.get(value.uri)) {
        drawList.push(new Edge('value', this, widgets.get(value.uri)));
      } else {
        const numericValueWidget = new NumericValueWidget(this.x + 100, this.y + 100, value.label, this.router);
        numericValueWidget.seObject = seObjects.get(value.uri);
        widgets.set(value.uri, numericValueWidget);
        drawList.push(new Edge('value', this, numericValueWidget));
        drawList.push(numericValueWidget);
      }
    }
    const myDropDown = document.getElementById('myDropdown');
    myDropDown.classList.toggle('show');
  };
}

export class NumericValueWidget extends Node {
  constructor(public x: number, public y: number, public label: string, public router?: Router) {
    super(x, y, 160, 50, label);
    this.typename = 'NumericValue';
    this.color = 'white';
  }

  contextmenu(event: MouseEvent): void {
  }
}
