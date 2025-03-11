using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Threading.Tasks;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;
        private readonly IDeviceRepository _deviceRepository;

        public DeviceController(IDeviceService deviceService, IDeviceRepository deviceRepository)
        {
            _deviceService = deviceService;
            _deviceRepository = deviceRepository;
        }

        // GET: api/<DeviceController>
        [HttpGet]
        public async Task<IEnumerable<Device>> GetAllDevicesAsync()
        {
            return await _deviceRepository.GetAllDevicesAsync();
        }

        // GET api/<DeviceController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDeviceById(string id)
        {
            // Parse the ID as ObjectId
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest(new { message = $"'{id}' is not a valid 24 digit hex string." });
            }

            try
            {
                // Pass the valid id to the service
                var device = await _deviceService.GetDeviceByIdAsync(id);
                if (device == null)
                {
                    return NotFound(new { message = "Device not found" });
                }
                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        // POST api/<DeviceController>
        [HttpPost]
        public async Task<IActionResult> CreateDevice([FromBody] Device device)
        {
            if (device == null)
            {
                return BadRequest("Device data is required.");
            }
            await _deviceService.CreateDeviceAsync(device);
            return Ok(new { message = "Device created successfully." });
        }

        // PUT api/<DeviceController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(string id, [FromBody] Device updatedDevice)
        {
            var existingDevice = await _deviceService.GetDeviceByIdAsync(id);
            if (existingDevice == null)
            {
                return NotFound($"Device with id {id} not found.");
            }

            updatedDevice.Id = id;
            await _deviceService.UpdateDeviceAsync(updatedDevice);
            return Ok("Device updated successfully.");
        }

        // DELETE api/<DeviceController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(string id)
        {
            var existingDevice = await _deviceService.GetDeviceByIdAsync(id);
            if (existingDevice == null)
            {
                return NotFound($"Device with id {id} not found.");
            }

            await _deviceService.DeleteDeviceAsync(id);
            return Ok("Device deleted successfully.");
        }
    }
}
