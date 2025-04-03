using CarthageLink.Server.Services;
using CarthageLink.Server.Models;
using System.Text; 
using System.Text.Json;
using MQTTnet.Client;


public class MqttBackgroundService : BackgroundService
{
    private readonly IMQTTService _MQTTService;
    private readonly ISensorDataService _sensorDataService;
    private readonly ILogger<MqttBackgroundService> _logger;

    public MqttBackgroundService(
        IMQTTService mqttService,
        ILogger<MqttBackgroundService> logger,
        ISensorDataService sensorDataService)
    {
        _sensorDataService = sensorDataService;

        _MQTTService = mqttService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _MQTTService.SubscribeAsync("backend-test"); 

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }


}