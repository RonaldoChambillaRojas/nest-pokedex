import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    
    try {
        const pokemon = await this.pokemonModel.create( createPokemonDto );
        return pokemon;
        
      } catch (error) {
        this.handleExceptions( error )
      }

    // return createPokemonDto ;
  }

  findAll() {
    return `This action returns all pokemon`;
  }

 async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term})
    }
    // mongo id
    if( !pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term)
    }
    // Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()})
    }
    if(!pokemon)
      throw new NotFoundException(`Pokekemon with id, name or no '${ term }' not foud`)

    return pokemon


  }

async update(term: string, updatePokemonDto: UpdatePokemonDto) {

  if (!updatePokemonDto || Object.keys(updatePokemonDto).length === 0) {
throw new BadRequestException('Body cannot be empty');
}

const pokemon = await this.findOne(term);

if (updatePokemonDto.name) {
updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
}
    try {

  await pokemon.updateOne(updatePokemonDto, { new: true });

  return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions( error );
    }
}

 async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id)
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id: ${id} not found`)
    }
    return;
  }

  private handleExceptions(error: any){
      if ( error.code === 11000){
          throw new BadRequestException(`Pokemon exist in db ${ JSON.stringify( error.keyValue )}`);
        }
        console.log(error);
        throw new InternalServerErrorException(`Can't create pokemos - chek server logs for more imformation`);
  }
}
