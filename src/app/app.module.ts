﻿import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResizableModule } from 'angular-resizable-element';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { DataTablesModule } from 'angular-datatables';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_components/common/alert';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { QuotationComponent } from './quotation/quotation.component';;
import { GeneralInfoComponent } from './quotation/general-info/general-info.component';
import { CoverageComponent } from './quotation/coverage/coverage.component';
import { QuoteOptionComponent } from './quotation/quote-option/quote-option.component';
import { DummyComponent } from './_components/common/dummy/dummy.component';
import { CustTableComponent } from './_components/common/cust-table/cust-table.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        ResizableModule,
        AngularFontAwesomeModule,
        NgbModule,
        SidebarModule.forRoot(),
        FormsModule,
        DataTablesModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        QuotationComponent,
        GeneralInfoComponent,
        CoverageComponent ,
        QuoteOptionComponent ,
        DummyComponent ,
        CustTableComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }


/*angular-registration-login-example*/