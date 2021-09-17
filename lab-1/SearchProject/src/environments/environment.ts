// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  GAPI_CLIENT_ID: "885756955127-15nknebl6kq2e92d1ovd2um355jmuoi8.apps.googleusercontent.com",
  GAPI_API_KEY: "AIzaSyC8aCmFhegA8YtygAVccDPddN7aJ-POYwU",
  GAPI_DRIVE_DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
  GAPI_DRIVE_SCOPES: "https://www.googleapis.com/auth/drive",
  SERVER_URL: "http://localhost:8080/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
