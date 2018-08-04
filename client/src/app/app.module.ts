import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ApolloModule, Apollo} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {AppComponent} from './app.component';
import {SystemslotRepositoryComponent} from './systemslot-repository/systemslot-repository.component';
import {SystemslotComponent} from './systemslot/systemslot.component';
import {PropertyComponent} from './property/property.component';
import {DatasetComponent} from './dataset/dataset.component';
import {FunctionRepositoryComponent} from './function-repository/function-repository.component';
import {RequirementRepositoryComponent} from './requirement-repository/requirement-repository.component';
import {FunctionComponent} from './function/function.component';
import {RequirementComponent} from './requirement/requirement.component';
import {RealisationModuleRepositoryComponent} from './realisation-module-repository/realisation-module-repository.component';
import {RealisationModuleComponent} from './realisation-module/realisation-module.component';
import {PerformanceRepositoryComponent} from './performance-repository/performance-repository.component';
import {PerformanceComponent} from './performance/performance.component';
import {HamburgerRepositoryComponent} from './hamburger-repository/hamburger-repository.component';
import {HamburgerComponent} from './hamburger/hamburger.component';
import {SysteminterfaceRepositoryComponent} from './systeminterface-repository/systeminterface-repository.component';
import {SysteminterfaceComponent} from './systeminterface/systeminterface.component';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {PortrealisationComponent} from './hamburger/portrealisation/portrealisation.component';

const appRoutes: Routes = [
    {path: '', redirectTo: '/datasets', pathMatch: 'full'},
    {path: 'datasets', component: DatasetComponent},
    {path: 'systemslots', component: SystemslotRepositoryComponent},
    {path: 'systeminterfaces', component: SysteminterfaceRepositoryComponent},
    {path: 'functions', component: FunctionRepositoryComponent},
    {path: 'requirements', component: RequirementRepositoryComponent},
    {path: 'realisationmodules', component: RealisationModuleRepositoryComponent},
    {path: 'performances', component: PerformanceRepositoryComponent},
    {
      path: 'hamburgers', component: HamburgerRepositoryComponent,
      children: [{path: 'portrealisation', component: PortrealisationComponent}]
    }
  ]
;

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
    RequirementComponent,
    RealisationModuleRepositoryComponent,
    RealisationModuleComponent,
    PerformanceRepositoryComponent,
    PerformanceComponent,
    HamburgerRepositoryComponent,
    HamburgerComponent,
    SysteminterfaceRepositoryComponent,
    SysteminterfaceComponent,
    PortrealisationComponent,
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
