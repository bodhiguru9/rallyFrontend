/**
 * Centralized image exports for the Rally App
 * Usage: import { images } from '@assets/images';
 * Then use: <Image source={images.blackLogo} />
 */

/* eslint-disable @typescript-eslint/no-require-imports */
export const images = {
  blackLogo: require('./files/black_logo.png'),
  blackBigLogo: require('./files/black_big_logo.png'),
  whiteLogo: require('./files/white_logo.png'),
  whiteBigLogo: require('./files/white_big_logo.png'),

  placeholderInput: require('./icons/placeholderInput.jpeg'),

  // Social Media Icons
  appleIcon: require('./files/apple-icon.png'),
  facebookIcon: require('./files/facebook-icon.png'),
  googleIcon: require('./files/google-icon.png'),
  whatsappIcon: require('./files/logos_whatsapp-icon.png'),
  instaIcon: require('./files/instagram.png'),

  // user icons
  userWhite: require('./files/user-w.png'),
  userGray: require('./files/user-g.png'),
  userOrgWhite: require('./files/star-user-w.png'),
  userOrgGray: require('./files/star-user-g.png'),

  // UI Icons
  calendarHosted: require('./icons/calendar-hosted.png'),
  multipleUser: require('./icons/multiple-users.png'),
  bell: require('./files/bell.png'),
  ballpointPen: require('./files/ballpoint-pen.png'),
  locationPin: require('./files/location-pin.png'),
  nametag: require('./files/nametag.png'),
  paperPlane: require('./files/paper-plane.png'),
  remove: require('./files/remove.png'),
  search: require('./files/search.png'),
  time: require('./files/time.png'),
  userDualTone: require('./files/user-dual-tone.png'),
  verifiedIcon: require('./files/verifiedicon.png'),
  infoIcon: require('./files/bi_info.png'),
  peachClock: require('./files/peach-clock.png'),
  greenPin: require('./files/green-pin.png'),
  dhiramIcon: require('./files/dhiram.png'),
  dhiramGrayIcon: require('./files/dhiramGray.png'),
  dhiramWhiteIcon: require('./icons/dhiramWhite.png'),
  calendarCheckmark: require('./files/calendar-checkmark.png'),
  multipleUsers: require('./files/multiple-users.png'),
  sportInput: require('./files/sport-input.png'),
  settingsIcon: require('./icons/gear.png'),
  homeWhite: require('./icons/homeWhite.png'),
  homeBlue: require('./icons/homeBlue.png'),
  uploadIcon: require('./icons/uploadIcon.png'),
  glassMinus: require('./files/glassMinus.png'),
  compass: require('./icons/compass.png'),
  compassBlue: require('./icons/compassBlue.png'),
  userStar: require('./icons/userStar.png'),
  userStarBlue: require('./icons/userStarBlue.png'),
  qrCode: require('./icons/qrCode.png'),
  coinsLight: require('./files/coinsLight.png'),

  // Sport and Activity Icons
  sportIcon: require('./files/fluent-color_sport-16.png'),
  sportsBg: require('./files/sport-input.png'),
  paddleIcon: require('./files/paddle-icon.png'),
  genderIcon: require('./files/ph_gender-intersex-bold.png'),
  userGroupIcon: require('./files/hugeicons_user-group-03.png'),


  // Individual Sport Icons
  pilatesIcon: require('./icons/pilates.png'),
  runningIcon: require('./icons/run.png'),
  indoorCricketIcon: require('./icons/indoor-cricket.png'),
  badmintonIcon: require('./icons/badminton-white.png'),
  cricketIcon: require('./icons/cricket-white.png'),
  footballIcon: require('./icons/football.png'),
  tableTennisIcon: require('./icons/table-tennis.png'),
  tennisIcon: require('./icons/tennis.png'),
  padelIcon: require('./icons/padel.png'),
  pickleballIcon: require('./icons/pickleball.png'),
  basketballIcon: require('./icons/basketball.png'),
  socialIcon: require('./files/multiple-users.png'),
  trainingIcon: require('./icons/training-white.png'),

  // Icontag icons
  badmintonYellow: require('./icons/badminton-yellow.png'),
  cricketYellow: require('./icons/cricket-yellow.png'),
  tableTennisYellow: require('./icons/table-tennis-yellow.png'),
  tennisYellow: require('./icons/tennis-yellow.png'),
  padelYellow: require('./icons/padel-yellow.png'),
  basketballYellow: require('./icons/basketball-yellow.png'),
  privateIcon: require('./icons/private.png'),

  // Illustrations and Empty States
  createEventEmptyScreen: require('./files/create-event-empty-screen.png'),
  imageImport: require('./files/image-import.png'),
  unionIcon: require('./files/Union.png'),
  removeBin: require('./files/remove-bin.png'),
  cancelBooking: require('./files/cancelBooking.png'),
  noRefund: require('./files/noRefund.png'),
  userCoin: require('./files/userCoin.png'),

  // images
  hourGlass: require('./files/hourglass.png'),
  multiUsers: require('./files/peopleusers.png'),
  reminderBell: require('./files/reminderBell.png'),

  warningShield: require('./files/warning-shield.png'),

  // Icons from icons directory
  tournamentIcon: require('./icons/tournament.png'),
  classIcon: require('./icons/class.png'),
  barcodeReceipt: require('./icons/barcode-receipt.png'),
  colorPalette: require('./icons/color-palette.png'),
  creditCard: require('./icons/credit-card.png'),
  fallingCoins: require('./icons/falling-coins.png'),
  faq: require('./icons/faq.png'),
  personEdit: require('./icons/person-edit.png'),
  headset: require('./icons/headset.png'),
  key: require('./icons/key.png'),
  privacyPolicy: require('./icons/privacy-policy.png'),
  trashBin: require('./icons/trash-bin.png'),
} as const;
/* eslint-enable @typescript-eslint/no-require-imports */

// Type-safe image keys
export type ImageKey = keyof typeof images;
