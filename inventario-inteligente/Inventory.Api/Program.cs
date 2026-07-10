using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

var products = new List<Product>
{
    new(Guid.NewGuid(), "Audífonos Bluetooth X200", "Audio", 85000m, 12, true),
    new(Guid.NewGuid(), "Teclado Mecánico TKL", "Periféricos", 180000m, 6, true),
    new(Guid.NewGuid(), "Monitor 27 pulgadas", "Pantallas", 320000m, 3, true),
    new(Guid.NewGuid(), "Mouse Inalámbrico", "Periféricos", 65000m, 9, true)
};

var sales = new List<Sale>();
var invoices = new List<Invoice>();
var chatSessions = new ConcurrentDictionary<string, ChatSession>();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }));

app.MapGet("/api/dashboard", () =>
{
    var lowStock = products.Count(p => p.Stock < 5);
    return Results.Ok(new
    {
        productCount = products.Count,
        lowStockCount = lowStock,
        saleCount = sales.Count,
        chatbotSales = sales.Count(s => s.Origin == "CHATBOT"),
        invoiceCount = invoices.Count,
        recentSales = sales.OrderByDescending(s => s.CreatedAt).Take(5)
    });
});

app.MapGet("/api/products", () => Results.Ok(products.OrderBy(p => p.Name)));

app.MapGet("/api/products/{id:guid}", (Guid id) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    return product is null
        ? Results.NotFound(new { message = "Producto no encontrado" })
        : Results.Ok(product);
});

app.MapPost("/api/products", (ProductCreateRequest request) =>
{
    var product = new Product(Guid.NewGuid(), request.Name, request.Category, request.Price, request.Stock, request.IsActive);
    products.Add(product);
    return Results.Created($"/api/products/{product.Id}", product);
});

app.MapPut("/api/products/{id:guid}", (Guid id, ProductUpdateRequest request) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product is null)
    {
        return Results.NotFound(new { message = "Producto no encontrado" });
    }

    product.Name = request.Name;
    product.Category = request.Category;
    product.Price = request.Price;
    product.Stock = request.Stock;
    product.IsActive = request.IsActive;

    return Results.Ok(product);
});

app.MapDelete("/api/products/{id:guid}", (Guid id) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product is null)
    {
        return Results.NotFound(new { message = "Producto no encontrado" });
    }

    products.Remove(product);
    return Results.Ok(new { message = "Producto eliminado" });
});

app.MapPut("/api/products/{id:guid}", (Guid id, ProductUpdateRequest request) =>
{
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product is null)
    {
        return Results.NotFound(new { message = "Producto no encontrado" });
    }

    product.Name = request.Name;
    product.Category = request.Category;
    product.Price = request.Price;
    product.Stock = request.Stock;
    product.IsActive = request.IsActive;

    return Results.Ok(product);
});

app.MapGet("/api/inventory", () => Results.Ok(products.Select(p => new { p.Id, p.Name, p.Stock, p.IsActive })));

app.MapPost("/api/inventory/adjust", (InventoryAdjustRequest request) =>
{
    var product = products.FirstOrDefault(p => p.Id == request.ProductId);
    if (product is null)
    {
        return Results.NotFound(new { message = "Producto no encontrado" });
    }

    product.Stock += request.QuantityDelta;
    return Results.Ok(new { productId = product.Id, stock = product.Stock });
});

app.MapGet("/api/sales", () => Results.Ok(sales.OrderByDescending(s => s.CreatedAt)));

app.MapPost("/api/sales", (SaleCreateRequest request) =>
{
    var product = products.FirstOrDefault(p => p.Id == request.ProductId);
    if (product is null)
    {
        return Results.NotFound(new { message = "Producto no encontrado" });
    }

    if (product.Stock < request.Quantity)
    {
        return Results.BadRequest(new { message = "No hay stock suficiente para completar la venta" });
    }

    product.Stock -= request.Quantity;
    var sale = new Sale(Guid.NewGuid(), product.Id, product.Name, request.Quantity, product.Price * request.Quantity, request.Origin ?? "MANUAL", DateTime.UtcNow);
    sales.Add(sale);

    var invoiceNumber = GenerateInvoiceNumber();
    var invoice = new Invoice(Guid.NewGuid(), invoiceNumber, sale.Id, sale.Total, DateTime.UtcNow);
    invoices.Add(invoice);

    return Results.Ok(new { sale, invoice });
});

app.MapGet("/api/invoices", () => Results.Ok(invoices.OrderByDescending(i => i.CreatedAt)));

app.MapGet("/api/invoices/{number}", (string number) =>
{
    var invoice = invoices.FirstOrDefault(i => i.Number == number);
    return invoice is null
        ? Results.NotFound(new { message = "Factura no encontrada" })
        : Results.Ok(invoice);
});

