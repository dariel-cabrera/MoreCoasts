
import * as joi from 'joi';

import { config } from 'dotenv';
config(); // Lee el archivo .env


interface EnvVars{
	PORT:number;
	
	CALCULATION_MS_HOST: string;

	CALCULATION_MS_PORT: number;

	APP_URL_CLIENT:string;

	APP_URL_API:string;

	MONGO_URI:string;

}
const envsSchema= joi.object({
     PORT: joi.number().required(),
	 CALCULATION_MS_HOST: joi.string().required(),
	 CALCULATION_MS_PORT: joi.number().required(),
	 APP_URL_CLIENT:joi.string().required(),
	 APP_URL_API:joi.string().required(),
	 MONGO_URI:joi.string().required(),
})
.unknown(true);


const {error, value}= envsSchema.validate(process.env);

if (error) {
	throw new Error (`Config validation error: ${error.message}`);

}
const envVars: EnvVars= value;

export const envs = {
	port : envVars.PORT,
	calculationMicroserviceHost: envVars.CALCULATION_MS_HOST,
	calculationMicroservicePort: envVars.CALCULATION_MS_PORT,
	app_url_client:envVars.APP_URL_CLIENT,
	app_url_api:envVars.APP_URL_API,
	mongo_uri:envVars.MONGO_URI
}
