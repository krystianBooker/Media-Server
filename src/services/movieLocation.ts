import { Service, Inject } from 'typedi';
import { IMovieLocation, IMovieLocationDTO } from '../interfaces/IMovieLocation';
import { Document } from 'mongoose';
import Logger from '../loaders/logger';

@Service()
export default class MovieLocationService {
    constructor(@Inject('movieLocationModel') private movieLocationModel: Models.MovieLocationModel) {}

    public async createMovieLocation(mediaLocationInputDTO: IMovieLocationDTO): Promise<{ movieLocationRecord: IMovieLocation & Document }> {
        try {
            const movieLocationRecord = await this.movieLocationModel.create({
                ...mediaLocationInputDTO,
            });

            if (!movieLocationRecord) {
                throw new Error('Movie location cannot be created');
            }

            return { movieLocationRecord };
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }

    public async getMovieLocations(): Promise<{ movieLocationRecords: (IMovieLocation & Document)[] }> {
        const movieLocationRecords = await this.movieLocationModel.find();
        if (!movieLocationRecords) {
            throw new Error('Movie locations not found');
        }

        return { movieLocationRecords };
    }

    public async getMovieLocationByLocation(location: string): Promise<{ movieLocationRecord: IMovieLocation & Document }> {
        const movieLocationRecord = await this.movieLocationModel.findOne({ location });
        if (!movieLocationRecord) {
            throw new Error(`Movie location was not found: ${location}`);
        }
        return { movieLocationRecord };
    }
}
