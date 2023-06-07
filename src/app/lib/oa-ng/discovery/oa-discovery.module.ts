import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DiscoveryModule } from 'src/app/lib/oa/discovery/discovery.module';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';
import { ProfilesComponent } from './profiles/profiles.component';

const components = [
  ProfileDetailComponent,
  ProfilesComponent
];

const entryComponents = [
];

const thirdPartyModules = [
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatCardModule,
  MatListModule,
  MatTableModule,
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DiscoveryModule,
    ...thirdPartyModules,
  ],
  declarations: [...components, ...entryComponents, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OaDiscoveryModule { }
