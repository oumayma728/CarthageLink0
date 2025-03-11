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
        Task RegisterFactoryAsync(Factory factory/*, string licenceKey*/);
        Task UpdateFactoryAdminAsync(string factoryId, string adminId);
        //Task UpdateLicenseKeyAsync(string id, string licenseKey);
        Task<Factory?> GetFactoryByTaxNumberAsync(string number);
    }

    public class FactoryRepository : IFactoryRepository
    {
        private readonly IMongoCollection<Factory> _Factory;
        private readonly IMongoCollection<Models.License> _Licence;

        //Constructor
        public FactoryRepository(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var mongoDb = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _Factory = mongoDb.GetCollection<Factory>("Factory");
            _Licence = mongoDb.GetCollection<License>("Licence"); 

        }
        public async Task RegisterFactoryAsync(Factory factory /*, string licenceKey*/)
        {
            if (string.IsNullOrEmpty(factory.Id)) //If the user doesn’t have an ID, it generates a new one using ObjectId.GenerateNewId().
            {
                factory.Id = ObjectId.GenerateNewId().ToString();
            }

            /*creates a new License object and inserts it into the License collection.
           var licence = new License
            {
                Key = licenceKey,
                AssignedTo = factory.Id,
                Status = LicenseStatus.Active,
                CreatedAt = DateTime.UtcNow
            };
            if (factory.LicenseKey == null)
            {
                factory.LicenseKey = licenceKey; 
            };


            await _Licence.InsertOneAsync(licence);*/
            await _Factory.InsertOneAsync(factory);// inserts the user into the User collection.
        }
        public async Task<IEnumerable<Factory>> GetAllFactoriesAsync()
        {
           return  await _Factory.Find(factory => true).ToListAsync();//Find all users and converts the result to a list
            
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
            var filter = Builders<Factory>.Filter.Eq(f => f.Id, factory.Id); //Builders<User>.Filter.Eq(u => u.Id, user.Id): Creates a filter to find the user by their ID
            var update = Builders<Factory>.Update
                .Set(f => f.Name, factory.Name)
                .Set(f => f.Description, factory.Description)
                .Set(f => f.TaxNumber, factory.TaxNumber)
                .Set(f => f.Location, factory.Location)
                .Set(f => f.FactoryEmail, factory.FactoryEmail)
                .Set(f => f.AssignedDevices, factory.AssignedDevices);

            // Perform the update
            await _Factory.UpdateOneAsync(filter, update); //Updates the user in the database.It then fetches and returns the updated user.

            // After updating, fetch the updated user
            return await _Factory.Find(filter).FirstOrDefaultAsync();
        }


        public async Task UpdateFactoryAdminAsync(string factoryId, string adminId)
        {
            var filter = Builders<Factory>.Filter.Eq(f => f.Id, factoryId);
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
