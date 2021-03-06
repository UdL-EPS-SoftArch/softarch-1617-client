/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appRoutingProviders, routing } from './app.routing';
import { APP_BASE_HREF } from '@angular/common';
import { IntroComponent } from './intro/intro.component';
import { AdvertisementComponent } from './advertisement/advertisement.component';
import { FooterComponent } from './footer/footer.component';
import { PostAdvertisementComponent } from './advertisement/postAdvertisement.component';
import { FormsModule } from '@angular/forms';
import { SearchAdvertisementComponent } from './advertisement/search-advertisement/search-advertisement.component';
import { AdvanceSearchAdvertisementComponent } from './advertisement/search-advertisement/advanceSearchAdvertisement.component';
import { GetAdvertisementComponent } from './advertisement/getAdvertisement.component';
import { MomentModule } from 'angular2-moment';
import { ContactComponent } from './contact/contact.component';
import { MessageComponent } from './message/message.component';
import { RegisterSellerComponent } from './register-seller/register-seller.component';
import { BuyerComponent } from './buyer/buyer.component';
import { WishListComponent } from './buyer/wishlist/wishlist.component';
import { PersonalOffersListComponent } from './buyeroffer/personalOffersList.component';
import { UpdateOfferComponent } from './buyeroffer/updateOffer.component';
import { BuyerOfferComponent } from './buyeroffer/buyeroffer.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { BasketProductComponent } from './basketProduct/basketProduct.component';
import { ManageOffersComponent } from './buyeroffer/manageOffers.component';
import { LoadingComponent } from './loading/loading.component';
import { DoesNotExistComponent } from './does-not-exist/doesNotExist.component';
import { SellerComponent } from './seller/seller.component';

describe('App: Softarch1617Client', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, IntroComponent, FooterComponent, AdvertisementComponent,
        PostAdvertisementComponent, GetAdvertisementComponent,
        SearchAdvertisementComponent, AdvanceSearchAdvertisementComponent,
        RegisterSellerComponent, BuyerComponent, BuyerOfferComponent, WishListComponent,
        PersonalOffersListComponent, UpdateOfferComponent,
        ContactComponent, MessageComponent,
        ProfileComponent, PurchaseComponent,
        BasketProductComponent, ManageOffersComponent,
        LoadingComponent, SellerComponent,
        DoesNotExistComponent,
      ],
      imports: [
        routing, FormsModule, MomentModule
      ],
      providers: [
        appRoutingProviders,
        { provide: APP_BASE_HREF, useValue : '/' }
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render router-outlet in two div tags', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div div router-outlet').localName).toBe('router-outlet');
  }));
});
