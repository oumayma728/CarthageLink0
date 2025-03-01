using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;

namespace CarthageLink.Server.Services
{
    public interface IFactoryService
    {

        Task <string> CreateFactoryAsync(Factory factory);
        // Get all Factories
        Task<IEnumerable<Factory>> GetAllFactoriesAsync(); // returns collection (IEnumerable<User>) of User objects.

        // Get factory by Id
        Task<Factory> GetFactoryByIdAsync(string id);

        // Update factory
        Task UpdateFactoryAsync(Factory factory);

        // Delete factory
        Task<bool> DeleteFactoryAsync(string id);
        Task<Factory?> GetFactoryByAdminIdAsync(string adminId);
        Task<List<Device>> GetFactoryDevicesAsync(string factoryId);
    }


    // The UserService class implements IUserService
    public class FactoryService : IFactoryService
    {
        private readonly IFactoryRepository _factoryRepository;
        private readonly IDeviceRepository _deviceRepository; // ✅ Correct naming and declaration

        public FactoryService(IFactoryRepository factoryRepository, IDeviceRepository deviceRepository) // ✅ Include deviceRepository in parameters
        {
            _factoryRepository = factoryRepository;
            _deviceRepository = deviceRepository; // ✅ Now correctly assigned
        }


        private string GenerateLicenseKey()
        {
            return Guid.NewGuid().ToString("N").ToUpper(); // Generates a random 32-character key
        }

        // Create a list to hold User objects, and it can only be set once
        private readonly List<Factory> _Factory = new List<Factory>();

        // Create Factory
        public async Task<string> CreateFactoryAsync(Factory factory)
        {
            string licenseKey = GenerateLicenseKey();

            await _factoryRepository.RegisterFactoryAsync(factory,licenseKey);
            return licenseKey;

        }

        // Get All Factories
        public async Task<IEnumerable<Factory>> GetAllFactoriesAsync()
        {
            return await Task.FromResult(_Factory);
        }

        // Get Factory by ID
        public async Task<Factory?> GetFactoryByIdAsync(string id)
        {
            return await _factoryRepository.GetFactoryByIdAsync(id);

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
                return false;  // User not found
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
        public async Task<List<Device>> GetFactoryDevicesAsync(string factoryId)
        {
            if (string.IsNullOrEmpty(factoryId))
            {
                return new List<Device>(); // Return empty list if factory ID is invalid.
            }

            // Query the repository to get devices for this factory
            return await _deviceRepository.GetDevicesByFactoryIdAsync(factoryId);
        }

    } }
