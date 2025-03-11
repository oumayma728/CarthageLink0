using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Threading.Tasks;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using Microsoft.AspNetCore.Identity;

namespace CarthageLink.Server.Services
{
    public interface IUserService
    {
        Task RegisterUserAsync(RegisterModel model);
        Task<string> LoginUserAsync(LogInModel loginModel);
        Task<string> CreateUserAsync(User user, UserRole role, string TaxNumber);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(string id);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
        bool VerifyPassword(string storedPassword, string enteredPassword);
    }

    public class UserService(
        IUserRepository userRepository,
        IFactoryService factoryService,
        ITokenService tokenService,
         ILicenseService licenseService,
        ILicenseRepository licenseRepository
            ) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly IFactoryService _factoryService = factoryService ?? throw new ArgumentNullException(nameof(factoryService));
        private readonly ITokenService _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        private readonly ILicenseService _licenseService = licenseService ?? throw new ArgumentNullException(nameof(licenseService));
        private readonly ILicenseRepository _licenseRepository = licenseRepository ?? throw new ArgumentNullException(nameof(licenseRepository));

        public async Task RegisterUserAsync(RegisterModel model)
        {
            try
            {

                var existingUser = await _userRepository.GetUserByEmailAsync(model.Email);

                if (existingUser == null)
                {
                    string hashedPassword = HashPassword(model.Password);
                    var user = new User
                    {
                        Name = model.Name,
                        Email = model.Email,
                        Phone = model.Phone,
                        Password = hashedPassword,
                        IsRegistrationComplete = false
                    };

                    await _userRepository.CreateUserAsync(user);
                }
                else
                {
                    // Step 2: Complete registration (update existing user with additional info)
                    if (existingUser.IsRegistrationComplete)
                        throw new Exception("User registration is already complete.");

                    // Validate the license key
                    if (string.IsNullOrEmpty(model.LicenseKey))
                        throw new Exception("License key is required to complete registration.");

                    var license = await _licenseService.VerifyLicenseKeyAsync(model.LicenseKey);

                    // Update the existing user with additional info
                    existingUser.FactoryId = license.FactoryId;
                    existingUser.Role = UserRole.FactoryAdmin; // Assign FactoryAdmin role
                    existingUser.AssignedDevices = license.Devices;
                    existingUser.IsRegistrationComplete = true; // Mark as complete

                    await _userRepository.UpdateUserAsync(existingUser);

                    // Update the license status
                    await _licenseService.UpdateLicenseStatusAsync(license.Id!, LicenseStatus.Active);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to create or update user.", ex);
            }
        }
        public async Task<string> LoginUserAsync(LogInModel loginModel)
        {
            try
            { 

                var user = await _userRepository.GetUserByEmailAsync(loginModel.Email)
                    ?? throw new Exception("Invalid credentials");

                if (!VerifyPassword(user.Password, loginModel.Password))
                    throw new Exception("Invalid credentials");

                return _tokenService.GenerateJwtToken(user);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to log in user.", ex);
            }
        }

        public async Task<string> CreateUserAsync(User user, UserRole role, string TaxNumber)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (string.IsNullOrEmpty(TaxNumber))
                    throw new ArgumentException("Tax Number cannot be null or empty", nameof(TaxNumber));

                if (await _userRepository.GetUserByEmailAsync(user.Email) != null)
                    throw new Exception("User with this email already exists.");

                var factory = await _factoryService.GetFactoryByTaxNumberAsync(TaxNumber)
                    ?? throw new Exception("Factory does not exist.");

                user.FactoryId = factory.Id;
                user.Role = role;

                user.Password = HashPassword(user.Password);
                var licenseKey = GenerateLicenseKey();
                user.LicenseKey = licenseKey;
                var license = new Models.License
                {
                    Key = licenseKey,
                    Status = LicenseStatus.Pending,
                    AssignedTo = user.Id,
                    FactoryId = factory.Id,
                    userRole = role
                };

                await _licenseRepository.CreateLicenseAsync(license);

                await _userRepository.CreateUserAsync(user);

                // If you need to generate a license key in the future, uncomment and implement this:

                return licenseKey;

            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to register user.", ex);
            }
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
           
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    throw new ArgumentException("User ID cannot be null or empty", nameof(id));

                return await _userRepository.GetUserByIdAsync(id);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to retrieve user by ID.", ex);
            }
        }

        public async Task UpdateUserAsync(User user)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                await _userRepository.UpdateUserAsync(user);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to update user.", ex);
            }
        }

        public async Task DeleteUserAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    throw new ArgumentException("User ID cannot be null or empty", nameof(id));

                await _userRepository.DeleteUserAsync(id);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to delete user.", ex);
            }
        }

        public bool VerifyPassword(string storedPassword, string enteredPassword)
        {
            try
            {
                if (string.IsNullOrEmpty(storedPassword) || string.IsNullOrEmpty(enteredPassword))
                    throw new ArgumentException("Passwords cannot be null or empty");

                var passwordHasher = new PasswordHasher<User>();
                var result = passwordHasher.VerifyHashedPassword(null, storedPassword, enteredPassword);

                return result == PasswordVerificationResult.Success;
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to verify password.", ex);
            }
        }

        private static string HashPassword(string password)
        {
            try
            {
                if (string.IsNullOrEmpty(password))
                    throw new ArgumentException("Password cannot be null or empty", nameof(password));

                return BCrypt.Net.BCrypt.HashPassword(password);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to hash password.", ex);
            }
        }

        private static string GenerateLicenseKey()
        {
            try
            {
                return Guid.NewGuid().ToString("N");
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to generate license key.", ex);
            }
        }
    }
}