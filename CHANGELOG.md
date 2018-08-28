# Changelog

### v1.2.1

* Updated list of countries in `src/countries.json`. Now, it also includes
`nationality` value.

### v1.2.0

* Changed QR code to AQR code
* Removed QRJS2 from dependencies

Both QR and AQR code scanning is supported in Android app from v1.24.13, in iOS
app from v1.20.0. Support for QR code scanning will be removed in future
version of Android and iOS app.

### v1.1.1

* Add `src/countries.json`
* Change Nationality field to dropdown

### v1.1.0

* Client-side subscription endpoints changed [**breaking change**]

### v1.0.0

Initial implementation. Following features are implemented:
* Claims of following personal information
 * Given name (first and middle name in one field)
 * Last name
 * Date of birth (YYYY-MM-DD, YYYYMMDD, YYYY/MM/dd)
 * Nationality ()
 * Passport no.
* Anti-money laundering (AML) check (sample response.
* KYC check (retrieves photo of user's passport)
