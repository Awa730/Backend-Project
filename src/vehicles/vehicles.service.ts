import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

export type Vehicle = {
  id: number;
  name: string;
  price: number;
  category?: string;
};

@Injectable()
export class VehiclesService {
  private vehicles: Vehicle[] = [];
  private idCounter = 1;

  create(createVehicleDto: CreateVehicleDto): Vehicle {
    const newVehicle: Vehicle = {
      id: this.idCounter++,
      name: createVehicleDto.name,
      price: createVehicleDto.price,
      category: createVehicleDto.category,
    };
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  findAll(): Vehicle[] {
    return this.vehicles;
  }

  findOne(id: number): Vehicle | undefined {
    return this.vehicles.find((vehicle) => vehicle.id === id);
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto): Vehicle | null {
    const vehicleIndex = this.vehicles.findIndex((v) => v.id === id);
    if (vehicleIndex === -1) return null;

    this.vehicles[vehicleIndex] = {
      ...this.vehicles[vehicleIndex],
      ...updateVehicleDto,
    };
    return this.vehicles[vehicleIndex];
  }

  remove(id: number): boolean {
    const vehicleIndex = this.vehicles.findIndex((v) => v.id === id);
    if (vehicleIndex === -1) return false;

    this.vehicles.splice(vehicleIndex, 1);
    return true;
  }
}
