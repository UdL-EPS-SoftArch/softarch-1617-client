import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders }  from './app.routing';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroComponent } from './intro/intro.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { PostAdvertisementComponent } from './advertisement/postAdvertisement.component';
import { GetAdvertisementComponent } from './advertisement/getAdvertisement.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterSellerComponent } from './register-seller/register-seller.component';
import { DateFormatPipe } from 'angular2-moment';
import { SearchAdvertisementComponent } from './search-advertisement/search-advertisement.component';
import { ContactComponent } from './contact/contact.component';
import { PutAdvertisementComponent } from './advertisement/putAdvertisement.component';
import { MessageComponent } from './message/message.component';
import { LoginBasicModule } from './login-basic/login-basic.module';
import { LoginBasicComponent } from './login-basic/login-basic.component';
import { LoggedInGuard } from './login-basic/loggedin.guard';
import { AuthenticationBasicService } from './login-basic/authentication-basic.service';
import { OfferComponent } from './offer/offer.component';
import { SellerOfferComponent } from './selleroffer/seller-offer.component';
import { BuyerComponent } from './buyer/buyer.component';
import { ProfileComponent } from './profile/profile.component';
import {DataTableModule} from "angular2-datatable";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    LoginBasicModule,
    DataTableModule
  ],
  declarations: [
    AppComponent,
    OfferComponent,
    NavbarComponent,
    IntroComponent,
    MessageComponent,
    AdvertisementComponent,
    PostAdvertisementComponent,
    GetAdvertisementComponent,
    PutAdvertisementComponent,
    PurchaseComponent,
    FooterComponent,
    RegisterSellerComponent,
    FooterComponent,
    SearchAdvertisementComponent,
    ContactComponent,
    DateFormatPipe,
    SellerOfferComponent,
    BuyerComponent,
    ProfileComponent
  ],
  providers: [
    appRoutingProviders, AuthenticationBasicService, LoggedInGuard
  ],
  bootstrap: [AppComponent, NavbarComponent, FooterComponent, LoginBasicComponent]
})
export class AppModule { }
