using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Asgard.Communications;
using Asgard.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

class WebSocketHandler
{
    private readonly ICbusMessenger _cbusMessenger;
    private readonly RequestDelegate _next;
    private WebSocket? _socket;


    public WebSocketHandler(RequestDelegate next, ICbusMessenger cbusMessenger) {
        this._next = next;
        this._cbusMessenger = cbusMessenger;
    }
    public async Task InvokeAsync(HttpContext context) {
        if (context.Request.Path != "/ws") {
            await _next(context);
            return;
        }
        if (!context.WebSockets.IsWebSocketRequest) {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return;
        }

        


        using (var ws = await context.WebSockets.AcceptWebSocketAsync())
        {
            _socket = ws;
            _cbusMessenger.MessageReceived += MessageReceived;
            _cbusMessenger.MessageSent += MessageSent;
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            while (!result.CloseStatus.HasValue) {
                //await ws.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), result.MessageType, result.EndOfMessage, CancellationToken.None);
                result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            

            _cbusMessenger.MessageReceived -= MessageReceived;
            _cbusMessenger.MessageSent -= MessageSent;

            _socket = null;
            await ws.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }

    private async void MessageSent(object? sender, CbusMessageEventArgs e)
    {
        if (e.Message is ICbusStandardMessage msg) {
            msg.TryGetOpCode(out var opc);
            await SendMessage(new { Type = "cbus-standard", Message = e.Message, OpCode = opc, Direction = "sent" });
        } else {
            await SendMessage(new { Type = "cbus", Message = e.Message, Direction = "sent" });
        }
        
    }

    private async void MessageReceived(object? sender, CbusMessageEventArgs e)
    {
        if (e.Message is ICbusStandardMessage msg) {
            msg.TryGetOpCode(out var opc);
            await SendMessage(new { Type = "cbus-standard", Message = e.Message, OpCode = opc, Direction = "received" });
        } else {
            await SendMessage(new { Type = "cbus", Message = e.Message, Direction = "received" });
        }
    }

    private static JsonSerializerSettings settings = new JsonSerializerSettings {
        ContractResolver = new DefaultContractResolver { 
            NamingStrategy = new CamelCaseNamingStrategy() 
        }
    };

    private async Task SendMessage(object msg)
    {
        var s = JsonConvert.SerializeObject(msg, settings);
        var sock = _socket;
        if (sock != null) {
            await sock.SendAsync(Encoding.UTF8.GetBytes(s), WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}




