# Product Filtering API Documentation

## Overview

The GET `/api/products` endpoint now supports flexible filtering through query parameters. You can combine multiple filters to find exactly what you're looking for.

## Available Filters

### Category Filter

Filter products by their category (case-insensitive):

```
GET /api/products?category=Protein
GET /api/products?category=vitamins
```

### Goals Filter

Filter products by their goals. Supports multiple goals (comma-separated):

```
GET /api/products?goals=Weight Loss
GET /api/products?goals=Build Muscle,Muscle Recovery
```

### Price Range Filter

Filter products by minimum and/or maximum price:

```
GET /api/products?minPrice=20
GET /api/products?maxPrice=50
GET /api/products?minPrice=20&maxPrice=50
```

### Search Filter

Search for keywords in product name or descriptions:

```
GET /api/products?search=whey
GET /api/products?search=creatine
GET /api/products?search=muscle
```

## Combined Filters

You can combine multiple filters for more specific results:

### Example 1: Protein products for muscle building under $50

```
GET /api/products?category=Protein&goals=Build Muscle&maxPrice=50
```

### Example 2: Weight loss products with "burn" in the name/description

```
GET /api/products?goals=Weight Loss&search=burn
```

### Example 3: Budget-friendly products between $15-25

```
GET /api/products?minPrice=15&maxPrice=25
```

## Sample Test Cases

Based on the seed data, here are some example requests and expected behaviors:

1. **Category Filter**: `?category=Protein`

   - Should return: "CoreX Whey Protein", "CoreX Isolate Protein"

2. **Goals Filter**: `?goals=Weight Loss`

   - Should return: "CoreX Fat Burner", "CoreX Slim Burn"

3. **Price Range**: `?minPrice=20&maxPrice=30`

   - Should return products like "CoreX Creatine" ($24.99), "CoreX Fat Burner" ($27.99), etc.

4. **Search**: `?search=whey`

   - Should return: "CoreX Whey Protein"

5. **Combined**: `?category=Protein&goals=Build Muscle&minPrice=30`
   - Should return: "CoreX Whey Protein" ($49.99), "CoreX Isolate Protein" ($54.99)

## Filter Logic Details

- **Category**: Exact match (case-insensitive)
- **Goals**: Checks if ANY of the product's goals match ANY of the requested goals (case-insensitive)
- **Price**: Numerical comparison (>=minPrice, <=maxPrice)
- **Search**: Case-insensitive substring match in name, description, shortDescription, or longDescription
- **No Filters**: Returns all products when no query parameters are provided
- **Empty Results**: Returns empty array when no products match the filters

## Error Handling

- Invalid price values are ignored (non-numeric strings)
- Invalid MongoDB queries return appropriate error messages
- Malformed requests return 500 status with error details
