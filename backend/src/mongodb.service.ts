import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongodbService {
  constructor(@InjectConnection() private connection: Connection) {}

  getConnection(): Connection {
    return this.connection;
  }

  async testConnection(): Promise<boolean> {
    return this.connection.readyState === 1;
  }
}
