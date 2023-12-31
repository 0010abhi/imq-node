import { Injectable } from '@nestjs/common';
import { Client, DirectionsRequest, DirectionsResponse, Status } from "@googlemaps/google-maps-services-js";

/**
 * Google Api Service in use
 * https://googlemaps.github.io/google-maps-services-js/enums/TravelMode.html
 * 
 */

@Injectable()
export class GoogleMapService {
	private GOOGLE_API_KEY: string = 'AIzaSyDeBJQecxX4ZjjPL6aWLogO5bwQusF4kZw';
	private client: any = new Client({});

	async getDirections(source: string, desitination: string): Promise<any> {
		const params: any = {
			origin: source,
			destination: desitination,
			key: this.GOOGLE_API_KEY,
		};

		console.log('Params for getDirections', params);
		try {
			const response = await this.client.directions({
				params: params,
			})
			if (response) {
				const { data } = response;
				console.log('>>> data came from directions api', data);
				if (data.status === Status.OK) {
					// Directions data is available in data.routes
					const routes = data.routes;
					console.log('returning routes', routes)
					return routes;
				} else {
					console.error('Directions API request failed:', data.error_message);
				}
			}
		} catch (err: any) {
			console.error('Error making Directions API request:', err);
		}

	}

	async getPlaces(source: string, placeCategory: string, placeSubCategory: string): Promise<any> {
		const params = {
			// name: source,
			// keyword: `${placeSubCategory} ${placeCategory} in ${source}`,
			key: this.GOOGLE_API_KEY,
			location: { lat: 37.7749, lng: -122.4194 },
			radius: 1000,
			type: 'restaurant'
		};
		try {
			const response = await this.client.placesNearby({
				params: params,
			})
			console.log('>>> finding plaes newrby response', response)
			const { data } = response;
			if (data.status === Status.OK) {
				// Directions data is available in data.routes
				const places = data.results;
				return places;
			} else {
				console.error('Directions API request failed:', data.error_message);
			}
		}
		catch (error: any) {
			console.error('Error making Directions API request:', error);
		};
	}
}
