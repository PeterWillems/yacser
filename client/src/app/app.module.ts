import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {AppComponent} from './app.component';
import {defaultDataIdFromObject, InMemoryCache} from 'apollo-cache-inmemory';
import { SystemslotRepositoryComponent } from './systemslot-repository/systemslot-repository.component';
import { SystemslotComponent } from './systemslot/systemslot.component';
import { PropertyComponent } from './property/property.component';
import { DatasetComponent } from './dataset/dataset.component';
import { FunctionRepositoryComponent } from './function-repository/function-repository.component';
import { RequirementRepositoryComponent } from './requirement-repository/requirement-repository.component';
import { FunctionComponent } from './function/function.component';

const appRoutes: Routes = [
  {path: 'datasets', component: DatasetComponent},
  {path: 'systemslots', component: SystemslotRepositoryComponent},
  {path: 'functions', component: FunctionRepositoryComponent},
  {path: 'requirements', component: RequirementRepositoryComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    SystemslotRepositoryComponent,
    SystemslotComponent,
    PropertyComponent,
    DatasetComponent,
    FunctionRepositoryComponent,
    RequirementRepositoryComponent,
    FunctionComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule, // provides HttpClient for HttpLink
    ApolloModule,
    HttpLinkModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link: httpLink.create({uri: 'http://localhost:8080/graphql'}),
      cache: new InMemoryCache()
    });
  }
}
