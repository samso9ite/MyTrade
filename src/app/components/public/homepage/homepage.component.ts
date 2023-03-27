import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { isMobile } from 'src/app/helpers';
import { Router } from '@angular/router';

import * as AOS from 'aos';

declare var $;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  valueFromHeader;

  isMobile = false;
  isLoggedIn = false;
  loading = false;
  submitted = false;
  submitting = false;

  card = {
    image: '',
    name: '',
    rates: []
  };
  countries = [];
  allCards = [];
  rawCountries = [];
  cardTypes = [];
  feedbacks = [];
  dummyFeedbacks = [
    {
      message: 'I just wanted to share a quick note and let you know that you guys do a really good job. It’s really great how easy your websites are to update and manage.',
      user: {
        image: 'assets/images/portrait/img12.jpg',
        fullname: 'Mr. Ade Prince',
      },
      occupation: 'Client',
      rate: 5
    },
    {
      message: 'I just wanted to share a quick note and let you know that you guys do a really good job. It’s really great how easy your websites are to update and manage.',
      user: {
        image: 'assets/images/portrait/img2.jpg',
        fullname: 'Ms. Helen Ade',
      },
      occupation: 'Customer',
      rate: 5
    },
    {
      message: 'I just wanted to share a quick note and let you know that you guys do a really good job. It’s really great how easy your websites are to update and manage.',
      user: {
        image: 'assets/images/portrait/img7.jpg',
        fullname: 'Mr. James Bond',
      },
      occupation: 'Customer',
      rate: 5
    },
  ];

  notFound;
  disabledMessage = null;
  currentRates = [];
  computedRate = 0;
  selectedCardId = '';
  selectedRate = {
    cardType: '',
    country: '',
    denomination: '',
    rate: 0
  };

  cardForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.isMobile = isMobile();
    this.isLoggedIn = Boolean(this.authService.isLoggedIn());

    this.loading = true;

    this.dataService.getCountries().subscribe(
      (res: any) => {
        this.rawCountries = res;
      },
      err => console.error(err)
    );

    this.dataService.getAllCards().subscribe(
      (res: any) => {
        if (res.status) {
          this.allCards = res.data;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error(err.message);
        this.loading = false;
      }
    );

    this.dataService.getHomepageFeedbacks().subscribe(
      (res: any) => {
        if (res.status) {
          this.feedbacks = res.data;

          if (this.feedbacks.length < 3) {
            this.feedbacks = this.feedbacks.concat(this.dummyFeedbacks);
          }

          this.feedbacks = this.feedbacks.map(feedback => {
            feedback.occupation = 'Customer';
            feedback.rate = new Array(feedback.rate).fill(1);
            return feedback;
          });
        }

        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error(err.message);
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    AOS.init();
    // console.log('heys');
    $('.preloader').delay(500).fadeOut(500);

    this.cardForm = this.formBuilder.group({
      card: ['', Validators.required],
      card_type: ['', Validators.required],
      card_digits: [''],
      card_value: ['', Validators.required],
      country: ['', Validators.required],
      card_receipt_image: [''],
      amount: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCarousel();
    }, 1000);
  }

  get f(): any {
    return this.cardForm.controls;
  }

  randomIntFromInterval(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initCarousel(): void {
    $('document').ready(() => {
      $('.testimonial-active').slick({
        dots: false,
        arrows: true,
        prevArrow: '<span class="prev"><i class="lni lni-arrow-left"></i></span>',
        nextArrow: '<span class="next"><i class="lni lni-arrow-right"></i></span>',
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 800,
        slidesToShow: 1,
      });
    });
  }

  between(x, range): boolean {
    const [min, max] = range.split('-');
    return x >= min && x <= max;
  }

  isRateAvailable(amount: number): boolean {
    let isAvailable = false;
    this.currentRates.forEach(rate => {
      const isBetween = this.between(amount, rate.denomination);

      if (isBetween) {
        isAvailable = true;
        this.computedRate = rate.rate;

        if (rate.isDisabled) {
          this.disabledMessage = rate.reasonForDisabling;
        }
      }
    });

    return isAvailable;
  }

  findCountryCurrency(country: string): string {
    const countryCurrency = this.rawCountries.find(c => c.name === country);
    return countryCurrency.currency;
  }

  getDistinctCountries(
    array: Array<{ country: string; currency: string }>
  ): Array<{ country: string; currency: string }> {
    const unique = array.filter(
      (thing, index, self) =>
        index === self.findIndex(t => t.country === thing.country && t.currency === thing.currency)
    );

    return unique;
  }

  selectCard(event): void {
    this.loading = true;
    const card = JSON.parse(event.target.value);
    this.selectedCardId = card._id;

    this.dataService.getCardDetails(this.selectedCardId).subscribe(
      (res: any) => {
        if (res.status) {
          this.loading = false;
          this.card = res.data;

          this.card.rates.forEach(rate => {
            const currency = this.findCountryCurrency(rate.country);

            if (!this.cardTypes.includes(rate.cardType)) {
              this.cardTypes.push(rate.cardType);
            }

            rate.currency = currency;
            this.countries.push({ country: rate.country, currency });
          });

          this.countries = this.getDistinctCountries(this.countries);
        }
      },
      err => {
        this.loading = false;
        this.toastrService.error('An error occured while fetching card details');
        console.error(err);
      }
    );
  }

  selectRate(event): void {
    this.selectedRate = JSON.parse(event.target.value);
  }

  selectType(event): void {
    if (this.f.country.value) {
      this.getCardRates();
    }
  }

  selectCountry(event): void {
    this.getCardRates();
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  getCardRate(amount: number): number {
    this.notFound = false;
    this.disabledMessage = null;
    this.computedRate = 0;

    if (this.currentRates.length) {
      this.notFound = this.isRateAvailable(amount);
    } else {
      this.notFound = true;
    }

    return this.computedRate;
  }

  getAmount(): number {
    const amount = this.getCardRate(this.f.card_value.value) * this.f.card_value.value;

    this.cardForm.patchValue({
      amount
    });

    return amount;
  }

  getCardRates(): void {
    this.loading = true;

    const country = this.f.country.value;
    const type = this.f.card_type.value;

    if (!country.length && !type.length) {
      this.toastrService.warning('Please input both country and card type');
      return;
    }

    this.dataService.getCardRates(this.selectedCardId, country, type).subscribe(
      (res: any) => {
        // console.log(res.data);
        if (res.status) {
          this.currentRates = res.data;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error('An error occured while fetching card details with country and type');
      }
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
