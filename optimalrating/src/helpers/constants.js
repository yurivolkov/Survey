export const colors = [
  '#0088FE', '#FF8042', '#FFBB28', '#00C49F', '#c041ff', '#41c9ff', '#54ff41', '#fbff41', '#ff4141', '#3A4099', '#3A4099', '#6F6F6F', '#DF7FC1', '#80FFA5', '#562A2A', '#4E495E', '#455B62', '#6B341B', '#FFFFFF', '#18622A'
];

export const userFields = [
  { key: 'firstname', label: 'firstname' },
  { key: 'middlename', label: 'middlename' },
  { key: 'lastname', label: 'lastname' },
  { key: 'user_details.birthdate', label: 'birthdate', render: (x) => x ? x.split('-').reverse().join('.') : '-' },
  { key: 'user_details.gender', label: 'gender', translate: true },
  { key: 'user_details.education', label: 'education', translate: true },
  { key: 'country.name', label: 'country' },
  { key: 'city.name', label: 'city' },
  { key: 'user_details.phone_number', label: 'phone_number' },
  { key: 'email' },
  { key: 'user_details.occupation', label: 'occupation' },
  { key: 'user_details.marital_status', label: 'marital_status', translate: true },
  { key: 'user_details.about', label: 'about' },
  { key: 'user_details.facebook_url', label: 'facebook_url' },
  { key: 'user_details.instagram_url', label: 'instagram_url' },
  { key: 'user_details.twitter_url', label: 'twitter_url' },
  { key: 'user_details.skype_url', label: 'skype_url' },
  { key: 'user_details.web_url', label: 'web_url' },
  { key: 'user_details.another_url', label: 'another_url' },
];

export const genders = [
  { label: 'lbl.male', value: 'male' },
  { label: 'lbl.female', value: 'female' },
  { label: 'lbl.gender_other', value: '0' }
];

export const educations = [
  { label: 'lbl.university', value: 'university' },
  { label: 'lbl.high_school', value: 'high_school' },
  { label: 'lbl.school', value: 'school' }
];

export const marital = [
  { label: 'lbl.single', value: 'single' },
  { label: 'lbl.married', value: 'married' },
  { label: 'lbl.divorced', value: 'divorced' }
];

export const urls = {
  sa: 'survey_approval',
  un: 'user_nationality',
  up: 'user_portrait',
  us: 'user'
};

export const privacyOrder = [1, 2, 0, 7, 5, 3, 4, 9, 8, 6, 12, 10, 11, 13, 17, 14, 16, 15];