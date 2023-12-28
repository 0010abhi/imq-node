import { Injectable } from '@nestjs/common';
import { Client, Status } from "@googlemaps/google-maps-services-js";

@Injectable()
export class GoogleMapService {
	private GOOGLE_API_KEY: string = '';
	private client: any = new Client({});

	getDirections(source: string, desitination: string): any {
		const params = {
			origin: source,
			destination: desitination,
			key: this.GOOGLE_API_KEY,
		};

		console.log('Params for getDirections', params);

		this.client.directions({
			params: params,
		})
			.then((response: any) => {
				const { data } = response;
				console.log('>>> data came from directions api', data);
				if (data.status === Status.OK) {
					// Directions data is available in data.routes
					const routes = data.routes;
					return routes;
				} else {
					console.error('Directions API request failed:', data.error_message);
				}
			})
			.catch((error: any) => {
				console.error('Error making Directions API request:', error);
			});
	}

	getPlaces(source: string): any {
		const params = {
			name: source,
			key: this.GOOGLE_API_KEY,
		};

		this.client.placesNearby({
			params: params,
		})
			.then((response: any) => {
				const { data } = response;

				if (data.status === Status.OK) {
					// Directions data is available in data.routes
					const routes = data.routes;
					return routes;
				} else {
					console.error('Directions API request failed:', data.error_message);
				}
			})
			.catch((error: any) => {
				console.error('Error making Directions API request:', error);
			});
	}
}
