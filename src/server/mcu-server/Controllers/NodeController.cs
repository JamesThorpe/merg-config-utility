using Asgard.Communications;
using Asgard.Data;
using Microsoft.AspNetCore.Mvc;

namespace mcu_server.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class NodeController:ControllerBase
    {
        private readonly MessageManager messageManager;

        public NodeController(MessageManager messageManager) {
            this.messageManager = messageManager;
        }


        [HttpPost]
        [Route("SetNodeNumber")]
        public async Task<bool> Send(SetNodeNumber msg) {
            try {
                var response = await messageManager.SendMessageWaitForReply<NodeNumberAcknowledge>(msg);
                return response.NodeNumber == msg.NodeNumber;
            }catch(TimeoutException) {
                return false;
            }
        }


        [HttpGet]
        [Route("QueryNodes")]
        public async Task<IEnumerable<ResponseToQueryNode>> QueryNodes() {
            var nodes = await messageManager.SendMessageWaitForReplies<ResponseToQueryNode>(new QueryNodeNumber());
            return nodes;
        }
    }
}
