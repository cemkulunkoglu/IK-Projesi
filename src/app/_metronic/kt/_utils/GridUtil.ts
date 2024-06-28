import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class GridUtil {

  static handleGridResponse(observable: Observable<any>, searchText?: string): Promise<any> {
    return observable.pipe(
      map((values: any) => {
        if (searchText) {
          searchText = searchText.toLocaleLowerCase('tr');
          const filteredValues: any[] = [];
          values.filter(x => {
            for (const item in x) {
              if (typeof x[item] === typeof searchText) {
                if ((x[item] as string).toLocaleLowerCase('tr').includes(searchText)) {
                  filteredValues.push(x);
                  break;
                }
              }
            }
          });
          return filteredValues;
        }
        return values;
      })
    )
      .toPromise()
      .catch(e => {
        if (e.error.status == 401 || e.error.status == 400 || e.error.status == 403 || e.error.status == 404) {
          return;
        }
        throw e?.error?.error;
      });

  }

}
