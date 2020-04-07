class PokemonsController < ApplicationController
  def create
    @trainer = Trainer.find(strong_params)

    if @trainer.pokemons.length < 6
      pokemon = generate_pokemon
      render json: pokemon
    else
      render json: { error: "Can't create, team is full" }, status: :method_not_allowed
    end
  end

  def destroy
    pokemon = Pokemon.find(params[:id])
    pokemon.destroy

    render json: pokemon
  end

  private

  def generate_pokemon
    name = Faker::Name.first_name
    species = Faker::Games::Pokemon.name
    Pokemon.create(nickname: name, species: species, trainer: @trainer)
  end

  def strong_params
    params.require(:trainer_id)
  end
end
