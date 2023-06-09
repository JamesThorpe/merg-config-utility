using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Extensions;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

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

public class PolymorphismDocumentFilter<T> : IDocumentFilter
{
    public void Apply(OpenApiDocument openApiDoc, DocumentFilterContext context) {
        RegisterSubClasses(context, typeof(T));
    }

    private static void RegisterSubClasses(DocumentFilterContext context, Type abstractType) {
        const string discriminatorName = "$type";
        var schemaRepository = context.SchemaRepository.Schemas;
        var schemaGenerator = context.SchemaGenerator;

        if (!schemaRepository.TryGetValue(abstractType.Name, out OpenApiSchema parentSchema)) {
            parentSchema = schemaGenerator.GenerateSchema(abstractType, context.SchemaRepository);
        }

        // set up a discriminator property (it must be required)
        parentSchema.Discriminator = new OpenApiDiscriminator { PropertyName = discriminatorName };
        parentSchema.Required.Add(discriminatorName);

        if (!parentSchema.Properties.ContainsKey(discriminatorName))
            parentSchema.Properties.Add(discriminatorName, new OpenApiSchema { Type = "string", Default = new OpenApiString(abstractType.FullName) });

        // register all subclasses
        var derivedTypes = abstractType.GetTypeInfo().Assembly.GetTypes()
            .Where(x => abstractType != x && abstractType.IsAssignableFrom(x));

        foreach (var type in derivedTypes)
            schemaGenerator.GenerateSchema(type, context.SchemaRepository);
    }
}

public class PolymorphismSchemaFilter<T> : ISchemaFilter
{
    private readonly Lazy<HashSet<Type>> derivedTypes = new Lazy<HashSet<Type>>(Init);

    public void Apply(OpenApiSchema schema, SchemaFilterContext context) {
        var type = context.Type;
        if (!derivedTypes.Value.Contains(type))
            return;

        var clonedSchema = new OpenApiSchema {
            Properties = schema.Properties,
            Type = schema.Type,
            Required = schema.Required
        };

        // schemaRegistry.Definitions[typeof(T).Name]; does not work correctly in SwashBuckle
        if (context.SchemaRepository.Schemas.TryGetValue(typeof(T).Name, out OpenApiSchema _)) {
            schema.AllOf = new List<OpenApiSchema> {
                new OpenApiSchema { Reference = new OpenApiReference { Id = typeof(T).Name, Type = ReferenceType.Schema } },
                clonedSchema
            };
        }

        var assemblyName = Assembly.GetAssembly(type).GetName();
        schema.Discriminator = new OpenApiDiscriminator { PropertyName = "$type" };
        schema.AddExtension("x-ms-discriminator-value", new OpenApiString($"{type.FullName}, {assemblyName.Name}"));

        // reset properties for they are included in allOf, should be null but code does not handle it
        schema.Properties = new Dictionary<string, OpenApiSchema>();
    }

    private static HashSet<Type> Init() {
        var abstractType = typeof(T);
        var dTypes = abstractType.GetTypeInfo().Assembly
            .GetTypes()
            .Where(x => abstractType != x && abstractType.IsAssignableFrom(x));

        var result = new HashSet<Type>();

        foreach (var item in dTypes)
            result.Add(item);

        return result;
    }
}
public class CustomModelDocumentFilter<T> : IDocumentFilter where T : class
{
    public void Apply(OpenApiDocument openapiDoc, DocumentFilterContext context) {
        context.SchemaGenerator.GenerateSchema(typeof(T), context.SchemaRepository);
    }
}