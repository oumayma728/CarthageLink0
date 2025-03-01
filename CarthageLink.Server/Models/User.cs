using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public enum UserRole
    {
        SuperAdmin,
        FactoryAdmin,
        Operator
    }

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
        [BsonElement("email")]
        public string? Email { get; set; } 

        [BsonElement("phone")]
        public string ?Phone { get; set; }

        [BsonElement("passwordHash")]
        public string ?PasswordHash { get; set; } 

        [BsonElement("role")]
        [BsonRepresentation(BsonType.String)]
        public UserRole UserRole { get; set;}

        [BsonElement("factoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? FactoryId { get; set; } 

        [BsonElement("assignedDevices")]
        public List<string>? AssignedDevices { get; set; }

        [BsonElement("licenseKey")]
        public required string LicenseKey { get; set; }
    }
}
