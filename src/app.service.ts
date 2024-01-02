import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import OpenAI from "openai";
import { GoogleMapService } from './google-map/google-map.service';


@Injectable()
export class AppService {
  /**
   * Inject External Requirement like Services
   * @param configService
   * @param googleMapService 
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly googleMapService: GoogleMapService
  ) { }

  /**
   * Private Variables
   *  Intent Categories
   *  Open AI Params
   */
  private queryContext: string[] = [];

  private placeServiceIntent: string[] = ["find_places"];
  private directionServiceIntent: string[] = ["distance", "shortest_route", "driving directions"];

  private openAiMessageSystemContent: string = `Use the following step-by-step instructions to respond to user inputs.
  step 1 - Analyze the intent of given user query.
  step 2 - Extract all the places mentioned in an array.
  step 3 - Extract preferred mode of travel in given query if mentioned.
  step 4 - Extract place category in given query if mentioned.
  step 5 - Extract place sub category like nearest, top rated in given query if mentioned.
  step 6 - prepare a natural langugae response for used for given query adapt a persona of map guide.
  step 7 - create a json with keys like intent, places, travelMode, placeCategory, placeSubCategory, stringResponse and put relevant values came from previous steps.
  `;
  // private openAiMessageSystemContent: string = `for the given query by user: 
  // 1. Analyze the intent in simple text
  // 2. Figure out how many places are mentioned
  // 3. If there is 1 place then identify it as placename
  // 4. If there are 2 places then put extract as source and destination
  // 5. If there are more than 2 places then put them in array as places
  // 6. Give complete answer including json with keys mentioing intent in very short format with description and metadata and include additional places key based on 3,4 or 5 step and metadta.
  // `;
  private openAiMessageUserContent: string = `
    """include text here"""
    """include json here"""
  `

  /**
   * This is used to process user query for interactivae map.
   * @param request 
   * @returns 
   */
  async main(request: Request): Promise<any> {
    const openai = new OpenAI({
      apiKey: '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'
    });
    /**
     * Call Open AI Chat Completion API 
     */
    const completion: any = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          "role": "system",
          "content": this.openAiMessageSystemContent
        },
        {
          "role": "user",
          "content": request.body.userString
        }
      ]

    });

    const opanAiResponse: any = completion.choices;
    
    try {  
      const opanAiResponseJson: any = JSON.parse(opanAiResponse[0]?.message?.content);
      console.log('>>> intent of opanAiResponseJson', opanAiResponseJson.intent);
      if (this.directionServiceIntent.indexOf(opanAiResponseJson.intent) > -1) {
        const [source, destination] = opanAiResponseJson.places;
        const routes = await this.googleMapService.getDirections(source, destination);
        console.log('>>> google api response', routes)
        return {
          opanAiResponse: opanAiResponseJson,
          mapResponse: routes
        }
      } else if (this.placeServiceIntent.indexOf(opanAiResponseJson.intent) > -1) {
        const { places, placeCategory, placeSubCategory } = opanAiResponseJson;
        const [source] = places;
        const placesResponse: any = await this.googleMapService.getPlaces(source, placeCategory, placeSubCategory);
        console.log(">>> google api response", placesResponse);
        return {
          opanAiResponse,
          mapResponse: placesResponse
        }
      }
      else {
        return opanAiResponse;
      }
    } catch (err) {
      console.log('Error in parsing response')
      // const source = 'New York';
      // const destination = 'Los Angeles';
      // console.log(this.googleMapService.getDirections(source, destination));
      // console.log(this.googleMapService.getPlaces(source));
      return opanAiResponse;
    }
  }

}
