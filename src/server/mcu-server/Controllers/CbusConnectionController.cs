using Asgard.Communications;
using Microsoft.AspNetCore.Mvc;

namespace mcu_server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CbusConnectionController : ControllerBase
    {
        

        private readonly ILogger<CbusConnectionController> _logger;
        private readonly ICbusConnectionFactory cbusConnectionFactory;
        private readonly ICbusMessenger _cbusMessenger;

        public CbusConnectionController(ILogger<CbusConnectionController> logger, ICbusConnectionFactory cbusConnectionFactory, ICbusMessenger cbusMessenger)
        {
            _logger = logger;
            this.cbusConnectionFactory = cbusConnectionFactory;
            _cbusMessenger = cbusMessenger;
        }

        [HttpGet]
        [Route("GetComPorts")]
        public IEnumerable<string> GetComPorts()
        {
            //return new[] { "COM1", "COM3", "COM5", "COM7" };
            return cbusConnectionFactory.GetAvailableConnections();            
        }

        [HttpPost]
        [Route("Connect")]
        public async Task<bool> ConnectCbus(ConnectionOptions connectionOptions)
        {
            if (_cbusMessenger.IsOpen) {
                _cbusMessenger.Close();
            }

            await _cbusMessenger.OpenAsync(connectionOptions);
            return _cbusMessenger.IsOpen;
        }


    }
}