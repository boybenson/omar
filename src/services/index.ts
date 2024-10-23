import axios, { AxiosResponse } from "axios";
import { IGetIncidentsParams, IPostIncidentPayload } from "../interfaces";
import { OPEN_WEATHER_API } from "../constants";
import Incident from "../database/models/incident";
import { Op } from "sequelize";

export const incidentReport = async (payload: IPostIncidentPayload) => {
  const axiosReq: AxiosResponse = await axios.get(OPEN_WEATHER_API);
  try {
    const weatherData = axiosReq.data;
    const newData = await Incident.create({
      city: payload.city,
      client_id: payload.client_id,
      country: payload.country,
      incident_desc: payload.incident_desc,
      weather_report: weatherData,
    });

    return newData.dataValues;
  } catch (error) {
    console.log(error);
  }
};

export const getFilteredIncidents = async (params: IGetIncidentsParams) => {
  const { city, tempmin, tempmax, hummin, hummax } = params;

  const whereConditions: any = {};

  if (city) {
    whereConditions.city = city;
  }

  if (tempmin || tempmax) {
    whereConditions["weather_report.main.temp"] = {
      ...(tempmin && { [Op.gte]: parseFloat(tempmin) }),
      ...(tempmax && { [Op.lte]: parseFloat(tempmax) }),
    };
  }

  if (hummin || hummax) {
    whereConditions["weather_report.main.humidity"] = {
      ...(hummin && { [Op.gte]: parseFloat(hummin) }),
      ...(hummax && { [Op.lte]: parseFloat(hummax) }),
    };
  }

  const incidents = await Incident.findAll({
    where: whereConditions,
  });

  console.log(incidents);

  return incidents;
};
