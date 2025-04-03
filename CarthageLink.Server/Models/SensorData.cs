using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace CarthageLink.Server.Models
{
    public class SensorData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // This is fine for the Id
        public string? Id { get; set; }

        [BsonElement("deviceId")]
        public string DeviceId { get; set; } = string.Empty;

        [BsonElement("data")]
        public string Data { get; set; } = string.Empty;

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}
