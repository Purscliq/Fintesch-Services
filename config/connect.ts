import { connect, disconnect, ConnectOptions } from 'mongoose';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') config();

export class Db {
    private uri: string;
    private option: ConnectOptions;

    constructor() {
        this.uri = <string>process.env.MongoURI;
        this.option = <ConnectOptions>{ useNewUrlParser: true, useUnifiedTopology: true };
    }

    public connectToDatabase = async() => {
        try {
          await connect( this.uri, this.option );
          console.log('Connected to MongoDB!');
        } catch (error) {
          console.error('Failed to connect to MongoDB:', error);
        }
      };
      
    public disconnectFromDatabase = async() => {
        try {
          await disconnect();
          console.log('Disconnected from MongoDB!');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
        }
    };    
} 


