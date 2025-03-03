using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Services;
using CarthageLink.Server.Models;
using Microsoft.Extensions.Configuration.UserSecrets;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CarthageLink.Server.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")] //base route for the controller
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository; // Declare _userRepository

        // Inject both services
        public UserController(IUserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAllUsers() // return list of users
        {
            var users = await _userRepository.GetAllUsersAsync(); 
            return Ok(users);
        }

        [HttpPost("Super-admin/create-user")]
        public async Task<IActionResult> CreateSuperAdminUser([FromBody] User user)
        {
            if (user == null)
                return BadRequest("User data is required.");
            user.UserRole = UserRole.FactoryAdmin;
            await _userService.CreateSuperAdminUserAsync(user); //Calls the service to create a super admin user.
            return Ok(new { message = "User created successfully" });
        }

        // ✅ Factory Admin: Create a user under their factory
        [HttpPost("factory-admin/create-user")]
        public async Task<IActionResult> CreateFactoryAdminUser([FromBody] User operatorUser, [FromHeader] string factoryAdminFactoryId)
        {
            {
                operatorUser.UserRole = UserRole.Operator;
                operatorUser.FactoryId = factoryAdminFactoryId; //Assigns the factory ID to the user.

                await _userService.CreateFactoryAdminUserAsync(operatorUser);
                return CreatedAtAction(nameof(CreateFactoryAdminUser), new { id = operatorUser.Id }, operatorUser);
            }
         
        }
        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(String id) //ActionResult<User> return type allows for both successful and error responses.
        {
            User user = await _userService.GetUserByIdAsync(id); //Calls the service to fetch the user based on the provided ID.
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }
        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, User updateUser)
        {
            // Fetch the user from the service by id
            User user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound($"There is no user with this id: {id}");
            }
            //Ensures the ID of the updated user matches the existing user.
            updateUser.Id = user.Id;

            // Call the service to update the user with the modified user details
            await _userService.UpdateUserAsync(updateUser);

            return Ok("Updated Successfully");
        }


        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
            {
                return NotFound($"User with id {id} not found.");
            }

            return Ok("User deleted successfully.");
        }

    }
}
