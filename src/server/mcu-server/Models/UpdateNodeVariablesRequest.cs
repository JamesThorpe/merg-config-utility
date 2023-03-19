namespace mcu_server.Models
{
    public class UpdateNodeVariablesRequest
    {
        public ushort NodeNumber { get; set; }
        public IEnumerable<byte>? Variables { get; set; }
        public bool ExpectWrack { get; set; }
    }
}
