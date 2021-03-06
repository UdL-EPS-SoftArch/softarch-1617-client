import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Advertisement } from './advertisement';
import { AdvertisementService } from './advertisement.service';
import { Picture } from './picture/picture';
import { Purchase } from '../purchase/purchase';
import { PurchaseService } from '../purchase/purchase.service';
import { Auth0Service } from '../auth0/auth0.service';
import { BasketProductService } from '../basketProduct/basketProduct.service';
import { BasketProduct } from '../basketProduct/basketProduct';
import { ProfileService } from '../profile/profile.service';
import UsersCache from '../profile/usersCache';

@Component({
  selector: 'app-get-advertisement',
  templateUrl: './getAdvertisement.component.html',
  styleUrls: ['./getAdvertisement.component.scss'],
  providers: [AdvertisementService, PurchaseService, ProfileService]
})
export class GetAdvertisementComponent implements OnInit {

  advertisement: Advertisement;
  purchase: Purchase;
  picture: Picture;

  hasDeleteConfirm = false;
  deleteConfirmText = '';
  isDeleting = false;
  likes = 0;

  users = UsersCache.entries();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private advertisementService: AdvertisementService,
              private purchaseService: PurchaseService,
              private authentication: Auth0Service,
              private basketProductService: BasketProductService,
              private profileService: ProfileService) {
  }
  /**
   * On Startup:
   * - Save current advertisement id on the advertisement object.
   * - Search for its remaining info (API).
   */
  ngOnInit() {
    this.route.params
      .map(params => params['id'])
      .subscribe((id) => {
        const uri = `/advertisements/${id}`;
        this.getAdvertisement(uri);
      });
  }

  getAdvertisement(uri: string) {
    this.advertisementService.getAdvertisement(uri).subscribe(
      advertisement => {
        this.advertisement = advertisement;

        // The advertisement does exist, let's query the rest.
        this.getAdvertisementPicture(this.advertisement.uri);
        this.getAdvertisementPurchase(this.advertisement.uri);
        this.profileService.getUser(`/users/${advertisement.owner}`).subscribe();
      },
      error => this.router.navigate(['/404']),
    );
  }

  getAdvertisementPicture(advertisementUri: string) {
    this.advertisementService.getAdvertisementPictures(advertisementUri)
      .subscribe(
        pictures => this.picture = pictures.length > 0 && pictures[0],
        error => null, // Could be 404 if pictures were never created.
      );
  }

  getAdvertisementPurchase(advertisementUri: string) {
    this.purchaseService.getPurchaseByAdvertisement(advertisementUri)
      .subscribe(
        purchase => this.purchase = purchase,
        error => null, // Expecting a 404 if there is no purchase.
      );
  }

  toggleDeleteAdvertisementConfirm() {
    this.hasDeleteConfirm = !this.hasDeleteConfirm;
  }

  deleteAdvertisementForm(uri: string) {
    const deleteConfirmText = this.deleteConfirmText.trim().toLowerCase();
    const advertisementTitle = this.advertisement.title.trim().toLowerCase();
    if (deleteConfirmText === advertisementTitle) {
      this.deleteAdvertisement(uri);
    }
  }

  deleteAdvertisement(uri: string) {
    this.hasDeleteConfirm = false;
    this.isDeleting = true;
    this.advertisementService.deleteAdvertisement(uri).subscribe(
      advertisement => {
        this.isDeleting = false;
        // Redirect to advertisements page.
        this.router.navigate(['/advertisements']);
      },
      error => {
        this.isDeleting = false;
        alert(`Error: ${error.message}`);
      }
    );
  }

  getCurrentUser(): string {
    return this.authentication.getCurrentUser().username;
  }

  isAdvertisementOwner(): boolean {
    return this.getCurrentUser() === this.advertisement.owner;
  }

  addProduct(advertisement): void {
    this.basketProductService.addProduct(new BasketProduct({ advertisement }));
  }

  updateCount() {
    this.likes += 1;
  }
}
