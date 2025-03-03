using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
            //private readonly IFactoryService _factoryService;
            private readonly IDeviceRepository _deviceRepository;

            public DeviceController(/*IFactoryService factoryService,*/ IDeviceRepository deviceRepository)
            {
                //_factoryService = factoryService;
                _deviceRepository = deviceRepository;
            }
            // GET: api/<DeviceController>
            [HttpGet]
        public async Task <ActionResult<List<Device>>> GetAllDevices()
        {
           return await _deviceRepository.GetAllDevices();
        }

        // GET api/<DeviceController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<DeviceController>
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<DeviceController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<DeviceController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