app.MapPost("/api/chat/message", (ChatMessageRequest request) =>
{
    var session = chatSessions.GetOrAdd(request.SessionId ?? "default", _ => new ChatSession());
    var message = request.Message?.Trim();

    if (string.IsNullOrWhiteSpace(message))
    {
        return Results.BadRequest(new { message = "El mensaje no puede estar vacío" });
    }

    if (session.State == "WAITING_CONFIRMATION")
    {
        var confirmed = message.Contains("si", StringComparison.OrdinalIgnoreCase)
            || message.Contains("sí", StringComparison.OrdinalIgnoreCase)
            || message.Contains("confirm", StringComparison.OrdinalIgnoreCase)
            || message.Contains("acept", StringComparison.OrdinalIgnoreCase);

        if (confirmed && session.PendingProductId is not null && session.PendingQuantity is not null)
        {
            var pendingProduct = products.FirstOrDefault(p => p.Id == session.PendingProductId);
            if (pendingProduct is null || pendingProduct.Stock < session.PendingQuantity.Value)
            {
                session.State = "ERROR";
                return Results.Ok(new { response = "No pude completar la compra porque ya no hay stock disponible.", state = session.State });
            }

            pendingProduct.Stock -= session.PendingQuantity.Value;
            var sale = new Sale(Guid.NewGuid(), pendingProduct.Id, pendingProduct.Name, session.PendingQuantity.Value, pendingProduct.Price * session.PendingQuantity.Value, "CHATBOT", DateTime.UtcNow);
            sales.Add(sale);
            var invoiceNumber = GenerateInvoiceNumber();
            var invoice = new Invoice(Guid.NewGuid(), invoiceNumber, sale.Id, sale.Total, DateTime.UtcNow);
            invoices.Add(invoice);

            session.State = "SALE_COMPLETED";
            session.LastInvoiceNumber = invoice.Number;
            session.LastSaleOrigin = "CHATBOT";
            return Results.Ok(new { response = $"Compra realizada exitosamente. Se generó la factura {invoice.Number}.", state = session.State, invoiceNumber = invoice.Number, saleOrigin = "CHATBOT" });
        }

        session.State = "WAITING_CONFIRMATION";
        return Results.Ok(new { response = "Entendido. Confirma la compra si deseas continuar.", state = session.State });
    }

    var searchTerm = message.ToLowerInvariant();
    var product = products.FirstOrDefault(p =>
        p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
        p.Category.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));

    if (product is null)
    {
        session.State = "SEARCHING";
        return Results.Ok(new { response = "No encontré ese producto. Prueba con un nombre como 'audífonos' o 'teclado'.", state = session.State });
    }

    if (product.Stock <= 0)
    {
        session.State = "OUT_OF_STOCK";
        return Results.Ok(new { response = $"El producto {product.Name} está temporalmente sin stock.", state = session.State });
    }

    session.PendingProductId = product.Id;
    session.PendingQuantity = 1;
    session.State = "WAITING_CONFIRMATION";

    return Results.Ok(new
    {
        response = $"Encontré {product.Name}. Hay {product.Stock} unidades disponibles. El total por 1 unidad es {product.Price:C}. ¿Deseas confirmar la compra?",
        state = session.State
    });
});

app.Run();

static string GenerateInvoiceNumber()
{
    var number = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
    return $"FAC-{number}";
}

public class Product
{
    public Product(Guid id, string name, string category, decimal price, int stock, bool isActive)
    {
        Id = id;
        Name = name;
        Category = category;
        Price = price;
        Stock = stock;
        IsActive = isActive;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public bool IsActive { get; set; }
}

public class Sale
{
    public Sale(Guid id, Guid productId, string productName, int quantity, decimal total, string origin, DateTime createdAt)
    {
        Id = id;
        ProductId = productId;
        ProductName = productName;
        Quantity = quantity;
        Total = total;
        Origin = origin;
        CreatedAt = createdAt;
    }

    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal Total { get; set; }
    public string Origin { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class Invoice
{
    public Invoice(Guid id, string number, Guid saleId, decimal total, DateTime createdAt)
    {
        Id = id;
        Number = number;
        SaleId = saleId;
        Total = total;
        CreatedAt = createdAt;
    }

    public Guid Id { get; set; }
    public string Number { get; set; }
    public Guid SaleId { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ChatSession
{
    public string State { get; set; } = "IDLE";
    public Guid? PendingProductId { get; set; }
    public int? PendingQuantity { get; set; }
    public string? LastInvoiceNumber { get; set; }
    public string? LastSaleOrigin { get; set; }
}

public record ProductCreateRequest(string Name, string Category, decimal Price, int Stock, bool IsActive);
public record ProductUpdateRequest(string Name, string Category, decimal Price, int Stock, bool IsActive);
public record InventoryAdjustRequest(Guid ProductId, int QuantityDelta);
public record SaleCreateRequest(Guid ProductId, int Quantity, string? Origin);
public record ChatMessageRequest(string? SessionId, string? Message);
