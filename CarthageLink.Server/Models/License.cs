using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace CarthageLink.Server.Models
{
    public class License
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ? Id { get; set; }
        [Required]
        [BsonElement("key")]
        public string ?Key { get; set; }
        [BsonElement("generatedBy")]
        public string? GeneratedBy { get; set; } 

        [BsonElement("assignedTo")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? AssignedTo { get; set; } // Nullable

        [BsonElement("factoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? FactoryId { get; set; }

        [BsonElement("devices")]
        public List<string> Devices { get; set; } = new List<string>();
        [BsonElement("role")]
        public string? role { get; set; }
        [BsonElement("status")]
        public string? Status { get; set; }
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("expiresAt")]
        public DateTime? ExpiresAt { get; set; } // Nullable

    }
}
