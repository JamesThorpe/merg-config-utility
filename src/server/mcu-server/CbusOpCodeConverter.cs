using Asgard.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Reflection;

namespace mcu_server
{
    public class CbusOpCodeConverter : JsonConverter<ICbusOpCode>
    {
        
        public override ICbusOpCode? ReadJson(JsonReader reader, Type objectType, ICbusOpCode? existingValue, bool hasExistingValue, JsonSerializer serializer) {
            var jObject = JObject.Load(reader);
            var type = jObject["$type"].Value<string>();

            var t = Assembly.GetAssembly(typeof(ICbusOpCode)).GetTypes().First(t => t.Name == type);

            serializer.Converters.Remove(this);

            var ret = (ICbusOpCode)serializer.Deserialize(jObject.CreateReader(), t);

            serializer.Converters.Add(this);

            return ret;
            
        }

        public override void WriteJson(JsonWriter writer, ICbusOpCode? value, JsonSerializer serializer) {
            throw new NotImplementedException();
        }
    }
}
