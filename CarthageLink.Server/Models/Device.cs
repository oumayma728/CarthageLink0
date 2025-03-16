using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace CarthageLink.Server.Models
{
    public class Device
    {
        public enum DeviceStatus
        {
            Active,
            Inactive,
            Maintenance
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("Name")]
        public required string Name { get; set; }
        [BsonElement("MacAddress")]
        public required string MacAddress { get; set; }
        [BsonElement("Status")]
        public required string Status { get; set; }
        [BsonElement("FactoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? FactoryId { get; set; }
        [BsonElement("AssignedUsers")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string>? AssignedUsers{ get; set; }

    }
}
