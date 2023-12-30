// app.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { GoogleMapService } from './google-map.service';

@Controller('locations')
export class GoogleMapController {
  constructor(private readonly googleMapsService: GoogleMapService) {}

  @Get(':address')
  async getLocation(@Param('address') address: string): Promise<{ latitude: string; longitude: string } | null>  {
    return null;
    // this.googleMapsService.getPlaces(address);
  }
}
