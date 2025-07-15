import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.intreface';


@Injectable()
export class SeedService {

constructor(private readonly httpService: HttpService) {}

 async executeSeed(){

  const {data} = await firstValueFrom(
      this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5'),
    );

  data.results.forEach(({name, url}) => {

    const segments = url.split('/');
    const no = +segments[segments.length - 2];

    console.log({name, no})
  })

    return data.results;
    // const {data } = await this.axios.get('https://pokeapi.co/api/v2/pokemon?limit=650')
    // return data;
    
  }
  //  async executeSeedWithAxiosRef() {
  //   const response = await this.httpService.axiosRef.get('https://pokeapi.co/api/v2/pokemon?limit=650');
  //   return response.data;
  // }
}
