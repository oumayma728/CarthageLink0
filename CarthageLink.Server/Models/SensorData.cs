using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace CarthageLink.Server.Models
{
    public class SensorData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("deviceId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string DeviceId { get; set; } = string.Empty;

        [BsonElement("data")]
        public string Data { get; set; } = string.Empty;

        [BsonElement("timestamp")]
        [BsonRepresentation(BsonType.Timestamp)]
        public DateTime Timestamp { get; set; }

    }
}
