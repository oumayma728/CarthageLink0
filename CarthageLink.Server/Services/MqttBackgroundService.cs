namespace CarthageLink.Server.Services
{
    public class MqttBackgroundService : BackgroundService
    {
        private readonly IMQTTService _MQTTService; // MQTT client service
        private readonly ILogger<MqttBackgroundService> _logger; // Logger for logging messages

        public MqttBackgroundService(IMQTTService MQTTService, ILogger<MqttBackgroundService> logger)
        {
            _MQTTService = MQTTService; // Initialize the MQTT client service
            _logger = logger; // Initialize the logger
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Connect to the MQTT broker
            await _MQTTService.ConnectAsync();

            // Subscribe to the topic
            await _MQTTService.SubscribeAsync("Csharp/mqtt");

            // Publish messages
            for (int i = 0; i < 10; i++)
            {
                await _MQTTService.PublishAsync("Csharp/mqtt", $"Hello, MQTT! Message number {i}");
                await Task.Delay(1000, stoppingToken); // Wait for 1 second
            }

            // Disconnect from the broker
            await _MQTTService.DisconnectAsync();
        }
    }
}