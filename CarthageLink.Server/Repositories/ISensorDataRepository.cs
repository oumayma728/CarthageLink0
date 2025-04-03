using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarthageLink.Server.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using BCrypt.Net;
using CarthageLink.Server.Data;


namespace CarthageLink.Server.Repositories
{
    public interface ISensorDataRepository
    {
        Task CreateAsync(SensorData data);
        Task<List<SensorData>> GetByDeviceIdAsync(string deviceId, int limit = 100);
        public class SensorDataRepository : ISensorDataRepository
        {
            private readonly IMongoCollection<SensorData> _SensorData;

            public SensorDataRepository(IOptions<DatabaseSettings> settings)
            {
                var mongoClient = new MongoClient(settings.Value.Connection);
                var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
                _SensorData = database.GetCollection<SensorData>("SensorData");
            }

            public async Task CreateAsync(SensorData data)
            {
                await _SensorData.InsertOneAsync(data);
            }

            public async Task<List<SensorData>> GetByDeviceIdAsync(string deviceId, int limit = 100)
            {
                return await _SensorData
                    .Find(x => x.DeviceId == deviceId)
                    .SortByDescending(x => x.Timestamp)
                    .Limit(limit)
                    .ToListAsync();
            }
        }
    }
}