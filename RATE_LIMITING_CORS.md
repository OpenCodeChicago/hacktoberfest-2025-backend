# Rate Limiting and CORS Configuration

## Overview
This implementation provides comprehensive rate limiting and CORS configuration for the API Gateway to prevent brute-force attacks and ensure proper cross-origin resource sharing.

## Features Implemented

### 1. Rate Limiting
- **General API**: 50 requests/minute (production), 100 requests/minute (development)
- **Authentication**: 5 attempts per 15 minutes
- **Strict Operations**: 10 requests per minute
- **Progressive Slowdown**: Delays after 20 requests in 15 minutes

### 2. CORS Configuration
- **Preflight Support**: Handles OPTIONS requests correctly
- **Origin Validation**: Allows specific frontend domains
- **Credentials**: Supports cookies and authorization headers
- **Development Mode**: Allows localhost origins in development

### 3. Security Headers
- **Helmet**: Comprehensive security headers
- **CSP**: Content Security Policy
- **HSTS**: HTTP Strict Transport Security
- **XSS Protection**: Cross-site scripting protection

## API Endpoints

### Rate Limiting Test
```bash
# Test rate limiting (limited to 10 requests/minute)
GET /api/test-security/rate-limit
```

### CORS Test
```bash
# Test CORS configuration
GET /api/test-security/cors

# Test CORS preflight
OPTIONS /api/test-security/cors
```

### Security Headers Test
```bash
# Test security headers
GET /api/test-security/security-headers
```

## Configuration

### Environment Variables
```bash
NODE_ENV=production  # Enables stricter rate limits
JWT_SECRET=your-secret-key
```

### Rate Limits
- **General**: 50/min (prod), 100/min (dev)
- **Auth**: 5 attempts per 15 minutes
- **Strict**: 10 requests per minute
- **Speed Limit**: 20 requests, then 500ms delay

### CORS Origins
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)
- `http://localhost:8080` (Vue)
- Production domains (to be added)

## Testing

### 1. Rate Limiting Test
```bash
# Make multiple requests to test rate limiting
for i in {1..15}; do
  curl -w "%{http_code}\n" http://localhost:5000/api/test-security/rate-limit
done
```

### 2. CORS Test
```bash
# Test from browser console
fetch('http://localhost:5000/api/test-security/cors', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log(data));
```

### 3. Preflight Test
```bash
# Test CORS preflight
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost:5000/api/test-security/cors
```

## Error Responses

### Rate Limit Exceeded
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "1 minute"
}
```

### CORS Error
```json
{
  "success": false,
  "message": "CORS policy violation: Origin not allowed",
  "origin": "http://disallowed-origin.com"
}
```

## Security Features

1. **Brute Force Protection**: Stricter limits on auth endpoints
2. **Progressive Delays**: Slows down repeated requests
3. **IP-based Limiting**: Tracks requests per IP address
4. **Origin Validation**: Only allows trusted domains
5. **Security Headers**: Comprehensive security headers via Helmet

## Production Considerations

1. **Redis Store**: Consider using Redis for distributed rate limiting
2. **Whitelist**: Add trusted IPs for higher limits
3. **Monitoring**: Implement rate limit monitoring
4. **Custom Messages**: Customize error messages per endpoint
5. **Bypass Options**: Add bypass mechanisms for admin users

## Files Created
- `src/middleware/rateLimiter.middleware.js` - Rate limiting configuration
- `src/middleware/cors.middleware.js` - CORS configuration
- `src/config/app.config.js` - Environment configuration
- `src/routes/test-security.routes.js` - Test endpoints
