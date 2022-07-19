
function getEnvironmentFileUrl(env: string = ''): string {
  if (env) env += '.';
return `./assets/environments/environment.${env}json`;
}

/**
 * loads environment properties based on environment name passed as parameter
 *
 * @callback callback with environment object as parameter, to be used to set global variable environment
 * @returns promise of reading json file from assets/environments folder
 * @author mhilmi <mourad.hilmi@sofrecom.com>
 */

export function initEnvironment(env: string = '', callback: (env:any)=>any): Promise<any> {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var fileUrl = getEnvironmentFileUrl(env);
        xhr.open('GET', fileUrl);
        xhr.onload = function () {
        if (xhr.status === 200) {
        let x = JSON.parse(xhr.responseText);
        callback(x);
        resolve(x);
        }
        else {
        reject("Cannot load configuration...");
        }
        };
        xhr.send();
        });
}
