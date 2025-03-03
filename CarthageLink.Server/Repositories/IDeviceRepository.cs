using CarthageLink.Server.Models;
using MongoDB.Driver;

namespace CarthageLink.Server.Repositories
{
    public interface IDeviceRepository
    {
        Task<List<Device>> GetDevicesByFactoryIdAsync(string factoryId);
        Task<List<Device>> GetAllDevices();

    }
    public class DeviceRepository : IDeviceRepository
    {
        private readonly IMongoCollection<Device> _device;


        public DeviceRepository(IMongoDatabase database)
        {
            _device = database.GetCollection<Device>("Devices");

        }
        public async Task<List<Device>> GetDevicesByFactoryIdAsync(string factoryId)
        {
            return await _device.Find(device => device.FactoryId == factoryId).ToListAsync();
        }
        public async Task<List<Device>> GetAllDevices()
        {
             return await _device.Find(factory => true).ToListAsync();//Find all users and converts the result to a list

        }
    }
}
