/**
 * Created by Xavier on 14/12/16.
 */
import { Component, OnInit } from '@angular/core';
import { BuyerOffer } from './buyeroffer';
import { BuyerOfferService } from './buyeroffer.service';
import { AdvertisementService } from '../advertisement/advertisement.service';
import { Advertisement } from '../advertisement/advertisement';
import { PurchaseService } from '../purchase/purchase.service';
import { Purchase } from '../purchase/purchase';
import { Auth0Service } from '../auth0/auth0.service';
import { User } from '../auth0/user';


@Component({
  selector: 'app-manage-offers',
  templateUrl: './manageOffers.component.html',
  styleUrls: ['./manageOffers.component.css'],
  providers: [BuyerOfferService, AdvertisementService, PurchaseService]
})
export class ManageOffersComponent implements OnInit {

  buyeroffers: BuyerOffer[] = [];
  errorMessage: string;
  newPurchase: Purchase = new Purchase();
  advertisements: Advertisement[] = [];
  tempAdvert: Advertisement = new Advertisement();
  newAdvert: Advertisement[] = [];
  currentFilterAdvertisement: string;
  currentOrderParam: string;
  showAll: boolean;
  invert: boolean;
  isSortable: boolean;
  invertOfferPrice: boolean;


  constructor(private buyerOfferService: BuyerOfferService,
              private advertisementService: AdvertisementService,
              private authentication: Auth0Service,
              private purchase: PurchaseService) { }

  ngOnInit() {
    this.getBuyerOffer();
    this.getAdvertisements();

    this.currentFilterAdvertisement = '';
    this.currentOrderParam = '';
    this.showAll = true;
    this.invert = false;
    this.isSortable = true;
    this.invertOfferPrice = false;
    this.sortBy('title');
    console.log('printing ' + this.buyeroffers.length);
  }

  printOffers() {
    console.log('printing ' + this.buyeroffers.length);
    for (let off of this.buyeroffers) {
      console.log(off.uri + '' + off.value);
    }
  }

  getCurrentUser(): User {
    return this.authentication.getCurrentUser();
  }

  getAdvertisements() {
    this.advertisementService.getAllAdvertisements()
      .subscribe(
        advertisements => {
          this.advertisements = advertisements;
        },
        error => this.errorMessage = <any>error.message
      );
  }

  filterByAdvertisement(uri: string) {
    this.showAll = false;
    this.currentFilterAdvertisement = uri;
    this.currentOrderParam = '';
    this.isSortable = false;
  }

  showAllAdvertisements() {
    this.showAll = true;
    this.currentFilterAdvertisement = '';
    this.invert = true;
    this.isSortable = true;
    this.sortBy('title');
  }

  sortBy(param: string) {
    if (this.isSortable) {
      if (this.currentOrderParam === param) {
        this.invert = !this.invert;
      } else {
        this.invert = false;
        this.currentOrderParam = param;
      }
      this.advertisements.sort((some, other) => {
        if (!this.invert) {
          if (some[param] > other[param] ) {
            return 1;
          }
          if (some[param] < other[param] ) {
            return -1;
          }
        } else {
          if (some[param] < other[param] ) {
            return 1;
          }
          if (some[param] > other[param] ) {
            return -1;
          }
        }
        return 0;
      });
    }
    console.log('printing ' + this.buyeroffers.length);
  }

  sortOffers() {
    console.log('sorting');
    this.buyeroffers.sort((some, other) => {
      if (this.invertOfferPrice) {
        if (some.value < other.value) {
          return 1;
        }
        if (some.value > other.value) {
          return -1;
        }
      } else {
        if (some.value > other.value) {
          return 1;
        }
        if (some.value < other.value) {
          return -1;
        }
      }
      return 0;
    });
    this.invertOfferPrice = !this.invertOfferPrice;
  }

  submitOfferAndPurchase(offer: BuyerOffer, advert: Advertisement) {
    this.rejectTheRestOfTheOffers(offer, advert);
    this.tempAdvert = new Advertisement(advert);
    offer.accepted = true;
    this.tempAdvert.owner = String(offer.buyer_id);
    this.tempAdvert.price = offer.value;
    console.log(this.tempAdvert.owner + '' + this.tempAdvert.price);
    this.newAdvert = [this.tempAdvert];
    this.newPurchase = new Purchase({ newAdvert : this.newAdvert, });
    this.purchase.addPurchase(this.newPurchase).subscribe(
      purchase => {
        this.newPurchase = purchase;
      },
      error => this.errorMessage = error.message
    );
  }

  rejectTheRestOfTheOffers(offer: BuyerOffer, advert: Advertisement) {
    for (let o of this.buyeroffers){
      if (o.advertisement_title === advert.title && o.uri !== offer.uri) {
        this.deleteBuyerOffer(o);
      }
    }
  }

  getBuyerOffer() {
    this.buyerOfferService.getAllBuyerOffers()
      .subscribe(
        buyeroffers => this.buyeroffers = buyeroffers,
        error => this.errorMessage = <any>error.message
      );
  }


  deleteBuyerOffer(buyeroffer) {
    this.buyerOfferService.deleteBuyerOfferByUri(buyeroffer.uri)
      .subscribe(
        deleted => this.buyeroffers = this.buyeroffers.filter(p => p.uri !== buyeroffer.uri),
        error =>  this.errorMessage = <any>error.message);
  }

}
