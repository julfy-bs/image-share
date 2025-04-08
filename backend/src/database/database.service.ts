import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

interface DatabaseConfig {
	type: string;
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	entities: string[];
	synchronize: boolean;
}

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
	dbConfig = this.configService.get<DatabaseConfig>('database');
	
	constructor(private configService: ConfigService) {}
	
	createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
		return {
			type: this.dbConfig.type,
			host: this.dbConfig.host,
			port: this.dbConfig.port,
			username: this.dbConfig.username,
			password: this.dbConfig.password,
			database: this.dbConfig.database,
			entities: this.dbConfig.entities,
			synchronize: this.dbConfig.synchronize,
		} as TypeOrmModuleOptions;
	}
}
