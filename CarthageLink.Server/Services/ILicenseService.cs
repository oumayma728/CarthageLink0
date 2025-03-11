using System.Text;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;

namespace CarthageLink.Server.Services
{
    public interface ILicenseService
    {
        Task<string> CreateLicenseAsync(License license);

        Task<IEnumerable<License>> GetAllLicensesAsync();
        Task<License> GetLicenseByIdAsync(string licenseId);
        Task<License> GetLicenseByKeyAsync(string key);
        Task UpdateLicenseStatusAsync(string licenseId, LicenseStatus status);

        Task<License?> VerifyLicenseKeyAsync(string licenseKey);
        Task DeleteLicenseAsync(string licenseId);
        Task<License?> UpdateLicenseAsync(string id, License updatedLicense);        }
    public class LicenseService(ILicenseRepository licenseRepository, IFactoryService factoryService) : ILicenseService
    {
        private readonly ILicenseRepository _licenseRepository = licenseRepository;
        private readonly IFactoryService _factoryService = factoryService;

        private static string GenerateLicenseKey()
        {
            return Guid.NewGuid().ToString("N").ToUpper()[..16];
        }
        public async Task<string> CreateLicenseAsync(License license)
        {
            var key = GenerateLicenseKey();
            license.Key = key;

            await _licenseRepository.CreateLicenseAsync(license);

           // await _factoryService.UpdateLicenseKeyAsync(license.FactoryId, key);

            return key;
        }

        public async Task<IEnumerable<License>> GetAllLicensesAsync()
        {
            return await _licenseRepository.GetAllLicensesAsync();
            //?? throw new Exception("No licenses found.");
        }
        
        public async Task<License> GetLicenseByIdAsync(string licenseId)
        {
            return await _licenseRepository.GetByIdAsync(licenseId)
                ?? throw new Exception("License not found.");
        }
        public async Task<License> GetLicenseByKeyAsync(string key)
        {
            return await _licenseRepository.GetLicenseByKeyAsync(key);
            //?? throw new Exception("License not found.");
        }
        public async Task UpdateLicenseStatusAsync(string licenseId, LicenseStatus status)
        {
            await _licenseRepository.UpdateStatusAsync(licenseId, status);
        }
        public async Task DeleteLicenseAsync(string licenseId)
        {
            await GetLicenseByIdAsync(licenseId);
            await _licenseRepository.DeleteAsync(licenseId);
        }
        public async Task<License?> UpdateLicenseAsync(string id, License updatedLicense)
        {
            return await _licenseRepository.UpdateLicenseAsync(id, updatedLicense);
        }

        public async Task<License> VerifyLicenseKeyAsync(string licenseKey)
        {
            if (string.IsNullOrEmpty(licenseKey))
            {
                throw new ArgumentException("License key cannot be null or empty.", nameof(licenseKey));
            }

            // Retrieve the license from the repository by key
            var license = await _licenseRepository.GetLicenseByKeyAsync(licenseKey);

            if (license == null)
            {
                throw new Exception("Invalid license key.");
            }

            if (license.Status != LicenseStatus.Pending)
            {
                throw new Exception("License key is not in a valid state.");
            }

            return license;
        }

    }
}
