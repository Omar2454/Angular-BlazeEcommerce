import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";
import {BlazeFormServiceService} from "../../services/blaze-form-service.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {BlazeValidators} from "../../validators/blaze-validators";

@Component({
  selector: 'app-checkout', templateUrl: './checkout.component.html', styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];

  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder, private cartService: CartService, private blazeFormService: BlazeFormServiceService) {
  }

  ngOnInit(): void {
    this.listCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), BlazeValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), BlazeValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+t-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
          , BlazeValidators.notOnlyWhitespace]),
      }), shippingAddress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', [Validators.required, BlazeValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, BlazeValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)])
      }), billingDetails: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), BlazeValidators.notOnlyWhitespace]),
        CVV: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]),
        expirationMonth: new FormControl('', Validators.required),
        expirationYear: new FormControl('', Validators.required)
      }), billingAddress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', [Validators.required, BlazeValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, BlazeValidators.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)])      })
    });
    //populate the creditCard Months
    const startMonth: number = new Date().getMonth() + 1;

    this.blazeFormService.getCreditCardMonth(startMonth).subscribe(data => {
      console.log("retreiverd credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    });
    //populate the credit card years
    this.blazeFormService.getCreditCardYears().subscribe(data => {
      console.log("retreiverd credit card Years: " + JSON.stringify(data));
      this.creditCardYears = data;
    })
    this.blazeFormService.getCountries().subscribe(data => {
      this.countries = data;
    })

  }

  private listCartDetails() {
    //get a handle the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);

    //subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    //compute cart total price and quantity
    this.cartService.computeCartTotals();
  }


  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get country() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get state() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get city() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get street() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get zipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get cardType() {
    return this.checkoutFormGroup.get('billingDetails.cardType');
  }

  get cardNumber() {
    return this.checkoutFormGroup.get('billingDetails.cardNumber');
  }

  get nameOnCard() {
    return this.checkoutFormGroup.get('billingDetails.nameOnCard');
  }

  get CVV() {
    return this.checkoutFormGroup.get('billingDetails.CVV');
  }

  get expirationMonth() {
    return this.checkoutFormGroup.get('billingDetails.expirationMonth');
  }

  get expirationYear() {
    return this.checkoutFormGroup.get('billingDetails.expirationYear');
  }
  get billingCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }


  copyShippingAdressTodoBillingAdress(event) {
    if (event.target.checked) {
      console.log("the button is checked")
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("handling the submit button")

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }


  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('billingDetails');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);


    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.blazeFormService.getCreditCardMonth(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    })
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    console.log(formGroup.value);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country: ${countryName}`);
    console.log(`${formGroupName} country Code: ${countryCode}`);
    this.blazeFormService.getStates(countryCode).subscribe(data => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      //select the 1st item by default
      formGroup.get('state').setValue(data[0]);
      console.log(formGroup.get('state').value);
    });


  }
}
