using CarthageLink.Server.Models;
using MongoDB.Driver;

namespace CarthageLink.Server.Repositories
{
    public interface IDeviceRepository
    {
        Task<List<Device>> GetDevicesByFactoryIdAsync(string factoryId);

    }
    public class DeviceRepository : IDeviceRepository
    {
        private readonly IMongoCollection<Device> _devices;


        public DeviceRepository(IMongoDatabase database)
        {
            _devices = database.GetCollection<Device>("Devices");

        }
        public async Task<List<Device>> GetDevicesByFactoryIdAsync(string factoryId)
        {
            return await _devices.Find(device => device.FactoryId == factoryId).ToListAsync();
        }

    }
}
