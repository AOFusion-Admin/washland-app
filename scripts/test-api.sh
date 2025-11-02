# Test store login API
# Run this after starting the dev server with: npm run dev

echo "Testing store login API..."

# Test 1: Invalid request (missing data)
echo "1. Testing with missing data..."
curl -X POST "http://localhost:3000/api/admin/store-login" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Valid request structure (may fail auth)
echo "2. Testing with valid structure..."
curl -X POST "http://localhost:3000/api/admin/store-login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "store.admin@washland.com",
    "password": "admin123",
    "storeId": 1
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Test public stores endpoint
echo "3. Testing public stores endpoint..."
curl -X GET "http://localhost:3000/api/public/stores" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

echo "Test completed!"