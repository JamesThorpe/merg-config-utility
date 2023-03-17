using Asgard.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(co =>
{
    co.AddDefaultPolicy(cp =>
    {
        cp.AllowAnyOrigin();
        cp.AllowAnyMethod();
        cp.AllowAnyHeader();
    });
});
builder.Services.AddSwaggerGen(c =>
{
    c.SchemaFilter<EnumSchemaFilter>();
});
builder.Services.AddAsgard(builder.Configuration.GetSection("asgard"));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();
app.UseMiddleware<WebSocketHandler>();
app.MapControllers();
app.UseCors();


app.Run();