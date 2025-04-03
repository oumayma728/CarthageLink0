using CarthageLink.Server.Models;
using System.Text;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using System.Text.Json;
namespace CarthageLink.Server.Services
{
    public interface IMQTTService
    {
        Task ConnectAsync();
        Task PublishAsync(string topic, string payload);
        Task SubscribeAsync(string topic);
        Task OnMessageReceived(MqttApplicationMessageReceivedEventArgs e);
    }

    public class MQTTService : IMQTTService
    {
        private readonly ISensorDataService _sensorDataService;
        private readonly ILogger<MQTTService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMqttClient _mqttClient;
        private readonly CancellationTokenSource _cancellationTokenSource = new();

        public MQTTService(ILogger<MQTTService> logger, IConfiguration configuration)
        {

            _logger = logger;
            _configuration = configuration;

            var factory = new MqttFactory();
            _mqttClient = factory.CreateMqttClient();

            _mqttClient.ConnectedAsync += async e =>
            {
                _logger.LogInformation("Successfully connected to the MQTT Broker.");
                await Task.CompletedTask; // Fix for CS1998
            };

            _mqttClient.DisconnectedAsync += async e =>
            {
                if (_cancellationTokenSource.IsCancellationRequested)
                    return; // Stop reconnect attempts if app is shutting down

                _logger.LogWarning("Disconnected from MQTT Broker. Reconnecting...");
                await Task.Delay(TimeSpan.FromSeconds(5));

                await ConnectAsync(); // Auto-reconnect in 5 seconds
            };

        }

        private string BrokerUrl => _configuration["Emqx:BrokerUrl"]!;
        private int Port => int.Parse(_configuration["Emqx:Port"]!);
        private string Username => _configuration["Emqx:Username"]!;
        private string Password => _configuration["Emqx:Password"]!;
        private string ClientId => $"{_configuration["Emqx:ClientId"]}_{GenerateRandomString(6)}";

        private static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string([.. Enumerable.Repeat(chars, length).Select(s => s[new Random().Next(s.Length)])]);
        }

        public async Task ConnectAsync()
        {
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(BrokerUrl, Port)
                .WithCredentials(Username, Password)
                .WithClientId(ClientId)
                .WithCleanSession()
                .Build();

            try
            {
                await _mqttClient.ConnectAsync(options, _cancellationTokenSource.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to the MQTT Broker.");
                throw; // Allow caller to handle the error
            }
        }

        public async Task PublishAsync(string topic, string payload)
        {

            if (!_mqttClient.IsConnected)
                await ConnectAsync(); // Ensure connection before publishing

            var message = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(payload)
                .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
                .Build();

            await _mqttClient.PublishAsync(message);
            _logger.LogInformation("Published message to topic {Topic}: {Payload}", topic, payload);
        }

        public async Task SubscribeAsync(string topic)
        {
            if (!_mqttClient.IsConnected)
                await ConnectAsync(); // Ensure connection before subscribing

            await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());

            // Prevent multiple subscriptions
            _mqttClient.ApplicationMessageReceivedAsync -= OnMessageReceivedHandler;
            _mqttClient.ApplicationMessageReceivedAsync += OnMessageReceivedHandler;

            _logger.LogInformation("Subscribed to topic: {Topic}", topic);
        }

        // This is the handler method that will be called when a message is received
        private async Task OnMessageReceivedHandler(MqttApplicationMessageReceivedEventArgs e)
        {
            await OnMessageReceived(e); // This calls the method defined above
        }


        // Extract the message handler to prevent multiple delegates being added
        public async Task OnMessageReceived(MqttApplicationMessageReceivedEventArgs e)
        {
            try
            {
                // Decode the message payload
                var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

                // Deserialize the payload into your SensorData model
                var sensorData = JsonSerializer.Deserialize<SensorData>(payload);

                if (sensorData != null)
                {
                    // Ensure Timestamp is set (if not set in the message)
                    sensorData.Timestamp = DateTime.UtcNow;

                    // Save the data to MongoDB via SensorDataService
                    await _sensorDataService.SaveSensorDataAsync(sensorData);
                    _logger.LogInformation("Sensor data saved successfully.");
                }
                else
                {
                    _logger.LogWarning("Failed to deserialize sensor data.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing received MQTT message.");
            }
        }



    }
}
