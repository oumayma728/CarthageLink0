using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using MQTTnet;
using MQTTnet.Client;

namespace CarthageLink.Server.Services
{
    public interface IMQTTService
    {
        Task ConnectAsync();
        Task PublishAsync(string topic, string payload);
        Task SubscribeAsync(string topic);
        Task DisconnectAsync();
    }
    public class MQTTService : IMQTTService
    { private readonly ILogger<MQTTService> _logger;  //logger for logging
        private readonly IConfiguration _configuration; //Configuration for Emqx settings
        private IMqttClient _mqttClient; //MQtt instance
    public MQTTService(ILogger<MQTTService> logger , IConfiguration configuration)
        {
            _logger = logger; 
            _configuration = configuration;
        }
    
    public async Task ConnectAsync()
        {
        var factory = new MqttFactory();
         _mqttClient = factory.CreateMqttClient(); //instance to connect with broker created by MqttFactory


            var broker = _configuration["Emqx:BrokerUrl"];
            var port = int.Parse(_configuration["Emqx:port"]!);
            var username = _configuration["Emqx:username"];
            var password = _configuration["Emqx:Password"];
            var clientId =_configuration["Emqx:ClientId"];
            
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(broker, port) //where to go 
                .WithCredentials(username, password) //How to log in
                .WithClientId(clientId) // How to introduce itself
                .WithCleanSession() //Start with a clean session
                /*.WithTls(
                o =>
                { o.CertificateValidationHandler = _ => true; //Accept all certificates (for testing only).
                    o.SslProtocol =SslProtocols.Tls12;
                    var certificate = new X509Certificate(caCertificatePath, ""); // Load CA certificate
                    o.Certificates = new List<X509Certificate> { certificate }; // Add certificate to the list
                }
            )*/
            .Build();

            var connectResult = await _mqttClient.ConnectAsync(options); // Connect to the broker

            if (connectResult.ResultCode == MqttClientConnectResultCode.Success)
            {
                _logger.LogInformation("Connected to MQTT broker successfully."); // Log success
            }
            else
            {
                _logger.LogError($"Failed to connect to MQTT broker: {connectResult.ResultCode}"); // Log failure
            }
        }
        public async Task PublishAsync(string topic, string payload)
        { if(_mqttClient.IsConnected) //Checks if the client is connected before publishing.
            {
                var message =new MqttApplicationMessageBuilder()
                    .WithTopic(topic) //Set topic 
                    .WithPayload(payload) // Set Payload 
                    .WithQualityOfServiceLevel(MQTTnet.Protocol.MqttQualityOfServiceLevel.AtLeastOnce) //ensure the message is delivered
                    .WithRetainFlag() //store the last message for new subscribers
                    .Build();
                await _mqttClient.PublishAsync(message);
                _logger.LogInformation($"Publishing message to topic{topic} : {payload}");
            }
            else
            {
                _logger.LogError("MQTT client is not connected . Cannot publish message");
            }
        }
        public async Task SubscribeAsync(string topic)
        {
            if (_mqttClient.IsConnected) // Check if the client is connected
            {
                await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build()); // Subscribe to the topic 
                _logger.LogInformation($"Subscribed to topic: {topic}"); // Log the subscription

                // Handle incoming messages
                _mqttClient.ApplicationMessageReceivedAsync += e =>
                {
                    var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload); // Decode the message payload
                    _logger.LogInformation($"Received message on topic {e.ApplicationMessage.Topic}: {payload}"); // Log the received message
                    return Task.CompletedTask;
                };
            }
            else
            {
                _logger.LogError("MQTT client is not connected. Cannot subscribe to topic."); // Log error if not connected
            }
        }
        public async Task DisconnectAsync()
        {
            if (_mqttClient.IsConnected) // Check if the client is connected
            {
                await _mqttClient.DisconnectAsync(); // Disconnect from the broker
                _logger.LogInformation("Disconnected from MQTT broker."); // Log the disconnection
            }
        }
    }
                
        }
