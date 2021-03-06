import { Component, OnInit } from '@angular/core';

import { Advertisement } from './advertisement';
import { AdvertisementService } from './advertisement.service';
import { ProfileService } from '../profile/profile.service';
import { ActivatedRoute } from '@angular/router';
import { SearchAdvertisementService } from './search-advertisement/searchAdvertisement.service';
import UsersCache from '../profile/usersCache';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
  providers: [AdvertisementService, SearchAdvertisementService, ProfileService]
})
export class AdvertisementComponent implements OnInit {

  advertisements: Advertisement[];
  advertisementPictures: {} = {};
  errorMessage: string;
  users = UsersCache.entries();

  constructor(private route: ActivatedRoute,
              private advertisementService: AdvertisementService,
              private searchAdvertisementService: SearchAdvertisementService,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParam: any) => {
        if (queryParam.title) {
          this.getAdvertisements(this.searchAdvertisementService.searchAdvertisementByTitle, queryParam.title);
        } else if (queryParam.tag) {
          this.getAdvertisements(this.searchAdvertisementService.searchAdvertisementByTag, queryParam.tag);
        } else if (queryParam.category) {
          this.getAdvertisements(this.searchAdvertisementService.searchAdvertisementByCategory, queryParam.category);
        } else {
          this.getAdvertisements(this.advertisementService.getAllAdvertisements);
        }
      }
    );
  }

  getAdvertisements(advertisementService, ...params) {
    advertisementService(...params)
      .subscribe(
        advertisements => {
          this.advertisements = advertisements;
          this.advertisements.map((advertisement) => {
            this.getAdvertisementPicture(advertisement);
            this.profileService.getUser(`/users/${advertisement.owner}`).subscribe();
          });
        },
        error => this.errorMessage = <any>error.message
      );
  }

  getAdvertisementPicture(advertisement: Advertisement) {
    this.advertisementService.getAdvertisementPictures(advertisement.uri)
      .subscribe(
        pictures => this.advertisementPictures[advertisement.uri] = pictures[0] && pictures[0].content,
        error => alert(`There was an error retrieving an advertisement picture ${error.message}`)
      );
  }

}
