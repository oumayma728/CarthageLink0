using CarthageLink.Server.Data;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;

using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace CarthageLink.Server.Services
{
    public interface IDeviceService
    {
        // Get all Factories
        Task<IEnumerable<Device>> GetAllDevices(); // returns collection (IEnumerable<User>) of User objects.
        Task<IEnumerable<Device>> GetDeviceByFactoryIdAsync(string factoryId);        // Delete factory
        Task UpdateDeviceAsync(Device updatedDevice);
        Task CreateDeviceAsync(Device device);
        Task DeleteDeviceAsync(string deviceId);
        Task<Device> GetDeviceByIdAsync(string deviceId);
    }
    public class DeviceService : IDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;

        public DeviceService(IDeviceRepository deviceRepository)
        { _deviceRepository = deviceRepository;
        }
        private readonly List<Device> _device = new List<Device>();

        public async Task CreateDeviceAsync(Device device)
        {
            await _deviceRepository.CreateDeviceAsync(device);

        }

        public async Task<IEnumerable<Device>> GetAllDevices()
        {
            return await _deviceRepository.GetAllDevicesAsync();
        }
        public async Task<Device> GetDeviceByIdAsync(string DeviceId)
        {
            return await _deviceRepository.GetDeviceByIdAsync(DeviceId);
        }
        public async Task<IEnumerable<Device>> GetDeviceByFactoryIdAsync(string factoryId)

        { return await _deviceRepository.GetDevicesByFactoryIdAsync(factoryId);
        }

        public async Task UpdateDeviceAsync(Device updatedDevice)
        {
            var existingDevice = await _deviceRepository.GetDeviceByIdAsync(updatedDevice.Id);
            if (existingDevice == null)
            {
                throw new Exception("Factory not found.");
            }

            // Update the user
            await _deviceRepository.UpdateDeviceAsync(updatedDevice);
        }
        public async Task DeleteDeviceAsync(string DeviceId)
           {    await GetDeviceByIdAsync(DeviceId);

            await _deviceRepository.DeleteDeviceAsync(DeviceId);

        }

    }
}