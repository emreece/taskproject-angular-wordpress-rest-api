// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

let apiUrl :string = 'https://esanlamlisinedir.com/wpjwt/wp-json/';
export const environment = {
  production: false,
  apiUrl: apiUrl,
  tokenEndpoint: apiUrl + "jwt-auth/v1/token",
  checkTokenUrl: apiUrl + "jwt-auth/v1/token/validate",
  getMyInformationUrl: apiUrl +'wp/v2/users/me',
  myTasksUrl: apiUrl + "wp/v2/task/",
  taskCategoriesUrl: apiUrl + "wp/v2/categories/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
