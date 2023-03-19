using Asgard.Communications;
using Asgard.Data;
using mcu_server.Models;
using Microsoft.AspNetCore.Mvc;

namespace mcu_server.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class NodeController:ControllerBase
    {
        private readonly MessageManager messageManager;
        private readonly ICbusMessenger cbusMessenger;

        public NodeController(MessageManager messageManager, ICbusMessenger cbusMessenger) {
            this.messageManager = messageManager;
            this.cbusMessenger = cbusMessenger;
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
            for (byte i = 1; i <= variableCount; i++) {
                var request = new RequestReadOfANodeVariable {
                    NodeNumber = nodeNumber,
                    NVIndex = i
                };
                var reply = await messageManager.SendMessageWaitForReply<ResponseToARequestForANodeVariableValue>(request, r => r.IsReply(request));
                nodeVariables.Add(reply.Value);
            }
            return nodeVariables;
        }

        [HttpPost]
        [Route("UpdateNodeVariables/")]
        public async Task<bool> UpdateNodeVariables(UpdateNodeVariablesRequest nvr) {
            byte i = 0;
            foreach (var variable in nvr.Variables) {
                i++;
                var request = new SetANodeVariable {
                    NodeNumber = nvr.NodeNumber,
                    NVIndex = i,
                    Value = variable
                };
                if (nvr.ExpectWrack) {
                    await messageManager.SendMessageWaitForReply<WriteAcknowledge>(request, (r) => r.NodeNumber == request.NodeNumber);
                } else {
                    await cbusMessenger.SendMessage(request);
                    await Task.Delay(50);
                }
                
            }
            return true;
        }
    }
}
