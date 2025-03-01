using System.Text;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using System.Security.Cryptography;

namespace CarthageLink.Server.Services
{
    public interface IUserService
    {
        Task CreateFactoryAdminUserAsync(User user);
        Task CreateSuperAdminUserAsync(User user);
        // Get all Users
        Task<IEnumerable<User>> GetAllUsersAsync(); // returns collection (IEnumerable<User>) of User objects.

        // Get user by Id
        Task<User> GetUserByIdAsync(string id);

        // Update user
        Task UpdateUserAsync(User user);

        // Delete user
        Task<bool> DeleteUserAsync(string id);
    }

    // The UserService class implements IUserService
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IFactoryRepository _factoryRepository;
        private readonly LicenseRepository _licenseRepository;
        public UserService(IUserRepository userRepository , IFactoryRepository factoryRepository, LicenseRepository licenseRepository)
        {
            _userRepository = userRepository;
            _factoryRepository = factoryRepository;
            _licenseRepository = licenseRepository;

        }



        // Create a list to hold User objects, and it can only be set once
        private readonly List<User> _User= new List<User>();
        private static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                throw new ArgumentException("Password cannot be null or empty", nameof(password));
            }

            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Create User
        public async Task CreateSuperAdminUserAsync(User user)
        {
            if (user == null || string.IsNullOrEmpty(user.LicenseKey))
                throw new Exception("License Key is required for Factory Admin registration.");

            // Step 1: Validate the License Key
            var license = await _licenseRepository.GetLicenseByKeyAsync(user.LicenseKey);
            /*if (license == null)
            {
                Console.WriteLine($"License not found for key: {user.LicenseKey}");
                throw new Exception("Invalid or inactive license key.");
            }*/
            // Step 2: Assign FactoryId and Role if it's a Factory Admin
            if (user.UserRole == UserRole.FactoryAdmin)
            {
                user.FactoryId = license.AssignedTo;
            }

            // Step 3: Hash the Password before storing
            user.PasswordHash = HashPassword(user.PasswordHash);

            // Step 4: Save the User
            await _userRepository.RegisterUserAsync(user);

            // Step 5: Link Factory to the Factory Admin
            if (user.UserRole == UserRole.FactoryAdmin)
            {
                var factory = await _factoryRepository.GetFactoryByIdAsync(user.FactoryId);
                if (factory == null)
                    throw new Exception("Factory not found.");

                await _factoryRepository.UpdateFactoryAdminAsync(factory.Id, user.Id);
            }
        }

        public async Task CreateFactoryAdminUserAsync(User user)
        {
            user.PasswordHash = HashPassword(user.PasswordHash);  // Hash before saving
            await _userRepository.RegisterUserAsync(user);
        }
        // Get All users
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await Task.FromResult(_User);
        }

        // Get User by ID
        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _userRepository.GetUserByIdAsync(id);

        }
        // Update User
        public async Task UpdateUserAsync(User updateUser)
        {
            // Validate if user exists
            var existingUser = await _userRepository.GetUserByIdAsync(updateUser.Id);
            if (existingUser == null)
            {
                throw new Exception("User not found.");
            }

            // Update the user
            await _userRepository.UpdateUserAsync(updateUser);
        }



        // Delete User
        public async Task<bool> DeleteUserAsync(string id )
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return false;  // User not found
            }

             await _userRepository.DeleteUserAsync(id);
            return true;
        }
       

    }
}
