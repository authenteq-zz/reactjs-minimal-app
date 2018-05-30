# Changelog

## Anti-money laundering

Sample result (JSON):
  `{"id":0,"ref":"1527688904-A1rpXA6h","match_status":"no_match"}`

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
