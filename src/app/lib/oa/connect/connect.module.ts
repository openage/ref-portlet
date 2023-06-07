import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService, TaskService } from './services';


const angularModules = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
];

const thirdPartyModules = [
];

const services = [
    TaskService,
    DataService
];
const guards = [];
const sharedComponents = [];
const pipes = [];

@NgModule({
    imports: [
        ...angularModules,
        ...thirdPartyModules,
    ],

    exports: [
        ...angularModules,
        ...thirdPartyModules,
        ...sharedComponents,
        ...pipes
    ],
    declarations: [
        ...sharedComponents,
        ...pipes
    ],
    providers: [
        ...services,
        ...guards
    ]
})
export class ConnectModule { }
