using MongoDB.Driver;
using CarthageLink.Server.Models;

public class LicenseRepository
{
    private readonly IMongoCollection<License> _licenseCollection;

    public LicenseRepository(IMongoDatabase database)
    {
        _licenseCollection = database.GetCollection<License>("Licenses");
    }

    public async Task<License> GetLicenseByKeyAsync(string licenseKey)
    {
        return await _licenseCollection.Find(l => l.Key == licenseKey && l.Status == "Active").FirstOrDefaultAsync();
    }

    public async Task CreateLicenseAsync(License license)
    {
        await _licenseCollection.InsertOneAsync(license);
    }
    //public async Task}
}