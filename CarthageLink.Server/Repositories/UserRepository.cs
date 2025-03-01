using System.Text;
using CarthageLink.Server.Models;
using MongoDB.Driver;
using CarthageLink.Server.Data;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using BCrypt.Net; // For secure password hashing

namespace CarthageLink.Server.Repositories
{
    //This is an interface that defines the methods the UserRepository class must implement.
    public interface IUserRepository
    {
        Task<List<User>>GetAllUsersAsync();
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(string id);
        Task <User?> UpdateUserAsync(User user);
        Task DeleteUserAsync(string userId);
        Task RegisterUserAsync(User user);
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
    }

    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _User;
        private readonly IMongoCollection<License> _License;
        //Constructor
        public UserRepository(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var mongoDb = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _User = mongoDb.GetCollection<User>("User");
            _License = mongoDb.GetCollection<License>("License"); // ✅ Initialize `_License`
        }
        public async Task RegisterUserAsync(User user)
        {
            if (string.IsNullOrEmpty(user.Id)) //If the user doesn’t have an ID, it generates a new one using ObjectId.GenerateNewId().
            {
                user.Id = ObjectId.GenerateNewId().ToString();
            }

            user.PasswordHash = HashPassword(user.PasswordHash); // ✅ Hash the password before saving

            await _User.InsertOneAsync(user);// inserts the user into the User collection.



        }
        public async Task<List<User>> GetAllUsersAsync()
        {
            var users = await _User.Find(user => true).ToListAsync();//Find all users and converts the result to a list
            return users;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _User.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            // Query MongoDB with an async method
            var user = await _User.Find(u => u.Id == id).FirstOrDefaultAsync();
            return user;
        }

        public async Task<User?> UpdateUserAsync(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id); //Builders<User>.Filter.Eq(u => u.Id, user.Id): Creates a filter to find the user by their ID
            var update = Builders<User>.Update
                .Set(u => u.Email, user.Email)
                .Set(u => u.Phone, user.Phone)
                .Set(u => u.PasswordHash, user.PasswordHash)
                .Set(u => u.UserRole, user.UserRole)
                .Set(u => u.FactoryId, user.FactoryId)
                .Set(u => u.AssignedDevices, user.AssignedDevices);

            // Perform the update
            await _User.UpdateOneAsync(filter, update); //Updates the user in the database.It then fetches and returns the updated user.

            // After updating, fetch the updated user
            return await _User.Find(u => u.Id == user.Id).FirstOrDefaultAsync();
        }


        public async Task DeleteUserAsync(string userId)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
            await _User.DeleteOneAsync(filter);
        }

        public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null) return false;

            return VerifyPassword(password, user.PasswordHash); // ✅ Use secure password comparison
        }

        // ✅ Secure Password Hashing with BCrypt
        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
