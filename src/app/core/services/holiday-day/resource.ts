import { Injectable } from '@angular/core';



export class Resource {
  text: string;

  id: number;

  color: string;
}


const resources: Resource[] = [
  {
    text: 'Askerlik',
    id: 1,
    color: '#bbd806',
  }, {
    text: 'Babalık',
    id: 2,
    color: '#f34c8a',
  }, {
    text: 'Doğum',
    id: 3,
    color: '#ae7fcc',
  }, {
    text: 'Doğum Sonrası',
    id: 4,
    color: '#ff8817',
  }, {
    text: 'Evlilik',
    id: 5,
    color: '#03bb92',
  },{
    text: 'Hastalık',
    id: 6,
    color: '#03bb92',
  },{
    text: 'İş Arama',
    id: 7,
    color: '#03bb92',
  },{
    text: 'Mazeret',
    id: 8,
    color: '#03bb92',
  },{
    text: 'Süt',
    id: 9,
    color: '#03bb92',
  },{
    text: 'Uzaktan Çalışma',
    id: 10,
    color: '#03bb92',
  },{
    text: 'Ücretsiz',
    id: 11,
    color: '#03bb92',
  },{
    text: 'Vefat',
    id: 12,
    color: '#03bb92',
  },{
    text: 'Yıllık',
    id: 13,
    color: '#03bb92',
  },{
    text: 'Yol',
    id: 14,
    color: '#03bb92',
  },{
    text: '',
    id: 15,
    color: '#d4d4d4',
  },
];

@Injectable({
  providedIn: 'root',
})
export class LeaveColorService {
  getResources(): Resource[] {
    return resources;
  }
}
