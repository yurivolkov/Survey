export class LoginModel {
  constructor(data = null) {
    this.email = data ? data.email : '';
    this.password = data ? data.password : '';
  };
};

export class RegisterModel {
  constructor(data = null) {
    this.email = data ? data.email : '';
    this.password = data ? data.password : '';
    this.confirm = data ? data.confirm : '';
  };
};

export class ProfileModel {
  constructor(data) {
    this.username = data.username;
    this.firstname = data.firstname;
    this.middlename = data.middlename;
    this.lastname = data.lastname;
    this.year = data.user_details.birthdate ? data.user_details.birthdate.split('-')[0] : null;
    this.month = data.user_details.birthdate ? data.user_details.birthdate.split('-')[1] : null;
    this.day = data.user_details.birthdate ? data.user_details.birthdate.split('-')[2] : null;
    this.birthdate = data.user_details.birthdate;
    this.profile_image = data.user_details.profile_image;
    this.gender = data.user_details.gender;
    this.education = data.user_details.education;
    this.country_id = data.country_id;
    this.city_id = data.city_id;
    this.phone_number = data.user_details.phone_number || '';
    this.email = data.email;
    this.occupation = data.user_details.occupation;
    this.marital_status = data.user_details.marital_status;
    this.about = data.user_details.about;
    this.facebook_url = data.user_details.facebook_url;
    this.instagram_url = data.user_details.instagram_url;
    this.twitter_url = data.user_details.twitter_url;
    this.skype_url = data.user_details.skype_url;
    this.web_url = data.user_details.web_url;
    this.another_url = data.user_details.another_url;
  };
};

export class ProfileSaveModel {
  constructor(data) {
    this.username = data.username;
    this.firstname = data.firstname;
    this.middlename = data.middlename;
    this.lastname = data.lastname;
    this.country_id = data.country_id;
    this.city_id = data.city_id;
    this.national_image = null;
    this.portrait_image = data.portrait_image;
    this.user_details = {
      birthdate: data.birthdate,
      gender: data.gender,
      education: data.education,
      phone_number: data.phone_number,
      occupation: data.occupation,
      marital_status: data.marital_status,
      about: data.about,
      facebook_url: data.facebook_url,
      instagram_url: data.instagram_url,
      twitter_url: data.twitter_url,
      skype_url: data.skype_url,
      web_url: data.web_url,
      profile_image: data.profile_image,
      another_url: data.another_url
    };
  };
};

export class ChoiceModel {
  constructor() {
    this.choice_title = '';
    this.choice_description = '';
    this.marking = 0;
    this.image = '';
  };
};