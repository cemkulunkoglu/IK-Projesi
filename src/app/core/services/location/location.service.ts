import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseResponse } from 'src/app/core/models/base-response';
import { environment } from 'src/environments/environment';
import { CountryModel } from '../../models/location/country.model';
import { CityModel } from '../../models/location/city.model';
import { DistrictModel } from '../../models/location/district.model';

const API_URL = `${environment.apiUrl}/Location`;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    
  }

  getCountries(): Observable<Array<CountryModel>> {
    return this.http.get(`${API_URL}/GetCountries`)
      .pipe(map((res: BaseResponse<Array<CountryModel>>) => res.data));
  }

  getCitiesByCountryId(countryId: number) {
    return this.http.get(`${API_URL}/GetCitiesByCountryId?countryId=${countryId}`)
      .pipe(map((res: BaseResponse<Array<CityModel>>) => res))
  }

  getDistrictiesByCityId(cityId: number) {
    return this.http.get(`${API_URL}/GetDistrictiesByCityId?cityId=${cityId}`)
      .pipe(map((res: BaseResponse<Array<DistrictModel>>) => res))
  }
  
}
