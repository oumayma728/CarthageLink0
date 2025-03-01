using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Services;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactoryController : ControllerBase
    {
        private readonly IFactoryService _factoryService;
        private readonly IFactoryRepository _factoryRepository;

        public FactoryController(IFactoryService factoryService, IFactoryRepository factoryRepository)
        {
            _factoryService = factoryService;
            _factoryRepository = factoryRepository;
        }
        // GET all factories for SuperAdmin 
        [HttpGet("all")]
       // [Authorize(Roles = "SuperAdmin")]

        public async Task<ActionResult<List<Factory>>> GetAllFactories()
        {
            var factories = await _factoryRepository.GetAllFactoriesAsync();
            return Ok(factories);
        }
        //Get Factory for Factory Admin
        [HttpGet()]
        //[Authorize(Roles = "FactoryAdmin")]
        public async Task<ActionResult<Factory>> GetMyFactory()
        {
            // 🔹 Extract FactoryAdmin ID from JWT instead of NameIdentifier
            var factoryAdminId = User.FindFirst("FactoryAdmin")?.Value;

            if (factoryAdminId == null)
            {
                return Unauthorized("FactoryAdmin ID not found.");
            }

            // 🔹 Find the factory linked to this FactoryAdmin
            var factory = await _factoryService.GetFactoryByAdminIdAsync(factoryAdminId);

            if (factory == null)
            {
                return NotFound("Factory not found for this admin.");
            }

            return Ok(factory);
        }

        // GET api/Factory/{id}
        [HttpGet("{id}")]
        //[Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<Factory>> GetFactoryById(string id)
        {
            var factory = await _factoryService.GetFactoryByIdAsync(id);
            if (factory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }
            return Ok(factory);
        }

        // POST api/Factory
        [HttpPost("Super-admin/create-factory")]
        //[Authorize(Roles = "SuperAdmin")]

        public async Task<IActionResult> CreateFactory([FromBody] Factory factory)
        {
            if (factory == null)
            {
                return BadRequest("Factory data is required.");
            }
            var licenseKey = await _factoryService.CreateFactoryAsync(factory);


            return Ok(new { message = "Factory created successfully.", licenseKey });
        }

        // PUT api/Factory/{id}
        [HttpPut("{id}")]
        //[Authorize(Roles = "SuperAdmin")]

        public async Task<IActionResult> UpdateFactory(string id, [FromBody] Factory updatedFactory)
        {
            var existingFactory = await _factoryService.GetFactoryByIdAsync(id);
            if (existingFactory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }

            updatedFactory.Id = id;
            await _factoryService.UpdateFactoryAsync(updatedFactory);
            return Ok("Factory updated successfully.");
        }

        [HttpPut("my-factory")]
        //[Authorize(Roles = "FactoryAdmin")]
        public async Task<IActionResult> UpdateMyFactory([FromBody] Factory updatedFactory)
        {
            //This retrieves the FactoryAdmin's ID from the JWT (JSON Web Token).
            var factoryAdminId = User.FindFirst("FactoryAdmin")?.Value;

            if (factoryAdminId == null)
            {
                return Unauthorized("FactoryAdmin ID not found.");
            }

            // 🔹 Retrieve the factory associated with this FactoryAdmin
            var existingFactory = await _factoryService.GetFactoryByAdminIdAsync(factoryAdminId);

            if (existingFactory == null)
            {
                return NotFound("Factory not found for this admin.");
            }

            // 🔹 Ensure the updated factory's ID matches the existing factory's ID
            if (updatedFactory.Id != existingFactory.Id)
            {
                return BadRequest("Factory ID mismatch.");
            }

            // 🔹 Update the factory (the FactoryAdmin can only modify their own factory)
            updatedFactory.Id = existingFactory.Id; // Maintain the same factory ID
            updatedFactory.FactoryAdminId = factoryAdminId;  // Ensure the owner is still the FactoryAdmin

            // 🔹 Update the factory in the database
            await _factoryService.UpdateFactoryAsync(updatedFactory);

            return Ok("Factory updated successfully.");
        }


        // DELETE api/Factory/{id}
        [HttpDelete("{id}")]
        //[Authorize(Roles = "SuperAdmin")]

        public async Task<IActionResult> DeleteFactory(string id)
        {
            var result = await _factoryService.DeleteFactoryAsync(id);
            if (!result)
            {
                return NotFound($"Factory with id {id} not found.");
            }
            return Ok("Factory deleted successfully.");
        }
    [HttpGet("{id}/devices")]
        //[Authorize(Roles = "SuperAdmin,FactoryAdmin")]
        public async Task<ActionResult<List<Device>>> GetFactoryDevices(string id)
        {
            // 🔹 Check if the factory exists
            var factory = await _factoryService.GetFactoryByIdAsync(id);
            if (factory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }

            // 🔹 Get the logged-in user's role and ID
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // 🔹 If Factory Admin, ensure they only access their assigned factory
            if (userRole == "FactoryAdmin" && factory.FactoryAdminId != adminId)
            {
                return Forbid("You can only access devices from your own factory.");
            }

            // 🔹 Fetch and return devices belonging to this factory
            var devices = await _factoryService.GetFactoryDevicesAsync(id);
            return Ok(devices);
        }

    } }
