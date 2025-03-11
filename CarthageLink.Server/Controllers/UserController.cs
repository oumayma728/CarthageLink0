using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Services;
using CarthageLink.Server.Models;
using Microsoft.Extensions.Configuration.UserSecrets;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CarthageLink.Server.Repositories;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")] //base route for the controller
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository; // Declare _userRepository
        private readonly LogInModel loginmodel;
        private readonly IFactoryService _factoryService;
        private readonly IFactoryRepository _factoryRepository;

        public string FactoryName { get; private set; }

        // Inject both services
        public UserController(IUserService userService, IUserRepository userRepository, IFactoryService factoryService , IFactoryRepository factoryRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
            _factoryService = factoryService;
            _factoryRepository = factoryRepository;
        }

        //Get All users
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAllUsers() // return list of users
        {
            
                var users = await _userService.GetAllUsersAsync();
            return Ok(users);


        }
        //create user for super admin

        [HttpPost("Super-admin/create-user")]
        public async Task<IActionResult> PostFactoryAdmin([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "User data is required." });

            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest(new { message = "User with this email already exists." });

            var role = UserRole.FactoryAdmin; 
            var licenseKey = await _userService.CreateUserAsync(user, role , user.TaxNumber);
            return Ok(new { message = "User created successfully", licenseKey });
        
        }

        // Create user for factory admin
        [HttpPost("factory-admin/create-user")]
        public async Task<IActionResult> PostOperator([FromBody] User user, [FromHeader] string factoryAdminFactoryId)
        {
            if (user == null)
                return BadRequest(new { message = "User data is required." });

            if (string.IsNullOrEmpty(factoryAdminFactoryId))
                return BadRequest(new { message = "Factory ID is required in the header." });

            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest(new { message = "User with this email already exists." });

            var role = UserRole.Operator; // set role operator
            var licenseKey = await _userService.CreateUserAsync(user, role , user.TaxNumber);
       
            return Ok(new { message = "User created successfully", licenseKey });
        }


        // Get User by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(String id) //ActionResult<User> return type allows for both successful and error responses.
        {
             var user = await _userService.GetUserByIdAsync(id); //Calls the service to fetch the user based on the provided ID.
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }
        // Update User
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
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "User has been successfully deleted" });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("User not found"))
                    return NotFound(new { message = ex.Message });

                return BadRequest(new { message = ex.Message });
            }

        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                var existingUser = await _userRepository.GetUserByEmailAsync(model.Email);

                if (existingUser == null)
                {
                    //await _userService.RegisterUserAsync(model, license);
                    return Ok(new { message = "Initial registration successful. Please complete your registration." });
                }
                else
                {
                    // Step 2: Complete registration
                    if (existingUser.IsRegistrationComplete)
                        return BadRequest("User registration is already complete.");

                   // await _userService.RegisterUserAsync(model, license);
                    return Ok(new { message = "Registration completed successfully." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        //Log In User
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LogInModel loginModel)
        {
            var user = await _userRepository.GetUserByEmailAsync(loginModel.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginModel.Password, user.Password))
            {
                return Unauthorized("Invalid email or password.");
            }
            var token = await _userService.LoginUserAsync(loginmodel);
            return Ok(new { message = "User logged in successfuly", Token = token });

           
            //Generate JWT token
            //var token = GenerateJwtToken(user);

            // Return the token to the user
            //return Ok(new { token });
            //return Ok(new { message = "Login successful" });

        }
    }
}
