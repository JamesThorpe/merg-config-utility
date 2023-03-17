using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class EnumSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema model, SchemaFilterContext context)
    {
        if (context.Type.IsEnum)
        {
            
            var ex = string.Join(", ", Enum.GetNames(context.Type).Select(n => $"{Convert.ToInt64(Enum.Parse(context.Type, n))}: {n}"));
            model.Example = new OpenApiString(ex);
        }
    }
}