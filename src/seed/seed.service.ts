import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.intreface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    private readonly http: AxiosAdapter,

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete todoo

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // const pokemon = await this.pokemonModel.create({name, no});
      pokemonToInsert.push({ name, no });

    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'seed Executed';
  }
}
