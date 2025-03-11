using CarthageLink.Server.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.Extensions.Logging;
using CarthageLink.Server.Data;
namespace CarthageLink.Server.Data
{
    public class MongoDbContext
    {
        private readonly MongoClient _client;
        private readonly IMongoDatabase _database;
        private readonly ILogger<MongoDbContext> _logger;
        private readonly DatabaseSettings _databaseSettings;

        public MongoDbContext(DatabaseSettings databaseSettings, ILogger<MongoDbContext> logger)
        {
            _logger = logger;

            // Use values from DatabaseSettings
            var connectionString = databaseSettings.Connection;
            var databaseName = databaseSettings.DatabaseName;

            // Initialize MongoDB client and database
            _client = new MongoClient(connectionString);
            _database = _client.GetDatabase(databaseName);

            // Uncomment this line if you want to check the connection status during initialization
            // Task.Run(async () => await InitializeAsync());
        }

        // MongoDB collections
        public IMongoCollection<User> User => _database.GetCollection<User>("User");
        public IMongoCollection<Factory> Factory => _database.GetCollection<Factory>("Factory");
        public IMongoCollection<Device> Device => _database.GetCollection<Device>("Device");
        public IMongoCollection<License> License => _database.GetCollection<License>("License");
        //public IMongoCollection<SensorData> SensorData => _database.GetCollection<SensorData>("SensorData");

    }
}
