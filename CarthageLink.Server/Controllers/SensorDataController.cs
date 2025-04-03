using CarthageLink.Server.Models;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarthageLink.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorDataController : ControllerBase
    {
        private readonly ISensorDataService _service;
        private readonly ILogger<SensorDataController> _logger;

        public SensorDataController(
            ISensorDataService service,
            ILogger<SensorDataController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("{deviceId}")]
        public async Task<ActionResult<List<SensorData>>> GetByDeviceId(string deviceId)
        {
            try
            {
                var data = await _service.GetRecentDataAsync(deviceId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get sensor data");
                return StatusCode(500);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SensorData data)
        {
            try
            {
                await _service.SaveSensorDataAsync(data);
                return CreatedAtAction(nameof(GetByDeviceId), new { deviceId = data.DeviceId }, data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save sensor data");
                return StatusCode(500);
            }
        }
    }
}