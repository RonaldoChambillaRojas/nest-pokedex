import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose"; // Esto es de Mongoose, no de NestJS

@Schema() // 1. Decorador de Clase
export class Pokemon extends Document {

    @Prop({ // 2. Decorador de Propiedad
        unique: true,
        index: true,
    })
    name: string; // 3. Propiedad del documento

    @Prop({ // 2. Decorador de Propiedad
        unique: true,
        index: true,
    })
    no: number; // 3. Propiedad del documento

}

// 4. Exportación del Esquema de Mongoose
export const PokemonSchema = SchemaFactory.createForClass( Pokemon )
