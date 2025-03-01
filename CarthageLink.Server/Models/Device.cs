using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace CarthageLink.Server.Models
{
    public class Device
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("Name")]
        public string Name { get; set; }
        [BsonElement("MacAddress")]
        public string MacAddress { get; set; }
        [BsonElement("Status")]
        public string Status { get; set; }
        [BsonElement("FactoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string FactoryId { get; set; }
        [BsonElement("AssignedUsers")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string>? AssignedUsers{ get; set; }

    }
}
