/**
 * [Customer Details Model]
 */
export class Details {
  constructor() {
    this.accountNr = '';
    this.salesReps = [];
    this.salesSupport = [];
    this.company = null;
    this.url = '';
    this.title = {
      known: null,
      tax: null,
    };
  }
}

/**
 * [Customer Location Model]
 */
export class Location {
  constructor() {
    this.title = '';
    this.code = '';
    this.contactInfo = {
      email: [''],
      phoneNumbers: [
        {countryCode: '90', areaCode: null, number: null, extension: null},
      ],
      faxNumbers: [
        {countryCode: '90', areaCode: null, number: null, extension: null},
      ],
      address: {
        title: '',
        country: null,
        state: null,
        city: null,
        district: null,
        street: null,
        zipCode: '',
      },
    };
    this.salesReps = [];
    this.salesSupport = [];
  }
}

/**
 * [Customer B2BSettings Model]
 */
export class B2BSettings {
  constructor() {
    this.isPosActive = false;
    this.defaultLanguage = 'tr';
    this.primaryWarehouse = '';
    this.defaultCurrencyCode = 'TRY';
    this.notification = {
      babsEmails: [''],
    };
    this.cart = {
      isShared: false,
    };
  }
}

/**
 * [Customer ContactInfo Model]
 */
export class ContactInfo {
  constructor() {
    this.title = '';
    this.type = '';
    this.email = [''];
    this.phoneNumbers = [
      {countryCode: '90', areaCode: null, number: null, extension: null},
    ];
    this.faxNumbers = [
      {countryCode: '90', areaCode: null, number: null, extension: null},
    ];
    this.address = {
      title: null,
      street: null,
      district: null,
      city: null,
      country: null,
      zip: null,
      neighborhood: null,
      state: null,
      lat: 40.9957492,
      lng: 29.2449493,
    };
  }
}

export default {
  Details,
  Location,
  B2BSettings,
  ContactInfo,
};
