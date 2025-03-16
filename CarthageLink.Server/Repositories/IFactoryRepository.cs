using CarthageLink.Server.Data;
using CarthageLink.Server.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace CarthageLink.Server.Repositories
{
    public interface IFactoryRepository
    {
        Task<IEnumerable<Factory>> GetAllFactoriesAsync();
        Task<Factory?> GetFactoryByIdAsync(string id);
        Task<Factory?> UpdateFactoryAsync(Factory factory);
        Task <Factory?> GetFactoryByAdminIdAsync(string adminId);
        Task DeleteFactoryAsync(string FactoryId);
        Task RegisterFactoryAsync(Factory factory, string licenseKey);
        Task UpdateFactoryAdminIdAsync(string id, string adminId);

        //Task UpdateLicenseKeyAsync(string id, string licenseKey);
        Task<Factory?> GetFactoryByTaxNumberAsync(string number);
    }

    public class FactoryRepository : IFactoryRepository
    {
        private readonly IMongoCollection<Factory> _Factory;
        private readonly IMongoCollection<Models.License> _License;

        //Constructor
        public FactoryRepository(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var mongoDb = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _Factory = mongoDb.GetCollection<Factory>("Factory");
            _License = mongoDb.GetCollection<License>("License"); 

        }
        public async Task RegisterFactoryAsync(Factory factory , string licenseKey)
        {
            if (string.IsNullOrEmpty(factory.Id)) 
            {
                factory.Id = ObjectId.GenerateNewId().ToString();
            }
            await _Factory.InsertOneAsync(factory); //register the factory first , for the license to have the factoryID


            //creates a new License object and inserts it into the License collection.
            var license = new License
            {
                Key = licenseKey,
               AssignedTo = factory.Id,
                FactoryId = factory.Id,
               Devices = factory.AssignedDevices,
                Status = LicenseStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt= DateTime.UtcNow.AddYears(5)
            };


            await _License.InsertOneAsync(license);
        }
        public async Task<IEnumerable<Factory>> GetAllFactoriesAsync()
        {
           return  await _Factory.Find(factory => true).ToListAsync();
            
        }
        public async Task<Factory?> GetFactoryByIdAsync(string id)
        {
            return   await _Factory.Find(f => f.Id == id).FirstOrDefaultAsync();
           
        }
        public async Task<Factory?> GetFactoryByTaxNumberAsync(string number)
        {
            return await _Factory.Find(f => f.TaxNumber == number).FirstOrDefaultAsync();
        }
        
        public async Task<Factory?> GetFactoryByAdminIdAsync(string adminId)
        {
            return await _Factory.Find(factory => factory.FactoryAdminId == adminId).FirstOrDefaultAsync();
        }

        public async Task<Factory?> UpdateFactoryAsync(Factory factory)
        {
            var filter = Builders<Factory>.Filter.Eq(f => f.Id, factory.Id); 
            var update = Builders<Factory>.Update
                .Set(f => f.Name, factory.Name)
                .Set(f => f.Description, factory.Description)
                .Set(f => f.TaxNumber, factory.TaxNumber)
                .Set(f => f.Location, factory.Location)
                .Set(f => f.FactoryEmail, factory.FactoryEmail)
                .Set(f => f.AssignedDevices, factory.AssignedDevices);

            // Perform the update
            await _Factory.UpdateOneAsync(filter, update); 
            return await _Factory.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpdateFactoryAdminIdAsync(string id, string adminId)
        {
            var filter = Builders<Factory>.Filter.Eq(f => f.Id, id);
            var update = Builders<Factory>.Update.Set(f => f.FactoryAdminId, adminId);

            await _Factory.UpdateOneAsync(filter, update);
        }

        public async Task DeleteFactoryAsync(string factoryId)
        {
            var filter = Builders<Factory>.Filter.Eq(u => u.Id, factoryId);
            await _Factory.DeleteOneAsync(filter);
        }
        

    }
}
