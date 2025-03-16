using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;

namespace CarthageLink.Server.Services
{
    public interface IFactoryService
    {

        Task  <string> CreateFactoryAsync(Factory factory);
        // Get all Factories
        Task<IEnumerable<Factory>> GetAllFactoriesAsync(); // returns collection (IEnumerable<User>) of User objects.

        // Get factory by Id
        Task<Factory> GetFactoryByIdAsync(string id);
        Task<Factory?> GetFactoryByTaxNumberAsync(string number);
        // Update factory
        Task UpdateFactoryAsync(Factory factory);

        // Delete factory
        Task<bool> DeleteFactoryAsync(string id);
        Task<Factory?> GetFactoryByAdminIdAsync(string adminId);
        Task<IEnumerable<Device>> GetFactoryDevicesAsync(string factoryId);
        Task UpdateFactoryAdminIdAsync(string factoryId, string adminId);


    }


    // The UserService class implements IUserService
    public class FactoryService : IFactoryService
    {
        private readonly IFactoryRepository _factoryRepository;
        private readonly IDeviceRepository _deviceRepository; 

        public FactoryService(IFactoryRepository factoryRepository, IDeviceRepository deviceRepository) 
        {
            _factoryRepository = factoryRepository;
            _deviceRepository = deviceRepository; 
        }


        private string GenerateLicenseKey()
        {
            return Guid.NewGuid().ToString("N").ToUpper(); // Generates a random 32-character key
        }

        // Create a list to hold User objects, and it can only be set once
        //private readonly List<Factory> _Factory = new List<Factory>();

        // Create Factory
        public async Task<string> CreateFactoryAsync(Factory factory)
        {
            // Generate a license key (you can customize this method to your needs)
            string licenseKey = GenerateLicenseKey();
            factory.LicenseKey = licenseKey;  // Assign generated key to the factory

            // Register the factory (passing the factory and the generated key)
            await _factoryRepository.RegisterFactoryAsync(factory, licenseKey);


            // Return the generated license key
            return licenseKey;
        }


        // Get All Factories
        public async Task<IEnumerable<Factory>> GetAllFactoriesAsync()
        {
            return await _factoryRepository.GetAllFactoriesAsync();
        }

        // Get Factory by ID
        public async Task<Factory?> GetFactoryByIdAsync(string id)
        {
            return await _factoryRepository.GetFactoryByIdAsync(id)
           ?? throw new Exception("Factory not found.");

        }
        public async Task<Factory?> GetFactoryByTaxNumberAsync(string number)
        {
            return await _factoryRepository.GetFactoryByTaxNumberAsync(number);
        }
        // Update Factory
        public async Task UpdateFactoryAsync(Factory updateFactory)
        {
            // Validate if user exists
            var existingFactory = await _factoryRepository.GetFactoryByIdAsync(updateFactory.Id);
            if (existingFactory == null)
            {
                throw new Exception("Factory not found.");
            }

            // Update the user
            await _factoryRepository.UpdateFactoryAsync(updateFactory);
        }



        // Delete User
        public async Task<bool> DeleteFactoryAsync(string id)
        {
            var Factory = await _factoryRepository.GetFactoryByIdAsync(id);
            if (Factory == null)
            {
                return false;
            }

            await _factoryRepository.DeleteFactoryAsync(id);
            return true;
        }
        public async Task<Factory?> GetFactoryByAdminIdAsync(string adminId)
        {
            if (string.IsNullOrEmpty(adminId))
            {
                return null;
            }

            // Fetch the factory where AdminId matches the given adminId
            return await _factoryRepository.GetFactoryByAdminIdAsync(adminId);
        }
        public async Task<IEnumerable<Device>> GetFactoryDevicesAsync(string factoryId)
        {
            if (string.IsNullOrEmpty(factoryId))
            {
                return new List<Device>(); // Return empty list if factory ID is invalid.
            }

            // Query the repository to get devices for this factory
            return await _deviceRepository.GetDevicesByFactoryIdAsync(factoryId);
        }

        public async Task UpdateFactoryAdminIdAsync(string factoryId, string adminId)
        {
            await _factoryRepository.UpdateFactoryAdminIdAsync(factoryId, adminId);
        }


    }
}
