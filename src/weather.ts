import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

// Add a weather tool
server.registerTool(
  "get_weather",
  {
    title: "Get Current Weather",
    description:
      "Get current weather data for a given latitude and longitude, Ask user for location (city, country, state, region) first. Don't ask for latitude and longitude or gps coordinates directly.",
    inputSchema: {
      latitude: z.number().describe("Latitude coordinate"),
      longitude: z.number().describe("Longitude coordinate"),
    },
  },
  async ({ latitude, longitude }) => {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current:
          "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,wind_speed_10m",
        wind_speed_unit: "kmh",
        temperature_unit: "celsius",
        precipitation_unit: "mm",
      });

      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // @ts-expect-error - data is of type unknown
      const current = data.current;

      const weatherData = {
        temperature2m: current.temperature_2m,
        relativeHumidity2m: current.relative_humidity_2m,
        apparentTemperature: current.apparent_temperature,
        isDay: current.is_day === 1,
        precipitation: current.precipitation,
        rain: current.rain,
        windSpeed10m: current.wind_speed_10m,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(weatherData, null, 2),
          },
        ],
        structuredOutput: {
          temperature: {
            current: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            unit: "celsius",
          },
          humidity: {
            value: current.relative_humidity_2m,
            unit: "percent",
          },
          wind: {
            speed: current.wind_speed_10m,
            unit: "kmh",
          },
          precipitation: {
            total: current.precipitation,
            rain: current.rain,
            unit: "mm",
          },
          conditions: {
            isDay: current.is_day === 1,
            dayNight: current.is_day === 1 ? "day" : "night",
          },
        },
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Error fetching weather data: ${message}`,
          },
        ],
      };
    }
  },
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
