﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarthageLink.Server.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using BCrypt.Net;
using CarthageLink.Server.Data;

namespace CarthageLink.Server.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string id);
        Task UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
        Task CreateUserAsync(User user);
    }

    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _user;
        private readonly IMongoCollection<Models.License> _License;

        //Constructor
        public UserRepository(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _user = database.GetCollection<User>("User");
            _License = database.GetCollection<License>("License");

        }
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _user.Find(User => true).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _user.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _user.Find(u => u.Email == email).FirstOrDefaultAsync();
        }


        public async Task CreateUserAsync(User user)
        {
            await _user.InsertOneAsync(user);


        }

        public async Task UpdateUserAsync(User user)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user), "User cannot be null.");

                await _user.ReplaceOneAsync(u => u.Id == user.Id, user);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to update user.", ex);
            }
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    throw new ArgumentException("User ID cannot be null or empty.", nameof(id));

                var result = await _user.DeleteOneAsync(u => u.Id == id);
                return result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to delete user.", ex);
            }
        }

        public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
        {
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                    throw new ArgumentException("Email and password cannot be null or empty.");

                var user = await GetUserByEmailAsync(email);
                if (user == null)
                    return false;

                return VerifyPassword(password, user.Password); // Verify the password securely
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to validate user credentials.", ex);
            }
        }

  

        //  Secure Password Verification with BCrypt
        private bool VerifyPassword(string password, string hashedPassword)
        {
            try
            {
                if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hashedPassword))
                    throw new ArgumentException("Password and hashed password cannot be null or empty.");

                return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to verify password.", ex);
            }
        }
    }
}