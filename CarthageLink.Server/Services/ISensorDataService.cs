using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CarthageLink.Server.Services
{
    public interface ISensorDataService
    {
        Task SaveSensorDataAsync(SensorData data);
        Task<List<SensorData>> GetRecentDataAsync(string deviceId);
    }

    public class SensorDataService : ISensorDataService
    {
        private readonly ISensorDataRepository _repository;
        private readonly ILogger<SensorDataService> _logger;

        public SensorDataService(
            ISensorDataRepository repository,
            ILogger<SensorDataService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task SaveSensorDataAsync(SensorData data)
        {
            try
            { 
                // Test data
                var testData = new SensorData
                {
                    DeviceId = "TestDevice123",
                    Data = "Sample Sensor Data",
                    Timestamp = DateTime.UtcNow
                };

                await _repository.CreateAsync(testData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SaveSensorDataAsync");
                throw; // Make sure this exception is caught somewhere
            }
        }


        public async Task<List<SensorData>> GetRecentDataAsync(string deviceId)
        {
            // Fetch recent data based on deviceId
            try
            {
                _logger.LogInformation($"Fetching recent sensor data for device {deviceId}");
                var data = await _repository.GetByDeviceIdAsync(deviceId);
                return data;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to retrieve data for device {deviceId}");
                throw;
            }
        }
    }
}
