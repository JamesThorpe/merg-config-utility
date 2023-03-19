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

        [HttpGet]
        [Route("ReadNodeParameters/{nodeNumber}")]
        public async Task<IEnumerable<byte>> ReadNodeParameters(ushort nodeNumber) {
            var nodeParams = new List<byte>();
            var request = new RequestReadOfANodeParameterByIndex { 
                NodeNumber = nodeNumber,
                ParamIndex = 0
            };
            var param0 = await messageManager.SendMessageWaitForReply<ResponseToRequestForIndividualNodeParameter>(request, r => r.IsReply(request));
            nodeParams.Add(param0.Value);
            for(byte i = 1; i < param0.Value; i++) {
                request = new RequestReadOfANodeParameterByIndex {
                    NodeNumber = nodeNumber,
                    ParamIndex = i
                };
                var param = await messageManager.SendMessageWaitForReply<ResponseToRequestForIndividualNodeParameter>(request, r => r.IsReply(request));
                nodeParams.Add(param.Value);
            }
            return nodeParams;
        }

        [HttpGet]
        [Route("ReadNodeVariables/{nodeNumber}/{variableCount}")]
        public async Task<IEnumerable<byte>> ReadNodeVariables(ushort nodeNumber, byte variableCount) {
            var nodeVariables = new List<byte>();
            for (byte i = 1; i < variableCount; i++) {
                var request = new RequestReadOfANodeVariable {
                    NodeNumber = nodeNumber,
                    NVIndex = i
                };
                var reply = await messageManager.SendMessageWaitForReply<ResponseToARequestForANodeVariableValue>(request, r => r.IsReply(request));
                nodeVariables.Add(reply.Value);
            }
            return nodeVariables;
        }
    }
}
